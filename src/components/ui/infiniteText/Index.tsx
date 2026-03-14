import clsx from 'clsx';
import { gsap } from 'gsap';
import styles from '@/components/ui/infiniteText/infiniteText.module.scss';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useRef } from 'react';

interface InfiniteTextProps {
  text: string;
  length: number;
  className?: string;
  hasStroke?: boolean;
}

function InfiniteText({ text, length, className, hasStroke = true }: InfiniteTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !container.children[0]) return;

    const containerWidth = container.getBoundingClientRect().width;
    const itemWidth = container.children[0].getBoundingClientRect().width;
    const initialOffset = ((2 * itemWidth) / containerWidth) * 100 * -1;

    gsap.set(container, {
      xPercent: `${initialOffset}`,
    });

    const duration = 5;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.to(container, {
        ease: 'none',
        duration,
        xPercent: 0,
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.kill();
  }, []);

  return (
    <div ref={containerRef} className={styles.root}>
      {Array.from({ length }, (_, index) => (
        <div key={`${index}-${text}`} className={clsx(styles.infiniteItem, index % 2 === 0 && hasStroke && styles.stroke, className)}>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}

export default InfiniteText;
