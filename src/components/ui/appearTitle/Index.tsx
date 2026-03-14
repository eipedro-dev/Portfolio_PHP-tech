import { ReactNode, forwardRef, useRef } from 'react';

import clsx from 'clsx';
import styles from '@/components/ui/appearTitle/appearTitle.module.scss';
import useIntersected from '@/hooks/useIntersected';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

interface AppearTitleProps {
  children: ReactNode;
  index?: number;
  optionIndex?: number;
  isFooter?: boolean;
}

const AppearTitle = forwardRef<HTMLElement[][], AppearTitleProps>(
  ({ children, index = -1, optionIndex = -1, isFooter = false }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const intersected = useIntersected(containerRef);

    useIsomorphicLayoutEffect(() => {
      if (containerRef.current) {
        const childArray = Array.from(containerRef.current.children);

        childArray.forEach((child, i) => {
          if (child instanceof HTMLElement) {
            child.style.setProperty('--i', String(isFooter ? i : i + 1));

            if (!isFooter) {
              const wrapper = document.createElement('div');
              wrapper.appendChild(child.cloneNode(true));
              containerRef.current!.replaceChild(wrapper, child);
            }
          }
        });
      }
    }, [isFooter]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (ref && typeof ref !== 'function' && ref.current && index !== -1 && optionIndex !== -1) {
            if (!ref.current[index]) ref.current[index] = [];
            ref.current[index][optionIndex] = node as unknown as HTMLElement;
          }
        }}
        className={clsx(
          !isFooter && styles.title,
          isFooter && styles.titleFooter,
          intersected && !isFooter && styles.visible,
          !intersected && !isFooter && styles.notVisible,
          intersected && isFooter && styles.visibleFooter,
          !intersected && isFooter && styles.notVisibleFooter,
        )}
      >
        {children}
      </div>
    );
  },
);

AppearTitle.displayName = 'AppearTitle';

export default AppearTitle;
