"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import AppearByWords from "@/components/ui/appearByWords/Index";
import AppearTitle from "@/components/ui/appearTitle/Index";
import FloatingMeshes from "./floatingMeshes/Index";
import clsx from "clsx";
import { gsap } from "gsap";
import styles from "./styles/statement.module.scss";
import useIsMobile from "@/hooks/useIsMobile";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RectPosition {
  index: number;
  x: string;
  y: string;
}
interface Movement {
  index: number;
  x: string;
  y: string;
}

// ─── Helpers de movimento — idênticos ao Hero ─────────────────────────────────
const moveRect = (
  rect: RectPosition,
  direction: string,
  gridWidth: number,
  gridHeight: number,
) => {
  const moveMap: Record<string, () => void> = {
    left: () => {
      rect.x = `${(parseFloat(rect.x) - gridWidth).toFixed(2)}%`;
    },
    right: () => {
      rect.x = `${(parseFloat(rect.x) + gridWidth).toFixed(2)}%`;
    },
    up: () => {
      rect.y = `${(parseFloat(rect.y) - gridHeight).toFixed(2)}%`;
    },
    down: () => {
      rect.y = `${(parseFloat(rect.y) + gridHeight).toFixed(2)}%`;
    },
  };
  moveMap[direction]?.();
};

const arePositionsEqual = (
  pos1: { x: string; y: string },
  pos2: { x: string; y: string },
) => pos1.x === pos2.x && pos1.y === pos2.y;

const isPositionOccupied = (
  rects: RectPosition[],
  pos: { x: string; y: string },
) => rects.some((rect) => arePositionsEqual(rect, pos));

const performMoves = (
  rectangles: RectPosition[],
  gridWidth: number,
  gridHeight: number,
): Movement[][] => {
  const totalGroups = Math.floor(Math.random() * 8) + 1;
  const allMovements: Movement[][] = [];

  for (let i = 0; i < totalGroups; i += 1) {
    const validMoves: Movement[] = [];
    const togetherMoves = Math.floor(Math.random() * 3) + 1;

    for (let k = 0; k < togetherMoves; k += 1) {
      const randomRectIndex =
        k === 0 || validMoves.length === 0
          ? Math.floor(Math.random() * rectangles.length)
          : rectangles.findIndex(
              (_, idx) => !validMoves.some((move) => move.index === idx),
            );

      if (randomRectIndex === -1) break;

      const rect: RectPosition = { ...rectangles[randomRectIndex]! };
      const originalPosition: RectPosition = {
        ...rectangles[randomRectIndex]!,
      };
      let validMove = false;

      ["left", "right", "up", "down"].forEach((direction) => {
        if (validMove) return;

        moveRect(rect, direction, gridWidth, gridHeight);
        const newPosition = { ...rect };

        const { x, y } = {
          x: parseFloat(newPosition.x),
          y: parseFloat(newPosition.y),
        };
        if (
          x > -0.5 &&
          x < 90 &&
          y > -0.5 &&
          y < 90 &&
          !isPositionOccupied(rectangles, newPosition)
        ) {
          validMove = true;
          validMoves.push({
            index: newPosition.index,
            x: newPosition.x,
            y: newPosition.y,
          });
          Object.assign(rectangles[newPosition.index]!, newPosition);
        } else {
          Object.assign(rect, originalPosition);
        }
      });
    }

    if (validMoves.length > 0) {
      allMovements.push(validMoves);
    }
  }

  return allMovements;
};

// ─── Component ───────────────────────────────────────────────────────────────
export const Statement = () => {
  const isMobile = useIsMobile();
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  const rectRefs = useRef<(SVGRectElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const divWrapper = useRef<HTMLDivElement>(null);

  // Grid 2×3 = 6 slots. Apenas 4 tiles preenchidos → 2 slots vazios para animação.
  // gridWidth = 50% (2 colunas), gridHeight = 33.33% (3 linhas)
  const initialPositions: RectPosition[] = useMemo(
    () =>
      !isMobile
        ? [
            // 4 tiles em grid 2×3 — 2 slots livres para movimento
            { index: 0, x: "0.00%", y: "0.00%" },
            { index: 1, x: "50.00%", y: "33.33%" },
            { index: 2, x: "0.00%", y: "66.66%" },
            { index: 3, x: "50.00%", y: "66.66%" },
          ]
        : [
            // Mobile: 4 tiles em grid 2×3
            { index: 0, x: "0.00%", y: "0.00%" },
            { index: 1, x: "50.00%", y: "33.33%" },
            { index: 2, x: "0.00%", y: "66.66%" },
            { index: 3, x: "50.00%", y: "66.66%" },
          ],
    [isMobile],
  );

  const gridWidth = useMemo(() => 50.0, []);
  const gridHeight = useMemo(() => 33.33, []);

  const animateRectangles = useCallback(
    (movements: Movement[][]) => {
      const tl = gsap.timeline({
        onComplete: () => {
          const newMovements = performMoves(
            initialPositions,
            gridWidth,
            gridHeight,
          );
          setTimeline(animateRectangles(newMovements));
        },
      });

      movements.forEach((movementGroup, groupIndex) => {
        movementGroup.forEach(({ index, x, y }, rectIndex) => {
          if (groupIndex === 0 && rectIndex === 0) {
            tl.to(
              rectRefs.current[index]!,
              {
                ease: "power2.inOut",
                duration: 1,
                attr: { x, y },
                delay: 0.8,
              },
              0,
            );
          } else if (rectIndex === 0) {
            tl.to(
              rectRefs.current[index]!,
              {
                ease: "power2.inOut",
                duration: 1,
                attr: { x, y },
                delay: 0,
              },
              ">",
            );
          } else {
            tl.to(
              rectRefs.current[index]!,
              {
                ease: "power2.inOut",
                duration: 1,
                attr: { x, y },
                delay: 0,
              },
              "<",
            );
          }
        });
      });

      return tl;
    },
    [gridWidth, gridHeight, initialPositions],
  );

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (timeline) {
        timeline.kill();
      }

      const newTimeline = animateRectangles(
        performMoves(initialPositions, gridWidth, gridHeight),
      );
      setTimeline(newTimeline);
    });

    return () => {
      ctx.kill();
      if (timeline) {
        timeline.kill();
      }
    };
  }, [animateRectangles]);

  // Renderiza os retângulos da máscara SVG
  const renderRects = useMemo(
    () =>
      initialPositions.map(({ index, x, y }) => (
        <rect
          key={index}
          ref={(ref) => {
            rectRefs.current[index] = ref;
          }}
          x={x}
          y={y}
          width={`${gridWidth}%`}
          height={`${gridHeight}%`}
        />
      )),
    [initialPositions, gridWidth, gridHeight],
  );

  return (
    <section className={clsx(styles.root, "layout-grid-inner")}>
      {/* ── Coluna esquerda ─────────────────────────────────────────────── */}
      <div className={styles.leftCol}>
        {/* Statement — título grande */}
        <div className={styles.statementBlock}>
          <AppearByWords>
            <h2 className={clsx("h4", styles.statement)}>
              Muitos negócios investem em tráfego antes de ter uma página que
              converte. Investem em conteúdo antes de ter uma marca que impõe.
              <br />
              Resolvo isso — com design e estratégia que andam juntos desde o
              primeiro dia.
            </h2>
          </AppearByWords>
        </div>

        {/* Divisor */}
        <div className={styles.divider} />

        {/* Bottom row: label+corpo à esquerda | CTA à direita */}
        <div className={styles.bottomRow}>
          <div className={styles.textGroup}>
            <AppearTitle>
              <p className={clsx("p-xs", styles.label)}>
                (Projeto com resultado)
              </p>
            </AppearTitle>
            <AppearTitle>
              <p className={clsx("p-l", styles.body)}>
                Não entrego página. Entrego estrutura pensada para converter,
                posicionar e crescer com o negócio.
              </p>
            </AppearTitle>
          </div>

          <div className={styles.ctaGroup}>
            <AppearTitle>
              <a href="#contact" className={clsx("p-l", styles.ctaLink)}>
                Solicitar orçamento
                <span className={styles.ctaArrow} aria-hidden="true">
                  →
                </span>
              </a>
            </AppearTitle>
          </div>
        </div>
      </div>

      {/* ── Coluna direita — grid animado estilo Hero ──────────────────── */}
      <div className={styles.rightCol}>
        <div className={styles.bottomContainer}>
          {/* Fundo 3D com esferas — renderiza atrás do SVG mask */}
          <FloatingMeshes />
          {/* SVG mask — recorta buracos para mostrar fundo branco da página */}
          <div className={styles.svgWrapper}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <rect
                x="0"
                y="0"
                className={styles.maskFill}
                width="100%"
                height="100.3%"
              />
              <mask id="statement-grid-mask" x="0" y="0">
                <rect
                  className={styles.maskWhite}
                  x="0"
                  y="0"
                  width="100%"
                  height="100.3%"
                />
                {renderRects}
              </mask>
            </svg>
            <div ref={divWrapper} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statement;
