/** Lightweight CSS/SVG hero visual — no Framer loops. */
export function HeroFallback() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgb(30_90_255_/_0.35),transparent_65%)] blur-2xl" />
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgb(34_211_238_/_0.25),transparent_55%)]" />

      <div className="relative flex h-full items-center justify-center">
        <div className="hero-float relative h-[78%] w-[78%]">
          <svg
            viewBox="0 0 200 200"
            className="h-full w-full drop-shadow-[0_0_40px_rgb(56_189_248_/_0.35)]"
          >
            <defs>
              <linearGradient
                id="hero-ring-fallback"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="50%" stopColor="#1E5AFF" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <circle
              className="hero-spin-slow origin-center"
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="url(#hero-ring-fallback)"
              strokeWidth="1.5"
              opacity="0.55"
              style={{ transformOrigin: "100px 100px" }}
            />
            <circle
              cx="100"
              cy="100"
              r="68"
              fill="none"
              stroke="url(#hero-ring-fallback)"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.4"
            />
            {[0, 45, 90, 135].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 100 100)`}>
                <path
                  d="M100 28 L112 52 L100 46 L88 52 Z"
                  fill="url(#hero-ring-fallback)"
                  opacity="0.85"
                />
                <path
                  d="M100 148 L108 168 L100 162 L92 168 Z"
                  fill="#E8B923"
                  opacity="0.55"
                />
              </g>
            ))}
            <rect
              x="62"
              y="72"
              width="76"
              height="56"
              rx="6"
              fill="rgb(13 27 62 / 0.85)"
              stroke="url(#hero-ring-fallback)"
              strokeWidth="1.5"
            />
            <path
              d="M70 88 H130 M70 100 H120 M70 112 H110"
              stroke="#93A4C7"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.7"
            />
            <text
              x="100"
              y="108"
              textAnchor="middle"
              fill="#E8EEFF"
              fontSize="10"
              fontFamily="var(--font-amiri), serif"
              opacity="0.9"
            >
              قرآن
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
