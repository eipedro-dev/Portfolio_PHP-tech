"use client";

import clsx from "clsx";
import { use, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

import AppearTitle from "@/components/ui/appearTitle/Index";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { WhyItem } from "./components/whyItem";

import styles from "./styles/wyItMatters.module.scss";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Item {
  number: string;
  title: string;
  desc: string;
}

// Augment React's CSSProperties to accept CSS custom properties
type CSSPropertiesWithVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const ITEMS: Item[] = [
  {
    number: "01",
    title: "Trabalha enquanto você dorme",
    desc: "Enquanto você está em reunião, atendendo um cliente ou simplesmente descansando, seu site está recebendo visitas, seu sistema está rodando e suas automações estão executando — sem parar.",
  },
  {
    number: "02",
    title: "Fala com quem importa",
    desc: "Diferente de uma solução genérica, o que construo tem foco. Uma identidade clara, um objetivo definido, uma experiência que comunica exatamente o que o seu negócio precisa dizer.",
  },
  {
    number: "03",
    title: "Converte antes da reunião",
    desc: "O visitante chega com dúvida e sai convencido, ou pelo menos curioso o suficiente para entrar em contato. É isso que um site bem estruturado e um sistema bem pensado fazem.",
  },
  {
    number: "04",
    title: "Posiciona antes de vender",
    desc: "Design limpo, identidade forte e execução técnica de qualidade comunicam autoridade antes de qualquer conversa sobre preço ou serviço.",
  },
  {
    number: "05",
    title: "Entrega dados para você melhorar",
    desc: "Com um site ou sistema feito sob medida, você sabe exatamente o que está funcionando e o que precisa ajustar. Sem achismo, sem depender de plataforma de terceiro.",
  },
];

// ─── WhyItMatters ─────────────────────────────────────────────────────────────

export const WhyItMatters = () => {
  const rootRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          scroller: document?.querySelector("main"),
          invalidateOnRefresh: true,
        },
      });
    }, rootRef);

    return () => ctx.kill();
  }, []);

  return (
    <section ref={rootRef} className={styles.root}>
      <div className={clsx(styles.inner, "layout-block-inner")}>
        {/* Left */}
        <div ref={leftRef} className={styles.left}>
          <p className={clsx(styles.sectionLabel, "p-xs")}>
            POR QUE O QUE VOCÊ CONTRATA IMPORTA
          </p>
          <AppearTitle>
            <h2 className={clsx(styles.heading, "h3", "bold")}>
              Por que o que você contrata importa?
            </h2>
          </AppearTitle>
          <p className={clsx(styles.body, "p")}>
            Seu cliente em potencial vai te pesquisar antes de te contratar. O
            que ele encontrar vai definir se ele avança ou some. Um site,
            sistema ou automação bem feito não é só tecnologia — é o argumento
            mais forte que o seu negócio tem no digital.
          </p>
        </div>

        {/* Right */}
        <div className={styles.right}>
          {ITEMS.map((item, i) => (
            <WhyItem key={item.number} item={item} index={i} />
          ))}
          <div className={styles.lastDivider} />
        </div>
      </div>
    </section>
  );
};
