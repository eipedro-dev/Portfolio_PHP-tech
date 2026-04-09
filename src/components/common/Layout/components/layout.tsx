"use client";

import styles from "@/components/common/Layout/styles/layout.module.scss";

import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Transition as ReactTransition,
  SwitchTransition,
} from "react-transition-group";
import gsap from "gsap";

import Footer from "@/components/common/Footer";
import { useStore } from "@/store";

// Removida definição de props conflitante Any
interface LayoutProps {
  children: React.ReactNode;
  layoutRef: React.RefObject<HTMLDivElement | null>;
  mainRef: React.RefObject<HTMLElement | null>;
  router: { asPath: string };
}

export function Layout({ children, layoutRef, mainRef, router }: LayoutProps) {
  const lenis = useStore((state) => state.lenis);
  const introOut = useStore((state) => state.introOut);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const setIsMenuOpen = useStore((state) => state.setIsMenuOpen);
  const setIsAbout = useStore((state) => state.setIsAbout);

  const enterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const exitTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isEntering, setIsEntering] = useState(false);

  const menuTime = useMemo(() => (isMenuOpen ? 0.8 : 0), [isMenuOpen]);

  const handleEnter = useCallback(
    () => {
      if (introOut) {
        if (exitTimelineRef.current) exitTimelineRef.current.pause();

        const tl = gsap.timeline({
          onComplete: () => {
            setIsAbout(router.asPath === "/about");
            setIsLoading(false);
            if (typeof window !== "undefined") {
              const globalLenis = (
                window as unknown as { lenis: { start: () => void } }
              )?.lenis;
              if (globalLenis) globalLenis.start();
            }
          },
        });

        enterTimelineRef.current = tl;
        setIsEntering(true);

        if (layoutRef.current && mainRef.current) {
          tl.set(
            layoutRef.current,
            {
              ease: "power2.inOut",
              height: "90%",
              opacity: 1,
              onComplete: () => {
                setIsAbout(router.asPath === "/about");
                setIsEntering(false);
              },
            },
            2.5,
          )
            .to(
              "#loader",
              {
                x: "-100%",
                ease: "power2.inOut",
              },
              2.5,
            )
            .to(
              mainRef.current,
              {
                ease: "power2.inOut",
                x: "0px",
              },
              2.5,
            )
            .to(
              mainRef.current,
              {
                ease: "power2.inOut",
                borderRadius: 0,
                scale: 1,
              },
              3,
            )
            .to(
              layoutRef.current,
              {
                ease: "power2.inOut",
                height: "100%",
                opacity: 1,
              },
              3,
            )
            .to(
              "header",
              {
                ease: "power2.inOut",
                autoAlpha: 1,
              },
              3.3,
            )
            .to(
              mainRef.current,
              {
                ease: "power2.inOut",
                height: "auto",
                border: "none",
                pointerEvents: "auto",
              },
              3.3,
            );
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [introOut, layoutRef, mainRef, router.asPath, setIsAbout, setIsLoading],
  );

  const handleExit = useCallback(
    () => {
      if (introOut) {
        if (enterTimelineRef.current) enterTimelineRef.current.pause();

        if (lenis) (lenis as { stop: () => void }).stop();
        if (isMenuOpen) {
          (setIsMenuOpen as (val: boolean) => void)(false);
        }
        if (isEntering === false) {
          const tl = gsap.timeline({
            onComplete: () => {
              setIsLoading(true);
              if (lenis)
                (
                  lenis as {
                    scrollTo: (y: number, obj: Record<string, unknown>) => void;
                  }
                ).scrollTo(0, { force: true });
            },
          });

          exitTimelineRef.current = tl;

          if (document?.getElementById("scrollbar")) {
            tl.to(
              document.getElementById("scrollbar"),
              {
                ease: "power2.inOut",
                autoAlpha: 0,
                duration: 0.5,
              },
              menuTime,
            );
          }

          if (layoutRef.current && mainRef.current) {
            tl.to(
              "header",
              {
                ease: "power2.inOut",
                autoAlpha: 0,
                duration: 0.5,
                onComplete: () => {
                  gsap.set("#loader", {
                    scale: 0.9,
                    x: "100%",
                    borderRadius: "1.3888888889vw",
                  });
                  gsap.set("header", {
                    left: 0,
                    top: 0,
                    scale: 1,
                    duration: 0,
                  });
                },
                overwrite: true,
              },
              menuTime,
            )
              .to(
                layoutRef.current,
                {
                  ease: "power2.inOut",
                  height: "90svh",
                  opacity: 1,
                  duration: 0.5,
                },
                menuTime,
              )
              .to(
                mainRef.current,
                {
                  ease: "power2.inOut",
                  scale: 0.9,
                  opacity: 1,
                  border: "2px solid #f0f4f1",
                  borderRadius: "1.3888888889vw",
                  duration: 0.5,
                },
                menuTime,
              )
              .to(
                mainRef.current,
                {
                  ease: "power2.inOut",
                  x: "-100%",
                  duration: 0.5,
                },
                0.5 + menuTime,
              )
              .to(
                "#loader",
                {
                  ease: "power2.inOut",
                  x: "0px",
                  duration: 0.5,
                },
                0.5 + menuTime,
              )
              .set(mainRef.current, {
                x: "100%",
              });
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      introOut,
      lenis,
      isMenuOpen,
      isEntering,
      layoutRef,
      mainRef,
      menuTime,
      setIsLoading,
      setIsMenuOpen,
    ],
  );

  return (
    <>
      <SwitchTransition>
        <ReactTransition
          key={router.asPath}
          in={false}
          unmountOnExit
          timeout={{
            enter: introOut ? 4500 : 0,
            exit: introOut ? 2550 : 0,
          }}
          onEnter={handleEnter}
          onExit={handleExit}
        >
          {children}
        </ReactTransition>
      </SwitchTransition>

      <footer className={styles.footer}>
        <Footer />
      </footer>
    </>
  );
}
