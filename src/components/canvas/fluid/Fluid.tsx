/* eslint-disable @react-three/no-new-in-loop */

import { Camera, Mesh, Scene, ShaderMaterial, Texture, Vector2, Vector3, WebGLRenderTarget } from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { RefObject, useCallback, useRef } from 'react';

import Effect from '@/components/canvas/fluid/effect/Fluid';
import useFBOs from '@/components/canvas/fluid/hooks/useFBOs';
import useMaterials from '@/components/canvas/fluid/hooks/useMaterials';
import useOpts from '@/components/canvas/fluid/hooks/useOpts';
import usePointerEvents from '@/components/canvas/fluid/hooks/usePointerEvents';

// Tipagem das props do componente Fluid
interface FluidProps {
  mainRef: RefObject<HTMLElement | null>;
  fluidColor: string;
}

// Tipo para os nomes de materiais disponíveis
type MaterialName = 'splat' | 'curl' | 'clear' | 'divergence' | 'pressure' | 'gradientSubstract' | 'advection' | 'vorticity';

// Tipo para os nomes de FBOs disponíveis
type FBOName = 'density' | 'velocity' | 'pressure' | 'divergence' | 'curl';

function Fluid({ mainRef, fluidColor }: FluidProps) {
  const OPTS = useOpts();
  const { force, radius, curl, swirl, intensity, backgroundColor, showBackground, pressure, densityDissipation, velocityDissipation } = OPTS;
  const size = useThree((three) => three.size);
  const gl = useThree((three) => three.gl);

  const bufferScene = useRef(new Scene());
  const bufferCamera = useRef(new Camera());
  const meshRef = useRef<Mesh>(null);
  const postRef = useRef(null);
  const FBOs = useFBOs();
  const materials = useMaterials();
  const splatStack = usePointerEvents(mainRef, size, force);

  const setShaderMaterial = useCallback(
    (name: MaterialName) => {
      if (!meshRef.current) return;
      meshRef.current.material = materials[name];
      meshRef.current.material.needsUpdate = true;
    },
    [materials],
  );

  const setRenderTarget = useCallback(
    (name: FBOName) => {
      const target = FBOs[name] as unknown as Record<string, unknown>;
      if ('write' in target) {
        gl.setRenderTarget(target.write as WebGLRenderTarget);
        gl.clear();
        gl.render(bufferScene.current, bufferCamera.current);
        (target as { swap: () => void }).swap();
      } else {
        gl.setRenderTarget(target as unknown as WebGLRenderTarget);
        gl.clear();
        gl.render(bufferScene.current, bufferCamera.current);
      }
    },
    [bufferCamera, bufferScene, FBOs, gl],
  );

  const setUniforms = useCallback(
    (material: MaterialName, uniform: string, value: unknown) => {
      const mat = materials[material] as ShaderMaterial;
      if (mat && mat.uniforms[uniform]) {
        mat.uniforms[uniform].value = value;
      }
    },
    [materials],
  );

  useFrame(() => {
    if (!meshRef.current || !postRef.current) return;

    while (splatStack.current.length > 0) {
      const splat = splatStack.current.pop();
      if (!splat) continue;
      const { mouseX, mouseY, velocityX, velocityY } = splat;

      setShaderMaterial('splat');
      setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
      setUniforms('splat', 'uPointer', new Vector2(mouseX, mouseY));
      setUniforms('splat', 'uColor', new Vector3(velocityX, velocityY, 10.0));
      setUniforms('splat', 'uRadius', radius / 100.0);
      setRenderTarget('velocity');
      setUniforms('splat', 'uTarget', FBOs.density.read.texture);
      setRenderTarget('density');
    }

    const shaderUpdates: Array<{ material: MaterialName; uniforms: Record<string, unknown>; target: FBOName }> = [
      { material: 'curl', uniforms: { uVelocity: FBOs.velocity.read.texture }, target: 'curl' },
      { material: 'vorticity', uniforms: { uVelocity: FBOs.velocity.read.texture, uCurl: FBOs.curl.texture, uCurlValue: curl }, target: 'velocity' },
      { material: 'divergence', uniforms: { uVelocity: FBOs.velocity.read.texture }, target: 'divergence' },
      { material: 'clear', uniforms: { uTexture: FBOs.pressure.read.texture, uClearValue: pressure }, target: 'pressure' },
    ];

    shaderUpdates.forEach(({ material, uniforms, target }) => {
      setShaderMaterial(material);
      Object.entries(uniforms).forEach(([key, value]) => setUniforms(material, key, value));
      setRenderTarget(target);
    });

    setShaderMaterial('pressure');
    setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);
    for (let i = 0; i < swirl; i += 1) {
      setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
      setRenderTarget('pressure');
    }

    setShaderMaterial('gradientSubstract');
    setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
    setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
    setRenderTarget('velocity');

    setShaderMaterial('advection');
    setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
    setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
    setUniforms('advection', 'uDissipation', velocityDissipation);
    setRenderTarget('velocity');

    setUniforms('advection', 'uSource', FBOs.density.read.texture);
    setUniforms('advection', 'uDissipation', densityDissipation);
    setRenderTarget('density');

    gl.setRenderTarget(null);
    gl.clear();
  }, 0);

  return (
    <>
      {createPortal(
        <mesh ref={meshRef} scale={[1, 1, 0]}>
          <planeGeometry args={[2, 2, 1, 1]} />
        </mesh>,
        bufferScene.current,
      )}
      <Effect
        intensity={intensity * 0.0001}
        backgroundColor={backgroundColor}
        fluidColor={fluidColor}
        showBackground={showBackground}
        ref={postRef}
        tFluid={FBOs?.density?.read?.texture || new Texture()}
      />
    </>
  );
}
export default Fluid;
