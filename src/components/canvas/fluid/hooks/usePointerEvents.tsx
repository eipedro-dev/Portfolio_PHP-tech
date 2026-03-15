"use client";

import { RefObject, useEffect, useRef } from "react";

import { Vector2 } from "three";

// Interface para os dados de cada splat
interface SplatData {
  mouseX: number;
  mouseY: number;
  velocityX: number;
  velocityY: number;
}

// Interface para o tamanho da tela
interface Size {
  width: number;
  height: number;
}

const usePointerEvents = (
  mainRef: RefObject<HTMLElement | null>,
  size: Size,
  force: number,
) => {
  const splatStack = useRef<SplatData[]>([]);
  const lastMouse = useRef(new Vector2());
  const hasMoved = useRef(false);

  useEffect(() => {
    if (!mainRef.current) {
      console.error("Main reference is not initialized");
      return undefined;
    }

    const element = mainRef.current;

    const handlePointerMove = (event: PointerEvent) => {
      const clientX = event.clientX;
      const clientY = event.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const deltaX = clientX - lastMouse.current.x;
      const deltaY = clientY - lastMouse.current.y;

      if (!hasMoved.current) {
        hasMoved.current = true;
        lastMouse.current.set(clientX, clientY);
        return;
      }

      lastMouse.current.set(clientX, clientY);

      splatStack.current.push({
        mouseX: clientX / size.width,
        mouseY: 1.0 - clientY / size.height,
        velocityX: deltaX * force,
        velocityY: -deltaY * force,
      });
    };

    element.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
    };
  }, [mainRef, size, force]);

  return splatStack;
};

export default usePointerEvents;
