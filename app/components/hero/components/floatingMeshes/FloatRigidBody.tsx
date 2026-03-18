"use client";

import * as THREE from "three";

import { useEffect, useMemo, useRef, useState } from "react";

import { InstancedRigidBodies } from "@react-three/rapier";
import { MeshTransmissionMaterial } from "@react-three/drei";
import { easing } from "maath";
import { useFrame } from "@react-three/fiber";
import useIsMobile from "@/hooks/useIsMobile";

const accents: string[] = ["#8A2BE2", "#FF1493", "#FFFF00", "#DC143C"];

const r = THREE.MathUtils.randFloatSpread;

// Tipagem das props do componente
interface FloatRigidBodyProps {
  totalCount: number;
  transparentCount: number;
}

// Tipagem de instância para o InstancedRigidBodies
interface RigidInstance {
  key: string;
  position: [number, number, number];
  scale: number;
}

// Tipagem para corpo rígido da API Rapier
interface RigidBodyAPI {
  translation: () => { x: number; y: number; z: number };
  applyImpulse: (force: THREE.Vector3, wakeUp: boolean) => void;
}

export default function FloatRigidBody({
  totalCount,
  transparentCount,
}: FloatRigidBodyProps) {
  const apiNormal = useRef<RigidBodyAPI[] | null>(null);
  const apiTransparent = useRef<RigidBodyAPI[] | null>(null);
  const sphereRef = useRef<THREE.InstancedMesh>(null);
  const isMobile = useIsMobile();

  const [currentAccentIndex, setCurrentAccentIndex] = useState(0);

  const normalCount = totalCount - transparentCount;

  const {
    factors,
    xFactors,
    yFactors,
    zFactors,
    normalInstances,
    transparentInstances,
    colors,
  } = useMemo(() => {
    const factors: number[] = [];
    const xFactors: number[] = [];
    const yFactors: number[] = [];
    const zFactors: number[] = [];
    const normalInstances: RigidInstance[] = [];
    const transparentInstances: RigidInstance[] = [];
    const colors = new Float32Array(normalCount * 3);
    const color = new THREE.Color();

    apiNormal.current = [];
    apiTransparent.current = [];

    for (let i = 0; i < totalCount; i++) {
      const instance: RigidInstance = {
        key: isMobile ? `mobileInstance_${i}` : `desktopInstance_${i}`,
        position: [r(isMobile ? 10 : 20), r(10), r(20)],
        scale: isMobile ? 0.8 : 1,
      };
      factors.push(THREE.MathUtils.randInt(20, 100));

      xFactors.push(THREE.MathUtils.randFloatSpread(isMobile ? 14 : 40));
      yFactors.push(THREE.MathUtils.randFloatSpread(10));
      zFactors.push(THREE.MathUtils.randFloatSpread(10));
      if (i < normalCount) {
        normalInstances.push(instance);
        if ((!isMobile && i < 7) || (isMobile && i < 4)) {
          colors.set(color.set("#1A1A1A").toArray(), i * 3);
        } else {
          colors.set(color.set(accents[0]!).toArray(), i * 3);
        }
      } else {
        transparentInstances.push(instance);
      }
    }

    return {
      factors,
      xFactors,
      yFactors,
      zFactors,
      normalInstances,
      transparentInstances,
      colors,
    };
  }, [isMobile, normalCount, totalCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAccentIndex((prevIndex) => (prevIndex + 1) % accents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    if (apiNormal.current) {
      apiNormal.current.forEach((body: RigidBodyAPI, i: number) => {
        if (apiNormal.current && body) {
          const t = factors[i]! + state.clock.elapsedTime * 0.25;

          const targetPosition = new THREE.Vector3(
            Math.cos(t) +
              Math.sin(t * 1) / 10 +
              xFactors[i]! +
              Math.cos((t / 10) * factors[i]!) +
              (Math.sin(t * 1) * factors[i]!) / 10,
            Math.sin(t) +
              Math.cos(t * 2) / 10 +
              yFactors[i]! +
              Math.sin((t / 10) * factors[i]!) +
              (Math.cos(t * 2) * factors[i]!) / 10,
            Math.sin(t) +
              Math.cos(t * 2) / 10 +
              zFactors[i]! +
              Math.cos((t / 10) * factors[i]!) +
              (Math.sin(t * 3) * factors[i]!) / 4,
          );

          const apiTranslation = body.translation();
          const currentPosition = new THREE.Vector3(
            apiTranslation.x,
            apiTranslation.y,
            apiTranslation.z,
          );

          const direction = new THREE.Vector3().subVectors(
            targetPosition,
            currentPosition,
          );

          const forceMagnitude = 0.5;
          const force = direction.normalize().multiplyScalar(forceMagnitude);

          body.applyImpulse(force, true);
        }
      });

      const newColor = new THREE.Color(accents[currentAccentIndex]!);
      for (let i = !isMobile ? 7 : 4; i < normalCount; i++) {
        const currentColor = new THREE.Color().fromArray(
          Array.from(colors.slice(i * 3, (i + 1) * 3)),
        );
        easing.dampC(currentColor, newColor, 0.1, delta);
        colors.set(currentColor.toArray(), i * 3);
      }

      if (sphereRef.current && sphereRef.current.geometry.attributes.color) {
        sphereRef.current.geometry.attributes.color.needsUpdate = true;
      }
    }

    if (apiTransparent.current) {
      apiTransparent.current.forEach((body: RigidBodyAPI, i: number) => {
        if (apiTransparent.current && body) {
          const t = factors[normalCount + i]! + state.clock.elapsedTime * 0.25;

          const targetPosition = new THREE.Vector3(
            Math.cos(t) +
              Math.sin(t * 1) / 10 +
              xFactors[normalCount + i]! +
              Math.cos((t / 10) * factors[normalCount + i]!) +
              (Math.sin(t * 1) * factors[normalCount + i]!) / 10,
            Math.sin(t) +
              Math.cos(t * 2) / 10 +
              yFactors[normalCount + i]! +
              Math.sin((t / 10) * factors[normalCount + i]!) +
              (Math.cos(t * 2) * factors[normalCount + i]!) / 10,
            Math.sin(t) +
              Math.cos(t * 2) / 10 +
              zFactors[normalCount + i]! +
              Math.cos((t / 10) * factors[normalCount + i]!) +
              (Math.sin(t * 3) * factors[normalCount + i]!) / 4,
          );

          const apiTranslation = body.translation();
          const currentPosition = new THREE.Vector3(
            apiTranslation.x,
            apiTranslation.y,
            apiTranslation.z,
          );

          const direction = new THREE.Vector3().subVectors(
            targetPosition,
            currentPosition,
          );

          const forceMagnitude = 0.5;
          const force = direction.normalize().multiplyScalar(forceMagnitude);

          body.applyImpulse(force, true);
        }
      });
    }
  });

  return (
    <>
      <InstancedRigidBodies
        type="dynamic"
        ref={apiNormal as any}
        colliders="ball"
        instances={normalInstances}
        linearDamping={50}
        angularDamping={50}
        friction={0.1}
      >
        <instancedMesh
          dispose={null}
          ref={sphereRef}
          castShadow
          receiveShadow
          args={[undefined, undefined, normalCount]}
        >
          <sphereGeometry>
            <instancedBufferAttribute
              attach="attributes-color"
              args={[colors, 3]}
            />
          </sphereGeometry>
          <meshStandardMaterial vertexColors roughness={0.5} metalness={0.2} />
        </instancedMesh>
      </InstancedRigidBodies>
      <InstancedRigidBodies
        type="dynamic"
        ref={apiTransparent as any}
        colliders="ball"
        instances={transparentInstances}
        linearDamping={50}
        angularDamping={50}
        friction={0.1}
      >
        <instancedMesh
          dispose={null}
          castShadow
          receiveShadow
          args={[undefined, undefined, transparentCount]}
        >
          <sphereGeometry />
          <MeshTransmissionMaterial
            samples={10}
            transmission={1.0}
            roughness={0}
            thickness={4}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.2}
            distortion={0}
            displacementScale={0.3}
            temporalDistortion={0.5}
            clearcoat={1}
            attenuationDistance={0.5}
          />
        </instancedMesh>
      </InstancedRigidBodies>
    </>
  );
}
