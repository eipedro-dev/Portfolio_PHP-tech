import { MutableRefObject, RefObject, useEffect, useRef } from 'react';

import Link from 'next/link';
import clsx from 'clsx';
import footerLinks from '@/components/common/navbar/constants/footerLinks';
import gsap from 'gsap';
import menuLinks from '@/components/common/navbar/constants/menuLinks';
import projectsLinks from '@/components/common/navbar/constants/projectsLinks';
import styles from '@/components/common/navbar/styles/menuLinks.module.scss';
import useIsMobile from '@/hooks/useIsMobile';
import { useRouter } from 'next/router';
import { useStore } from '@/store';

// Interface para os links do menu
interface MenuLink {
  title: string;
  href?: string;
}

// Interface para as refs do menu
interface MenuRefs {
  menuRef: RefObject<HTMLElement | null>;
  menuLinksItemsRef: MutableRefObject<(HTMLDivElement | null)[]>;
}

function MenuLinks() {
  const timeline = useRef(gsap.timeline({ paused: true, defaults: { duration: 0.92, ease: 'expo.inOut' } }));
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen, lenis, isLoading] = useStore((state) => [state.isMenuOpen, state.setIsMenuOpen, state.lenis, state.isLoading]);
  const menuRef = useRef<HTMLElement>(null);
  const menuLinksItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const router = useRouter();

  const setupMenuAnimation = (gsapTimeline: gsap.core.Timeline, refs: MenuRefs) => {
    const fluidCanvas = document?.getElementById('fluidCanvas');
    const layout = document?.getElementById('layout');
    const scrollbar = document?.getElementById('scrollbar');
    const header = document?.querySelector('header');

    gsap.set(refs.menuRef.current, { pointerEvents: 'none', autoAlpha: 0 });
    gsap.set(refs.menuLinksItemsRef.current, { x: '-100%' });

    gsapTimeline
      .to(refs.menuRef.current, { autoAlpha: 1, stagger: 0.01, pointerEvents: 'auto' }, 0)
      .to(fluidCanvas, { duration: 0, opacity: 0 }, 0)
      .to(refs.menuLinksItemsRef.current, { x: 0, stagger: 0.016, pointerEvents: 'auto' }, 0)
      .to('main', { borderRadius: '1.3888888889vw', border: '2px solid #f0f4f1', scale: 0.9, pointerEvents: 'none', left: '-40vw' }, 0)
      .to(layout, { opacity: isMobile ? 0.05 : 0.3, height: '90svh' }, 0)
      .to(scrollbar, { opacity: 0, right: '46vw', scale: 0.9 }, 0)
      .to(header, { autoAlpha: 0, left: '-40vw', top: isMobile ? '6vw' : '3vw', scale: 0.9, overwrite: true }, 0);
  };

  useEffect(() => {
    const tl = timeline.current;
    const refs: MenuRefs = { menuRef, menuLinksItemsRef };
    const ctx = gsap.context(() => {
      setupMenuAnimation(tl, refs);
    });

    return () => {
      if (tl) {
        tl.kill();
      }
      ctx.kill();
    };
  }, [isLoading, isMobile]);

  useEffect(() => {
    const tl = timeline.current;
    if (isMenuOpen) {
      tl.play();
    } else {
      tl.reverse();
    }
  }, [isMenuOpen]);

  const goToBottom = () => {
    (setIsMenuOpen as (v: boolean) => void)(false);

    setTimeout(() => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        const mainHeight = mainElement.scrollHeight;
        (lenis as { scrollTo: (pos: number, opts: Record<string, unknown>) => void }).scrollTo(mainHeight, {
          duration: 1.5,
          force: true,
          easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
          onComplete: () => {
            (lenis as { start: () => void }).start();
          },
        });
      }
    }, 850);
  };

  const renderMenuLinks = (links: MenuLink[], _refs: MutableRefObject<(HTMLDivElement | null)[]>, pathname: string) =>
    links.map((link: MenuLink, index: number) => (
      <div
        ref={(el) => {
          menuLinksItemsRef.current[index + 1] = el;
        }}
        key={link.title}
        className={clsx(styles.menuListItem, pathname === link.href && styles.menuListItemActive)}
      >
        {link.href !== undefined ? (
          <Link aria-label={`Go ${link.title}`} scroll={false} href={link.href}>
            <span>{link.title}</span>
          </Link>
        ) : (
          <span
            onClick={goToBottom}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                goToBottom();
              }
            }}
          >
            {link.title}
          </span>
        )}
      </div>
    ));

  return (
    <nav id="menu" ref={menuRef as RefObject<HTMLElement>} className={styles.menu}>
      <div className={clsx(styles.menuWrapper, 'layout-block-inner')}>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[0] = el;
          }}
          className={styles.menuList}
        >
          {renderMenuLinks(menuLinks as MenuLink[], menuLinksItemsRef, router.pathname)}
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + 2] = el;
          }}
          className={styles.menuList}
        >
          {(projectsLinks as MenuLink[]).map((link: MenuLink, index: number) => (
            <div
              ref={(el) => {
                menuLinksItemsRef.current[menuLinks.length + index + 2] = el;
              }}
              key={link.title}
              className={styles.menuListItem}
            >
              <Link aria-label={`Go ${link.title}`} scroll={false} href={link.href || '#'}>
                <span>{link.title}</span>
              </Link>
            </div>
          ))}
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + 3] = el;
          }}
          className={styles.menuList}
        >
          <div
            role="presentation"
            ref={(el) => {
              menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + 3] = el;
            }}
            className={styles.menuListItem}
          >
            <Link aria-label="Send email" scroll={false} href="mailto:vaggelisgiats@gmail.com">
              <span>GET IN TOUCH</span>
            </Link>
          </div>
        </div>
        <div
          ref={(el) => {
            menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + 4] = el;
          }}
          className={styles.menuList}
        >
          {(footerLinks as MenuLink[]).map((link: MenuLink, index: number) => (
            <div
              ref={(el) => {
                menuLinksItemsRef.current[menuLinks.length + projectsLinks.length + index + 4] = el;
              }}
              key={link.title}
              className={styles.menuListItem}
            >
              <Link aria-label={`Find me on ${link.title}`} target="_blank" rel="noopener noreferrer" scroll={false} href={link.href || '#'}>
                <span>{link.title}</span>
              </Link>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            (setIsMenuOpen as (v: boolean) => void)(false);
            (lenis as { start: () => void }).start();
          }}
          className={styles.menuClose}
        >
          <p>&#10005;</p>
        </button>
      </div>
    </nav>
  );
}

export default MenuLinks;
