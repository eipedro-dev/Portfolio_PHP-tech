import { useFBO } from '@react-three/drei';
import { useRef } from 'react';
import { WebGLRenderTarget } from 'three';

// Interface para o objeto FBO duplo
interface DoubleFBO {
  read: WebGLRenderTarget;
  write: WebGLRenderTarget;
  swap: () => void;
  dispose: () => void;
}

const useDoubleFBO = (width: number, height: number, options: Record<string, unknown>): DoubleFBO => {
  const read = useFBO(width, height, options);

  const write = useFBO(width, height, options);

  const fbo = useRef<DoubleFBO>({
    read,
    write,
    swap: () => {
      const temp = fbo.read;
      fbo.read = fbo.write;
      fbo.write = temp;
    },
    dispose: () => {
      read.dispose();
      write.dispose();
    },
  }).current;

  return fbo;
};
export default useDoubleFBO;
