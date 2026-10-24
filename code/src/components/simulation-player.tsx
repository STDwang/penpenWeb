"use client";

import { memo, useEffect, useRef, useState } from "react";

const routes = [
  {
    id: "014",
    color: "#71e2d4",
    label: "转向轨迹",
    points: [
      [-20, 198],
      [206, 198],
      [251, 190],
      [279, 174],
      [355, 109],
      [379, 80],
      [379, -10],
    ],
  },
  {
    id: "028",
    color: "#82bdff",
    label: "合流轨迹",
    points: [
      [401, 490],
      [401, 283],
      [409, 253],
      [430, 230],
      [465, 220],
      [700, 220],
    ],
  },
  {
    id: "037",
    color: "#8caab8",
    label: "支路轨迹",
    points: [
      [197, -10],
      [197, 311],
      [185, 349],
      [160, 370],
      [133, 375],
      [-10, 375],
    ],
  },
];

function position(points: number[][], fraction: number) {
  const lengths = points
    .slice(1)
    .map((p, i) => Math.hypot(p[0] - points[i][0], p[1] - points[i][1]));
  let distance = lengths.reduce((a, b) => a + b, 0) * fraction;
  for (let i = 0; i < lengths.length; i++) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const t = distance / lengths[i];
      return {
        x: points[i][0] + (points[i + 1][0] - points[i][0]) * t,
        y: points[i][1] + (points[i + 1][1] - points[i][1]) * t,
        angle:
          (Math.atan2(
            points[i + 1][1] - points[i][1],
            points[i + 1][0] - points[i][0],
          ) *
            180) /
          Math.PI,
      };
    }
    distance -= lengths[i];
  }
  return { x: 0, y: 0, angle: 0 };
}

// The road network never changes, so it must not be rebuilt on every playback
// frame while only the vehicle markers move.
const RoadMap = memo(function RoadMap() {
  const roads = [
    "M-40 208H208Q252 208 282 185L364 117Q390 94 390 60V-30",
    "M390 500V281Q390 208 465 208H720",
    "M-40 386H135Q208 386 208 317V-20",
    "M718 400H516Q455 400 455 338V-30",
  ];
  return (
    <svg className="road-map" viewBox="0 0 680 470" aria-hidden="true">
      <defs>
        <pattern
          id="road-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M28 0H0V28"
            fill="none"
            stroke="#22323c"
            strokeOpacity=".45"
            strokeWidth=".6"
          />
        </pattern>
      </defs>
      <rect width="680" height="470" fill="url(#road-grid)" />
      {[
        [75, 90, 108, 65],
        [235, 73, 72, 85],
        [462, 90, 135, 60],
        [65, 245, 107, 83],
        [247, 265, 76, 86],
        [477, 272, 122, 70],
        [354, 345, 60, 80],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={w}
          height={h}
          rx="8"
          fill="#131f27"
          stroke="#1b2c35"
        />
      ))}
      {roads.map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke="#344550" strokeWidth="42" />
          <path d={d} fill="none" stroke="#192730" strokeWidth="39" />
          <path d={d} fill="none" stroke="#61747e" strokeDasharray="7 10" />
        </g>
      ))}
      {routes.map((r, i) => (
        <polyline
          key={r.id}
          className={i === 2 ? "secondary-route" : ""}
          points={r.points.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke={r.color}
          strokeWidth="2"
          strokeLinejoin="round"
          opacity={i === 2 ? 0.6 : 0.9}
        />
      ))}
      <rect
        x="263"
        y="226"
        width="50"
        height="15"
        fill="#e7ba7715"
        stroke="#e7ba77"
        rx="2"
      />
      <text x="268" y="237" fill="#e7ba77" fontSize="8">
        检查点
      </text>
    </svg>
  );
});

export default function SimulationPlayer() {
  const [time, setTime] = useState(12);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState("014");
  const [reduced, setReduced] = useState(false);
  const timeRef = useRef(12);
  const active = routes.find((r) => r.id === selected)!;
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    update();
    media.addEventListener("change", update);
    const visibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      if (last) {
        timeRef.current =
          (timeRef.current + Math.min((now - last) / 1000, 0.1)) % 30;
        setTime(timeRef.current);
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);
  const scrub = (value: number) => {
    timeRef.current = value;
    setTime(value);
  };
  return (
    <div className="simulation" aria-label="道路轨迹交互示意">
      <div className="scene">
        <RoadMap />
        <div className="scene-top">
          <span>SCENE / ROAD NETWORK</span>
          <span className="scene-badge">交互示意</span>
        </div>
        <div className="vehicle-layer">
          {routes.map((route, i) => {
            const p = position(route.points, (time / 30 + i * 0.18) % 1);
            return (
              <button
                type="button"
                key={route.id}
                className={`vehicle ${selected === route.id ? "selected" : ""} ${i === 2 ? "secondary-route" : ""}`}
                style={{
                  left: `${(p.x / 680) * 100}%`,
                  top: `${(p.y / 470) * 100}%`,
                  color: route.color,
                }}
                aria-label={`选择车辆 ${route.id}，${route.label}`}
                aria-pressed={selected === route.id}
                onClick={() => setSelected(route.id)}
              >
                <span style={{ transform: `rotate(${p.angle}deg)` }} />
              </button>
            );
          })}
        </div>
        <div className="selection-readout">
          <span className="mono">VEHICLE / {selected}</span>
          <span>{active.label} · 状态可追溯</span>
        </div>
        <span className="scene-disclaimer">固定演示数据 · 非真实仿真输出</span>
      </div>
      <div className="timeline">
        <button
          className="play-button"
          type="button"
          aria-label={playing ? "暂停演示" : "播放演示"}
          onClick={() => setPlaying(!playing)}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="m5 2 9 6-9 6Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <label className="sr-only" htmlFor="scene-progress">
          演示进度（秒）
        </label>
        <input
          id="scene-progress"
          type="range"
          min="0"
          max="30"
          step="0.1"
          value={time}
          aria-valuetext={`${time.toFixed(1)} 秒，共 30 秒`}
          onChange={(e) => scrub(Number(e.target.value))}
        />
        <output htmlFor="scene-progress" className="mono">
          00:{Math.floor(time).toString().padStart(2, "0")} / 00:30
        </output>
      </div>
      <p className="scene-note">
        {reduced
          ? "已遵循减少动态效果设置；可手动播放或拖动进度。"
          : "把建模、运行与验证串成一个工程闭环。"}
      </p>
      <p className="sr-only" role="status">
        已选择车辆 {selected}，{active.label}
      </p>
    </div>
  );
}
