"use client";

import styles from "@/components/common/Layout/styles/layout.module.scss";

import * as THREE from "three";

import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Tempus from "@darkroom.engineering/tempus";
import { View } from "@react-three/drei";
import { gsap } from "gsap";
import { useShallow } from "zustand/react/shallow";

import Background from "@/components/canvas/background/Index";
import { useStore } from "@/store";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import useScroll from "@/hooks/useScroll";
import useFoucFix from "@/hooks/useFoucFix";
import Scrollbar from "@/components/common/Scrollbar";
import Loader from "@/components/common/Loader";
import { Navbar } from "@/components/common/navbar/Index";
import Fluid from "@/components/canvas/fluid/Fluid";
import { Layout } from "@/components/common/Layout/components/layout";

interface LayoutProps {
  children: React.ReactNode;
  router: { asPath: string };
}

if (typeof window !== "undefined") {
  gsap.defaults({ ease: "none" });
  gsap.registerPlugin(ScrollTrigger);

  gsap.ticker.lagSmoothing(0);
  gsap.ticker.remove(gsap.updateRoot);
  Tempus?.add((time: number) => {
    gsap.updateRoot(time / 1000);
  }, 0);

  window.scrollTo(0, 0);
  window.history.scrollRestoration = "manual";
  ScrollTrigger.clearScrollMemory(window.history.scrollRestoration);
}

export function MainLayout({ children, router }: LayoutProps) {
  const lenis = useStore((state) => state.lenis);
  const setLenis = useStore((state) => state.setLenis);
  const fluidColor = useStore((state) => state.fluidColor);
  const isAbout = useStore((state) => state.isAbout);

  const mainRef = useRef<HTMLElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useFoucFix();
  useScroll(() => ScrollTrigger.update());

  useIsomorphicLayoutEffect(() => {
    // eslint-disable-next-line no-shadow
    const createLenis = new Lenis({
      smoothWheel: true,
      syncTouch: true,
      // TypeScript/Lenis options podem não aceitar wrapper direto nas propriedades na nova lib
      // Porém caso suporte usamos Object.assign ou ignoramos.
    } as any);

    if (mainRef.current && mainContainerRef.current) {
      // Fallback de binds
    }

    setLenis(createLenis);
    createLenis.stop();

    return () => {
      createLenis.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  useIsomorphicLayoutEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh();
    }
  }, [lenis]);

  useIsomorphicLayoutEffect(() => {
    if (lenis) {
      ScrollTrigger.refresh();
      gsap.ticker.add((time) => {
        (lenis as { raf: (t: number) => void }).raf(time * 1000);
      });
    }
    return () => gsap.ticker.remove((time) => (lenis as any)?.raf(time * 1000));
  }, [lenis]);

  const domElements = useMemo(
    () => (
      <>
        <Loader />
        <div className={styles.background}>
          <Background />
        </div>
        <Scrollbar />
        <Navbar />
      </>
    ),
    [],
  );

  const canvasElements = useMemo(
    () => (
      <Canvas
        gl={{
          outputColorSpace:
            isAbout === false
              ? THREE.LinearSRGBColorSpace
              : THREE.SRGBColorSpace,
        }}
        style={{ zIndex: 0 }}
        resize={{ debounce: { resize: 0, scroll: 0 } }}
        className={styles.canvasContainer}
        dpr={[0.5, 1.5]}
      >
        <View.Port />
      </Canvas>
    ),
    [isAbout],
  );

  return (
    <>
      <div className={styles.root}>
        {domElements}
        <div ref={layoutRef} id="layout" className={styles.layout}>
          {canvasElements}
          <Canvas
            id="fluidCanvas"
            flat
            gl={{
              antialias: false,
              stencil: false,
              depth: false,
            }}
            style={{ mixBlendMode: "difference", background: "black" }}
            linear
            className={styles.canvasContainer}
            eventSource={mainRef as React.RefObject<HTMLElement>}
            dpr={[0.1, 0.5]}
          >
            <EffectComposer>
              <Fluid fluidColor={fluidColor as string} mainRef={mainRef} />
            </EffectComposer>
          </Canvas>
          <main ref={mainRef} className={styles.main}>
            <div
              ref={mainContainerRef}
              id="mainContainer"
              className={styles.mainContainer}
            >
              <Layout layoutRef={layoutRef} mainRef={mainRef} router={router}>
                {children}
              </Layout>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
