declare module "react-transition-group" {
  import { ComponentType, ReactNode } from "react";

  export interface TransitionProps {
    in?: boolean;
    mountOnEnter?: boolean;
    unmountOnExit?: boolean;
    appear?: boolean;
    enter?: boolean;
    exit?: boolean;
    timeout: number | { enter?: number; exit?: number; appear?: number };
    addEndListener?: (node: HTMLElement, done: () => void) => void;
    onEnter?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntering?: (node: HTMLElement, isAppearing: boolean) => void;
    onEntered?: (node: HTMLElement, isAppearing: boolean) => void;
    onExit?: (node: HTMLElement) => void;
    onExiting?: (node: HTMLElement) => void;
    onExited?: (node: HTMLElement) => void;
    children?: ReactNode;
    [key: string]: any;
  }

  export const Transition: ComponentType<TransitionProps>;

  export interface SwitchTransitionProps {
    mode?: "out-in" | "in-out";
    children: ReactNode;
  }

  export const SwitchTransition: ComponentType<SwitchTransitionProps>;
}
