import { useEffect, useState } from 'react';

const name = 'TAYYABS DESIGNS';

export function TypingName() {
  const [length, setLength] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer: ReturnType<typeof setTimeout>;
    let position = 0;
    const type = () => {
      position += 1;
      setLength(position);
      if (position < name.length) timer = setTimeout(type, 110);
      else timer = setTimeout(start, 6000);
    };
    const start = () => {
      clearTimeout(timer);
      if (preference.matches) setLength(name.length);
      else {
        position = 0;
        setLength(0);
        timer = setTimeout(type, 450);
      }
    };
    start();
    preference.addEventListener('change', start);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener('change', start);
    };
  }, []);

  return <h1 id="designer-title" aria-label={name}>
    <span className="typing-name" aria-hidden="true">
      <span className="typing-name-space">{name}</span>
      <span className="typing-name-text"><span>{name.slice(0, length)}</span><span className="typing-name-cursor" /></span>
    </span>
  </h1>;
}
