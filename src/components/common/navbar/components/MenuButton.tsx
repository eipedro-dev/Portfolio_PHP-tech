"use client";

import clsx from "clsx";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import PerspectiveText from "@/components/ui/perspectiveText/Index";
import styles from "@/components/common/navbar/styles/menuButton.module.scss";
import { useStore } from "@/store";

function MenuButton() {
  const [setIsMenuOpen, lenis, isLoading] = useStore(
    useShallow((state) => [state.setIsMenuOpen, state.lenis, state.isLoading]),
  );

  const handleClick = useCallback(() => {
    if (!isLoading) {
      (setIsMenuOpen as (v: boolean) => void)(true);
      (lenis as { stop: () => void }).stop();
    }
  }, [isLoading, setIsMenuOpen, lenis]);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Open Menu"
      aria-expanded={false}
      aria-controls="menu"
      className={clsx("p-xs", styles.button)}
    >
      <PerspectiveText label="Menu" className={clsx("p-xs", styles.label)} />
    </button>
  );
}

export default MenuButton;
