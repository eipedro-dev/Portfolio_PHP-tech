---
trigger: always_on
---

---

name: spline-3d
description: >
Use this skill whenever the user wants to build, embed, animate, or interact with 3D content using Spline in React or web projects. Triggers include ANY mention of "Spline", "spline.design", "@splinetool", "3D scene", "3D animation", "3D interactive", "cena 3D", "objeto 3D", "fundo 3D animado", "hero 3D", or requests involving 3D hero sections, landing pages with 3D, animated 3D backgrounds, or 3D UI. Also trigger for: Next.js + Spline, Vite + Spline, React + Spline, TypeScript + Spline. Always use this skill before writing any Spline-related code.

---

# Spline 3D Skill

Spline's **Runtime** embeds interactive 3D scenes into any web project with full programmatic control.

**Primary focus:** External React/Next.js/Vite projects with TypeScript.

## Quick Reference

| Goal                | Solution                                                 |
| ------------------- | -------------------------------------------------------- |
| Embed a scene       | `<Spline scene="..." />`                                 |
| Run code after load | `onLoad={(spline) => ...}`                               |
| Trigger animation   | `spline.emitEvent('mouseDown', 'ObjectName')`            |
| Reverse animation   | `spline.emitEventReverse('mouseDown', 'ObjectName')`     |
| Move/scale/rotate   | `spline.findObjectByName('X').position.x = 100`          |
| React to 3D clicks  | `onMouseDown={(e) => e.target.name}`                     |
| Next.js (no SSR)    | `dynamic(() => import('./SplineScene'), { ssr: false })` |
| HTML / no npm       | Section 5 — `<spline-viewer>` web component              |

## Installation

```bash
npm install @splinetool/react-spline @splinetool/runtime
```

---

## 1. Basic Embed

```tsx
import Spline from "@splinetool/react-spline";

export default function SplineScene() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Spline scene="https://prod.spline.design/YOUR_SCENE_ID/scene.splinecode" />
    </div>
  );
}
```

> **Scene URL:** Spline app → Export → Public Link → copy `.splinecode` URL

---

## 2. Ref + Animations + Events

```tsx
import Spline from "@splinetool/react-spline";
import type { Application, SplineEvent } from "@splinetool/runtime";
import { useRef, useCallback } from "react";

export default function Scene() {
  const splineRef = useRef<Application | null>(null);

  const onLoad = useCallback((spline: Application) => {
    splineRef.current = spline;
  }, []);

  // Trigger / reverse animations
  const trigger = () => splineRef.current?.emitEvent("mouseDown", "Button");
  const reverse = () =>
    splineRef.current?.emitEventReverse("mouseDown", "Button");

  // Manipulate objects
  const moveObj = () => {
    const obj = splineRef.current?.findObjectByName("Cube");
    if (obj) {
      obj.position.x += 50;
      obj.scale.x = 1.5;
      obj.rotation.y += Math.PI / 4;
    }
  };

  // React to 3D events
  const onClick = (e: SplineEvent) => {
    if (e.target.name === "Card") console.log("Card clicked!");
  };

  return (
    <>
      <Spline
        scene="https://prod.spline.design/YOUR_ID/scene.splinecode"
        onLoad={onLoad}
        onMouseDown={onClick}
      />
      <button onMouseDown={trigger} onMouseUp={reverse}>
        Animate
      </button>
      <button onClick={moveObj}>Move</button>
    </>
  );
}
```

---

## 3. Custom Hook: `useSpline`

```tsx
// hooks/useSpline.ts
import { useRef, useCallback } from "react";
import type { Application } from "@splinetool/runtime";

export function useSpline() {
  const ref = useRef<Application | null>(null);
  const onLoad = useCallback((s: Application) => {
    ref.current = s;
  }, []);
  const emit = useCallback(
    (ev: string, name: string) => ref.current?.emitEvent(ev as any, name),
    [],
  );
  const emitReverse = useCallback(
    (ev: string, name: string) =>
      ref.current?.emitEventReverse(ev as any, name),
    [],
  );
  const setPosition = useCallback(
    (name: string, x: number, y: number, z = 0) => {
      const o = ref.current?.findObjectByName(name);
      if (o) {
        o.position.x = x;
        o.position.y = y;
        o.position.z = z;
      }
    },
    [],
  );
  return { onLoad, emit, emitReverse, setPosition };
}
// Usage: const { onLoad, emit } = useSpline();
// emit('mouseDown', 'Button')
```

---

## 4. Advanced Patterns

### Loading State + Hero Section

```tsx
import Spline from "@splinetool/react-spline";
import { useState } from "react";

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#000",
      }}
    >
      {/* 3D Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Spline
          scene="https://prod.spline.design/YOUR_ID/scene.splinecode"
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.6s",
          }}
        />
      </div>
      {/* HTML overlay — pointer-events:none passes clicks to Spline */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <h1 style={{ color: "#fff", fontSize: "4rem" }}>Your Headline</h1>
        <button
          style={{
            pointerEvents: "all",
            padding: "0.75rem 2rem",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
```

### Scroll-driven Animation

```tsx
useEffect(() => {
  const onScroll = () => {
    const obj = splineRef.current?.findObjectByName("FloatingObject");
    if (!obj) return;
    const p =
      window.scrollY / (document.body.scrollHeight - window.innerHeight);
    obj.position.y = -200 + p * 400;
    obj.rotation.y = p * Math.PI * 2;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);
// Wrap <Spline> in: <div style={{height:'300vh'}}><div style={{position:'sticky',top:0,height:'100vh'}}>
```

### Mouse Parallax (lerp)

```tsx
useEffect(() => {
  const onMove = (e: MouseEvent) => {
    const obj = splineRef.current?.findObjectByName("FloatObject");
    if (!obj) return;
    const tx = (e.clientX / window.innerWidth - 0.5) * 200;
    const ty = -(e.clientY / window.innerHeight - 0.5) * 200;
    obj.position.x += (tx - obj.position.x) * 0.05; // lerp
    obj.position.y += (ty - obj.position.y) * 0.05;
  };
  window.addEventListener("mousemove", onMove);
  return () => window.removeEventListener("mousemove", onMove);
}, []);
```

---

## 5. Next.js (SSR disabled) + HTML Fallback

### Next.js

```tsx
// components/SplineScene.tsx
"use client";
import Spline from "@splinetool/react-spline";
export default function SplineScene() {
  return <Spline scene="https://prod.spline.design/YOUR_ID/scene.splinecode" />;
}

// Pages Router alternative:
// const SplineScene = dynamic(() => import('@/components/SplineScene'), { ssr: false });
```

### HTML / Vanilla (no npm)

```html
<script
  type="module"
  src="https://unpkg.com/@splinetool/viewer@1.9.82/build/spline-viewer.js"
></script>
<spline-viewer
  url="https://prod.spline.design/YOUR_ID/scene.splinecode"
  events-target="global"
  loading-anim="true"
></spline-viewer>
```

---

## 6. Best Practices

- **Loading state:** Scenes are 5–30MB — always show a spinner/overlay.
- **Avoid SSR:** Use `'use client'` or `dynamic({ ssr: false })` in Next.js.
- **Prevent re-renders:** Wrap `<Spline>` in `React.memo`, keep outside state-heavy parents.
- **Responsive:** Container needs explicit px dimensions on mount.
- **Object names are case-sensitive** — must match Spline editor exactly.
- **TypeScript:** `import type { Application, SPEObject, SplineEvent } from '@splinetool/runtime'`

---
