"use client";

import AppearTitle from "@/components/ui/appearTitle/Index";
import ButtonLink from "@/components/ui/buttonLink/Index";
import Image from "next/image";
import clsx from "clsx";
import { gsap } from "gsap";
import styles from "./styles/about.module.scss";
import useIsMobile from "@/hooks/useIsMobile";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useRef } from "react";

export const About = () => {
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLElement>(null);
  const animatedImageRef = useRef<HTMLDivElement>(null);

  const setupScrollAnimation = (): gsap.Context => {
    const ctx = gsap.context(() => {
      if (!animatedImageRef.current) return;
      gsap.set(animatedImageRef.current, { top: !isMobile ? "-20vw" : "0" });
      if (!isMobile && animatedImageRef.current) {
        gsap.to(animatedImageRef.current, {
          top: "20vw",
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller: document?.querySelector("main"),
            invalidateOnRefresh: true,
          },
        });
      }
    });

    return ctx;
  };

  useIsomorphicLayoutEffect(() => {
    const ctx = setupScrollAnimation();
    return () => ctx.kill();
  }, [isMobile]);

  const renderImageContainer = (): JSX.Element => (
    <div className={styles.imageContainer}>
      <Image
        priority
        src="/pedro/PedroH.jpg"
        sizes="100%"
        fill
        alt="Pedro Henrique"
      />
    </div>
  );

  return (
    <section ref={rootRef} className={styles.root}>
      <div className={clsx(styles.nameContainer, "layout-block-inner")}>
        <AppearTitle>
          <h1 className={clsx("h1", "medium")}>
            Olá, Meu nome é <br />
            Pedro Henrique!
          </h1>
        </AppearTitle>
      </div>

      <div className={clsx(styles.container, "layout-grid-inner")}>
        {isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapper)} ref={animatedImageRef}>
          <AppearTitle>
            <div className="p-l">
              “Trago soluções que funcionam: criativas, eficientes e alinhadas
              com o que o seu projeto realmente precisa.”
            </div>
          </AppearTitle>
        </div>
        {!isMobile ? renderImageContainer() : null}
        <div className={clsx(styles.descWrapperBottom)}>
          <AppearTitle>
            <h6 className="h6">
              Sou desenvolvedor e resolvedor de problemas.
              <br /> Construo aplicações web com código limpo e foco em
              resultado — para quem quer mais do que um site que funciona.
            </h6>
          </AppearTitle>
          <div className={clsx(styles.buttonContainer)}>
            <ButtonLink href="/about" label="SOBRE MIM" />
          </div>
        </div>
      </div>
    </section>
  );
};
