import { birthdayContent } from "../content/birthdayContent";
import { HeartStars } from "./HeartStars";

export function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const { nickname, age, birthdayLabel, welcomeGeneric, welcomePersonal } = birthdayContent;

  return (
    <section className="screen intro" aria-label="Welcome">
      <HeartStars className="intro-heart" />
      <h1 className="title">A Universe Called {nickname}</h1>
      <p className="chapter">Chapter {age}</p>
      <p className="for-line">
        For {nickname} — {birthdayLabel}
      </p>
      <p className="quote">{welcomeGeneric}</p>
      {welcomePersonal ? <p className="personal">{welcomePersonal}</p> : null}
      <button type="button" className="enter" onClick={onEnter}>
        Enter My Universe ✨
      </button>
    </section>
  );
}
