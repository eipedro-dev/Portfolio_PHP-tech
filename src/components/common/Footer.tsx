"use client";

import Link from "next/link";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import clsx from "clsx";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWindowSize } from "@darkroom.engineering/hamo";

import AppearTitle from "@/components/ui/appearTitle/Index";
import LinkText from "@/components/ui/linkText/Index";
import footerLinks from "@/components/common/navbar/constants/footerLinks";
import menuLinks from "@/components/common/navbar/constants/menuLinks";
import styles from "@/components/common/styles/footer.module.scss";

import useIsMobile from "@/hooks/useIsMobile";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useStore } from "@/store";

const GoTop = dynamic(() => import("@/components/common/GoTop"), {
  ssr: false,
});

function Footer() {
  const isMobile = useIsMobile();
  const footerRef = useRef<HTMLElement>(null);
  const isLoading = useStore((state) => state.isLoading);
  const windowSize = useWindowSize();

  useIsomorphicLayoutEffect(() => {
    if (!isLoading) {
      const setupFooterAnimation = () => {
        if (!footerRef.current) return;
        gsap.set(footerRef.current, { height: "auto" });
        const allSections = document.querySelectorAll("#mainContainer section");
        if (allSections.length > 1) {
          const lastSection = allSections[allSections.length - 2];
          if (footerRef.current.offsetHeight <= windowSize.height) {
            gsap.set(footerRef.current, { yPercent: -50 });
            const uncover = gsap.timeline({ paused: true });
            gsap.set(footerRef.current, { height: "100.5svh" });
            uncover.to(footerRef.current, {
              yPercent: 0,
              ease: "none",
            });
            ScrollTrigger.create({
              id: "footerTrigger",
              trigger: lastSection as Element,
              start: "bottom bottom",
              end: "+=100%",
              animation: uncover,
              scrub: true,
              scroller: document?.querySelector("main"),
            });
          } else {
            gsap.set(footerRef.current, {
              transform: "translate(0%, 0%)",
              height: "auto",
            });
          }
        }
      };

      setupFooterAnimation();
    }

    return () => {
      const footerTrigger = ScrollTrigger.getById("footerTrigger");
      if (footerTrigger) {
        footerTrigger.kill();
      }
    };
  }, [isLoading, windowSize.height]);

  return (
    <section
      ref={footerRef}
      className={clsx(styles.root, "layout-grid-inner")}
      role="contentinfo"
    >
      <div
        style={{ gridColumn: isMobile ? "1 / 3" : "1 / 5" }}
        className={styles.linksContainer}
      >
        <AppearTitle isFooter>
          <h6 className={clsx(styles.title, "h6")}>Sitemap</h6>
          {menuLinks.slice(0, -1).map((link) => (
            <div key={link.title} className={styles.linkTextContainer}>
              <LinkText
                className={styles.linkText as string}
                title={link.title}
                href={link.href as string}
                spanX={0}
                svgX={0}
              >
                <span className="footer">{link.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>
      <div
        style={{ gridColumn: isMobile ? "3 / 7" : "5 / 9" }}
        className={styles.linksContainer}
      >
        <AppearTitle isFooter>
          <h6 className={clsx(styles.title, "h6")}>Me Siga</h6>
          {footerLinks.map((link) => (
            <div key={link.title} className={styles.linkTextContainer}>
              <LinkText
                target
                className={styles.linkText as string}
                title={link.title}
                href={link.href as string}
                spanX={0}
                svgX={0}
              >
                <span className="footer">{link.title}</span>
              </LinkText>
            </div>
          ))}
        </AppearTitle>
      </div>
      <div className={styles.emailContaineer}>
        <AppearTitle isFooter>
          <h4 className={clsx(styles.workWithMe, "h4")}>Trabalhe Comigo:</h4>
          <div>
            <div className={styles.link}>
              <Link
                aria-label="Send email"
                scroll={false}
                href="mailto:pedrohdev01@gmail.com"
              >
                <h4 className={clsx(styles.email, "h4")}>
                  pedrohdev01@gmail.com
                </h4>
              </Link>
              {/* class="link__graphic link__graphic--slide" */}
              <svg
                className={clsx(styles.linkGraphic)}
                width="300%"
                height="100%"
                viewBox="0 0 1200 60"
                preserveAspectRatio="none"
              >
                <path d="M0,56.5c0,0,298.666,0,399.333,0C448.336,56.5,513.994,46,597,46c77.327,0,135,10.5,200.999,10.5c95.996,0,402.001,0,402.001,0" />
              </svg>
            </div>
          </div>
        </AppearTitle>
      </div>
      <div
        className={styles.middleContainer}
        style={{
          gridColumn: "13 / 17",
          textAlign: isMobile ? "left" : "right",
        }}
      >
        <AppearTitle isFooter>
          <div className="p-x">© 2025 · Evangelos Giatsidis</div>
          <div className={clsx("p-x", styles.middleText)}>
            All Rights Reserved
          </div>
        </AppearTitle>
      </div>

      <div className={styles.giats}>
        <span>PEDRO H</span>
      </div>
      <div className={styles.goToTop}>
        <GoTop />
      </div>
    </section>
  );
}

export default Footer;
