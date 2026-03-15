"use client";

import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useShallow } from "zustand/react/shallow";

import styles from "@/components/common/styles/footer.module.scss";

import Arrow from "@/components/common/Arrow";
import { useStore } from "@/store";

function GoTop() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const relsRef = useRef({ relX: 0, relY: 0 });
  const lenis = useStore((state) => state.lenis);

  const scrollToTop = useCallback(() => {
    (
      lenis as {
        scrollTo: (target: number, options: Record<string, unknown>) => void;
        start: () => void;
      }
    ).scrollTo(0, {
      duration: 1.5,
      force: true,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      onComplete: () => {
        (lenis as { start: () => void }).start();
      },
    });
  }, [lenis]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = buttonRef.current;
      const span = spanRef.current;
      if (!button || !span) return;

      const { clientY } = e;
      const parentOffset = button.getBoundingClientRect();
      const isTop = clientY < parentOffset.top + parentOffset.height / 2;
      const relX = ((e.pageX - parentOffset.left) / parentOffset.width) * 100;
      const relY = isTop ? 0 : 100;

      relsRef.current = { relX, relY };

      gsap.context(() => {
        gsap.set(span, { top: `${relY}%`, left: `${relX}%` });

        gsap.to(span, {
          duration: 0.6,
          ease: "cubic-bezier(.4,0,.1,1)",
        });
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    const span = spanRef.current;
    if (!span) return;

    const { relX, relY } = relsRef.current;

    gsap.context(() => {
      gsap.to(span, {
        duration: 0.6,
        top: `${relY}%`,
        left: `${relX}%`,
        ease: "cubic-bezier(.4,0,.1,1)",
      });
    });
  }, []);

  return (
    <button
      type="button"
      ref={buttonRef}
      aria-label="Go top"
      onClick={scrollToTop}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={styles.circleButton}
    >
      <Arrow className={styles.arrowClassic} />
      <span className={styles.ball} ref={spanRef} />
    </button>
  );
}

export default GoTop;
