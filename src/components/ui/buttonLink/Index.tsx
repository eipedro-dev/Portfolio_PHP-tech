import React, { useCallback, useRef } from 'react';

import Arrow from '@/components/common/Arrow';
import Link from 'next/link';
import clsx from 'clsx';
import gsap from 'gsap';
import styles from '@/components/ui/buttonLink/buttonLink.module.scss';

interface ButtonLinkProps {
  href: string;
  label: string;
  target?: boolean;
}

function ButtonLink({ href, label, target = false }: ButtonLinkProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const relsRef = useRef({ relX: 0, relY: 0 });

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    const span = spanRef.current;
    if (!button || !span) return;

    const { clientY } = e;
    const parentOffset = button.getBoundingClientRect();
    const isTop = clientY < parentOffset.top + parentOffset.height / 2;
    const relX = ((e.pageX - parentOffset.left) / parentOffset.width) * 100;
    const relY = isTop ? 0 : 100;

    relsRef.current = { relX, relY };

    gsap.set(span, { top: `${relY}%`, left: `${relX}%` });
    gsap.to(span, {
      duration: 0.6,
      ease: 'cubic-bezier(.4,0,.1,1)',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const span = spanRef.current;
    if (!span) return;

    const { relX, relY } = relsRef.current;
    gsap.to(span, {
      duration: 0.6,
      top: `${relY}%`,
      left: `${relX}%`,
      ease: 'cubic-bezier(.4,0,.1,1)',
    });
  }, []);

  return (
    <Link
      target={target ? '_blank' : undefined}
      rel={target ? 'noopener noreferrer' : undefined}
      aria-label={label}
      scroll={false}
      href={href}
    >
      <button
        type="button"
        aria-label={label}
        ref={buttonRef}
        className={clsx('p-xs', styles.btnPosnawr)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={clsx('p-x', styles.labelClassic)}>{label}</span>
        <Arrow className={styles.arrowClassic} />
        <span className={styles.ball} ref={spanRef} />
      </button>
    </Link>
  );
}

export default ButtonLink;
