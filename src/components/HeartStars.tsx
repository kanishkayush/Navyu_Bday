const POINTS = Array.from({ length: 28 }, (_, index) => {
  const t = (index / 28) * Math.PI * 2;
  return {
    x: 16 * Math.sin(t) ** 3,
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  };
});

export function HeartStars({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-22 -20 44 40" aria-hidden="true">
      {POINTS.map((point, index) => (
        <circle
          key={index}
          className="heart-star"
          cx={point.x}
          cy={point.y}
          r={index % 4 === 0 ? 0.85 : 0.45}
          fill={index % 3 === 0 ? "#e8c98a" : "#f7e9ff"}
          style={{ animationDelay: `${index * 0.12}s` }}
        />
      ))}
    </svg>
  );
}
