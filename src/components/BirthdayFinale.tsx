import { useEffect, useRef } from "react";
import { birthdayContent } from "../content/birthdayContent";
import { HeartStars } from "./HeartStars";

function ordinal(age: number) {
  const teen = age % 100;
  if (teen >= 11 && teen <= 13) return `${age}th`;
  return `${age}${["th", "st", "nd", "rd"][age % 10] || "th"}`;
}

export function BirthdayFinale({ onReturn, motionOff }: { onReturn: () => void; motionOff: boolean }) {
  const { nickname, age, birthdayLabel, finaleMessage } = birthdayContent;

  return (
    <section className="screen finale" aria-label="Birthday celebration">
      <Fireworks play={!motionOff} />
      <div className="finale-content">
        <HeartStars className="finale-heart" />
        <h1 className="finale-title">
          Happy {ordinal(age)} Birthday, {nickname}
        </h1>
        <p className="for-line">{birthdayLabel}</p>
        <Cake age={age} />
        {finaleMessage ? <p className="finale-note">{finaleMessage}</p> : null}
        <button type="button" className="revisit" onClick={onReturn}>
          Revisit the galaxy
        </button>
      </div>
    </section>
  );
}

function Cake({ age }: { age: number }) {
  const candles = Array.from({ length: age }, (_, index) => {
    const t = age === 1 ? 0.5 : index / (age - 1);
    const x = 36 + t * 208;
    const y = 84 - Math.sin(t * Math.PI) * 18;
    return { x, y, index };
  });

  return (
    <svg className="cake" viewBox="0 0 280 200" role="img" aria-label={`Birthday cake with ${age} candles`}>
      <ellipse cx="140" cy="178" rx="96" ry="12" fill="#241c44" />
      <rect x="62" y="118" width="156" height="54" rx="10" fill="#f3c1d3" />
      <rect x="82" y="90" width="116" height="40" rx="10" fill="#fbe7ef" />
      <ellipse cx="140" cy="90" rx="58" ry="12" fill="#fff7fb" />
      {candles.map((candle) => (
        <g key={candle.index}>
          <line x1={candle.x} y1={candle.y} x2={candle.x} y2={candle.y - 14} stroke="#f8e7c4" strokeWidth="1.25" />
          <circle className="flame" cx={candle.x} cy={candle.y - 16} r="2.2" style={{ animationDelay: `${(candle.index % 7) * 0.12}s` }} />
        </g>
      ))}
      <text x="140" y="154" textAnchor="middle" fill="#6d3148" fontSize="30" fontFamily="Cormorant Garamond, Palatino, serif">
        {age}
      </text>
    </svg>
  );
}

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string; box: boolean };

function Fireworks({ play }: { play: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!play) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const particles: Particle[] = [];
    const colors = ["#e8c98a", "#f3c1d3", "#c4b5fd", "#fff6ea"];

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const burst = (x: number, y: number) => {
      for (let i = 0; i < 24; i += 1) {
        const angle = (i / 24) * Math.PI * 2;
        const speed = 0.7 + Math.random() * 1.8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: colors[i % colors.length],
          box: i % 3 === 0,
        });
      }
    };

    const width = () => canvas.clientWidth;
    const height = () => canvas.clientHeight;
    burst(width() * 0.32, height() * 0.34);
    const timers = [650, 1300, 1950].map((delay, index) =>
      window.setTimeout(() => {
        if (!running) return;
        burst(width() * (0.42 + index * 0.16), height() * (0.28 + (index % 2) * 0.1));
      }, delay),
    );

    const started = performance.now();
    const draw = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, width(), height());
      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.012;
        particle.life -= 0.008;
        if (particle.life <= 0) continue;
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        if (particle.box) ctx.fillRect(particle.x, particle.y, 4, 7);
        else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (now - started < 4300) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [play]);

  if (!play) return null;
  return <canvas ref={ref} className="fx" aria-hidden="true" />;
}
