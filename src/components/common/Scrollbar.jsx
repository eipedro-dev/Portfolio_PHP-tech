import styles from "@/components/common/styles/scrollbar.module.scss";

import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import gsap from "gsap";

import useScroll from "@/hooks/useScroll";

import { useStore } from "@/store";

export default function Scrollbar() {
  const progressBar = useRef();
  const scrollbarRef = useRef();
  const [isLoading, isMenuOpen, introOut] = useStore(
    useShallow((state) => [state.isLoading, state.isMenuOpen, state.introOut]),
  );
  let fadeTimeout;

  const updateScrollbar = (scroll, limit) => {
    const progress = scroll / limit;
    const maxTopValueInVh = 80 - 6;
    const newTopValueInVh = Math.min(
      maxTopValueInVh,
      progress * maxTopValueInVh,
    );

    gsap.to(progressBar.current, {
      top: `${newTopValueInVh}svh`,
      duration: 0.3,
    });
  };

  useScroll(({ scroll, limit }) => {
    if (!isLoading && !isMenuOpen) {
      gsap.to(scrollbarRef.current, { opacity: 1, duration: 0.3 });
      updateScrollbar(scroll, limit);

      clearTimeout(fadeTimeout);
      fadeTimeout = setTimeout(() => {
        if (scrollbarRef?.current) {
          gsap.to(scrollbarRef.current, { opacity: 0, duration: 0.5 });
        }
      }, 1500);
    }
  });

  useEffect(
    () => () => {
      clearTimeout(fadeTimeout);
    },
    [fadeTimeout],
  );

  if (isLoading && introOut) {
    return null;
  }

  return (
    <div
      id="scrollbar"
      ref={scrollbarRef}
      className={styles.scrollbar}
      aria-hidden="true"
    >
      <div ref={progressBar} className={styles.inner} />
    </div>
  );
}
