import ButtonLink from "@/components/ui/buttonLink/Index";
import Link from "next/link";
import MenuButton from "@/components/common/navbar/components/MenuButton";
import MenuLinks from "@/components/common/navbar/components/MenuLinks";
import clsx from "clsx";
import styles from "@/components/common/navbar/styles/index.module.scss";
import { useCallback } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import { useRouter } from "next/router";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

function Navbar() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [lenis] = useStore(useShallow((state) => [state.lenis]));

  const scrollToPosition = useCallback(
    (position: number, duration: number = 1.5) => {
      if (lenis) {
        (lenis as { scrollTo: (pos: number, opts: Record<string, unknown>) => void }).scrollTo(position, {
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
    if (router.pathname === "/") {
      scrollToPosition(0);
    }
  }, [router.pathname, scrollToPosition]);

  return (
    <>
      <MenuLinks />

      <header className={styles.root} role="banner">
        <div className={styles.innerHeader}>
          <Link onClick={goToTop} aria-label="Go home" scroll={false} href="/">
            <h4 className={clsx("bold", "h4")}>GIATS</h4>
          </Link>

          <div className={styles.rightContainer}>
            {!isMobile && (
              <ButtonLink
                href="mailto:vaggelisgiats@gmail.com"
                label="GET IN TOUCH"
              />
            )}
            <MenuButton />
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
