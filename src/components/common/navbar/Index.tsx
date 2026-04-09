"use client";

import Link from "next/link";
import clsx from "clsx";
import { useCallback } from "react";
import { usePathname } from "next/navigation";

import ButtonLink from "@/components/ui/buttonLink/Index";
import MenuButton from "@/components/common/navbar/components/MenuButton";
import MenuLinks from "@/components/common/navbar/components/MenuLinks";
import styles from "@/components/common/navbar/styles/index.module.scss";

import useIsMobile from "@/hooks/useIsMobile";
import { useStore } from "@/store";

const email = "pedrohdev01@gmail.com";

export function Navbar() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const lenis = useStore((state) => state.lenis);

  const scrollToPosition = useCallback(
    (position: number, duration: number = 1.5) => {
      if (lenis) {
        (
          lenis as {
            scrollTo: (pos: number, opts: Record<string, unknown>) => void;
          }
        ).scrollTo(position, {
          duration,
          force: true,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            (lenis as { start: () => void }).start();
          },
        });
      }
    },
    [lenis],
  );

  const goToTop = useCallback(() => {
    if (pathname === "/") {
      scrollToPosition(0);
    }
  }, [pathname, scrollToPosition]);

  return (
    <>
      <MenuLinks />

      <header className={styles.root} role="banner">
        <div className={styles.innerHeader}>
          <Link onClick={goToTop} aria-label="Go home" scroll={false} href="/">
            <h4 className={clsx("bold", "h4")}>PEDRO</h4>
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile && (
              <ButtonLink href={`mailto:${email}`} label="Entre em contato" />
            )}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}
