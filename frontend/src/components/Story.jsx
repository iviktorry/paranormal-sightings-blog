import { useState } from "react";

export default function Story({ location, timeStamp, title, text }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <article className="w-75 justify-self-center rounded-md bg-white p-4 text-black lg:w-md">
      <p className="text-xs text-neutral-800">
        {timeStamp}, {location}
      </p>
      <h2 className="my-1 text-lg font-bold">{title}</h2>
      <div className="relative">
        <p className={`${isOpen ? "h-full" : "h-40 lg:h-30"} overflow-hidden`}>
          {text}
        </p>
        <div
          className={`${isOpen ? "" : "pointer-events-none absolute bottom-0 left-0 h-12 w-full bg-linear-to-t from-white via-white/80 to-transparent"}`}
        ></div>
      </div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="mt-4 w-full text-right"
      >
        {isOpen ? "Close" : "Read in full"}
      </button>
    </article>
  );
}
