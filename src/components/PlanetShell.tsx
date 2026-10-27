import { ArrowLeft } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

const FOCUSABLE = 'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])';

export function PlanetShell({
  title,
  kicker,
  wide,
  onClose,
  children,
}: {
  title: string;
  kicker: string;
  wide?: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => !el.hasAttribute("disabled"));

    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);

  return (
    <div ref={ref} className="shell" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={wide ? "shell-inner wide" : "shell-inner"}>
        <button type="button" className="back-btn" onClick={onClose}>
          <ArrowLeft size={18} />
          Back to the galaxy
        </button>
        <p className="kicker">{kicker}</p>
        <h2 id={titleId} className="shell-title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
