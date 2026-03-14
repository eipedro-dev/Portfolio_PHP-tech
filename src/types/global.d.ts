// Declarações de tipo para módulos de shader GLSL
declare module '*.frag' {
  const value: string;
  export default value;
}

declare module '*.vert' {
  const value: string;
  export default value;
}

declare module '*.glsl' {
  const value: string;
  export default value;
}

// Declarações de tipo para módulos SCSS
declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

// Declaração de tipo para o store Zustand
declare module '@/store' {
  import { UseBoundStore, StoreApi } from 'zustand';

  interface StoreState {
    lenis: unknown;
    setLenis: (lenis: unknown) => void;
    introOut: boolean;
    setIntroOut: (introOut: boolean) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (isMenuOpen: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    fluidColor: string;
    setFluidColor: (fluidColor: string) => void;
    isAbout: boolean;
    setIsAbout: (isAbout: boolean) => void;
  }

  export const useStore: UseBoundStore<StoreApi<StoreState>>;
}

// Declaração para a biblioteca hamo
declare module '@darkroom.engineering/hamo' {
  export function useWindowSize(): { width: number; height: number };
}
