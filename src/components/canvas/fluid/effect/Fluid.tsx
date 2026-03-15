"use client";

import { forwardRef, useMemo } from "react";
import { Texture } from "three";

import FluidEffect from "@/components/canvas/fluid/effect/FluidEffect";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

// Interface para as props do wrapper
interface FluidEffectWrapperProps {
  intensity?: number;
  fluidColor?: string;
  backgroundColor?: string;
  showBackground?: boolean;
  tFluid?: Texture;
}

const FluidEffectWrapper = forwardRef<unknown, FluidEffectWrapperProps>(
  (props, ref) => {
    const effect = useMemo(
      () => new FluidEffect(props),
      [JSON.stringify(props)],
    );

    useIsomorphicLayoutEffect(
      () => () => {
        if (effect) effect.dispose();
      },
      [effect],
    );

    return <primitive ref={ref} object={effect} />;
  },
);

FluidEffectWrapper.displayName = "FluidEffectWrapper";

export default FluidEffectWrapper;
