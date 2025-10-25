"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme!);
    document.body.style.backgroundColor = theme === "dark" ? "#0a0a0a" : "#f2f2f2";
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <main className="min-h-screen px-6 py-12 flex flex-col items-center justify-center">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "var(--grey-box)" }}
        aria-label="Toggle theme"
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-6xl font-bold" style={{ color: "var(--primary)" }}>
          Speaksers
        </h1>

        <p className="text-xl" style={{ color: "var(--paragraph)" }}>
          Master any language with confidence. Practice speaking, improve pronunciation, and connect with other
          speakers.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {["🗣️ Speak", "🎯 Practice", "🌍 Connect"].map((feature) => (
            <div key={feature} className="p-6 rounded-lg" style={{ backgroundColor: "var(--grey-box)" }}>
              <p className="text-2xl mb-2">{feature.split(" ")[0]}</p>
              <p style={{ color: "var(--paragraph)" }}>{feature.split(" ")[1]}</p>
            </div>
          ))}
        </div>

        <button
          className="mt-12 px-8 py-4 cursor-pointer rounded-full text-white font-semibold text-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Download Now
        </button>
      </div>
    </main>
  );
}
