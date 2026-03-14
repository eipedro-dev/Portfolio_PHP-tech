import { ReactNode, useRef } from 'react';

import clsx from 'clsx';
import styles from '@/components/ui/appearByWords/appearByWords.module.scss';
import useIntersected from '@/hooks/useIntersected';
import useSplitAnimation from '@/hooks/useSplitAnimation';

interface AppearByWordsProps {
  children: ReactNode;
}

function AppearByWords({ children }: AppearByWordsProps) {
  const animationContainerRef = useRef<HTMLSpanElement>(null);
  const intersected = useIntersected(animationContainerRef);
  useSplitAnimation(animationContainerRef, styles);

  return (
    <span
      ref={animationContainerRef}
      className={clsx(styles.title, intersected && styles.visible)}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export default AppearByWords;
