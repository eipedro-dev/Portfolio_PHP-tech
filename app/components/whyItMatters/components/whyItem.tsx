import styles from "../styles/wyItMatters.module.scss";

import clsx from "clsx";
import { use, useRef } from "react";
import useIntersected from "@/hooks/useIntersected";

interface Item {
  number: string;
  title: string;
  desc: string;
}

interface WhyItemProps {
  item: Item;
  index: number;
}

type CSSPropertiesWithVars = React.CSSProperties & {
  [key: `--${string}`]: string | number;
};

export function WhyItem({ item, index }: WhyItemProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const intersected = useIntersected(rowRef, 0.1);

  const itemStyle: CSSPropertiesWithVars = { "--item-index": index };

  return (
    <div
      ref={rowRef}
      className={clsx(styles.item, intersected && styles.itemVisible)}
      style={itemStyle}
    >
      <div className={styles.itemDivider} />
      <div className={styles.itemInner}>
        <span className={clsx(styles.itemNumber, "p-xs")}>{item.number}</span>
        <div className={styles.itemContent}>
          <h3 className={clsx(styles.itemTitle, "h6", "medium")}>
            {item.title}
          </h3>
          <p className={clsx(styles.itemDesc, "p-x")}>{item.desc}</p>
        </div>
      </div>
    </div>
  );
}
