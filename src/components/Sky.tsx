import { useEffect, useRef } from "react";

type Star = { x: number; y: number; r: number; a: number; s: number; p: number };

export function Sky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 800px)").matches;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;
    let visible = !document.hidden;
    let width = 0;
    let height = 0;
    const pointer = { x: 0, y: 0 };

    const resize = () => {
      const nextW = canvas.clientWidth;
      const nextH = canvas.clientHeight;
      if (nextW === 0 || nextH === 0 || (nextW === width && nextH === height)) return;
      width = nextW;
      height = nextH;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = small ? 80 : 200;
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.25 + 0.35,
        a: Math.random() * 0.55 + 0.25,
        s: Math.random() * 0.0016 + 0.0006,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      const drift = reduce || small ? 0 : 1;
      for (const star of stars) {
        const alpha = reduce ? star.a : star.a * (0.55 + 0.45 * Math.sin(time * star.s + star.p));
        ctx.fillStyle = `rgba(246, 240, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x + pointer.x * star.r * drift, star.y + pointer.y * star.r * drift, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth - 0.5;
      pointer.y = event.clientY / window.innerHeight - 0.5;
      pointer.x *= 14;
      pointer.y *= 10;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };

    resize();
    if (reduce) draw(0);
    else raf = requestAnimationFrame(draw);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (!reduce && !small) window.addEventListener("pointermove", onMove);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      <div className="nebula n1" />
      <div className="nebula n2" />
      <div className="nebula n3" />
      <canvas ref={ref} className="star-canvas" />
    </div>
  );
}
