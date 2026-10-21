import { useId } from "react";

export function CaseDiagram({ kind }: { kind: "rail" | "layers" | "meso" }) {
  const id = useId();
  const label =
    kind === "rail"
      ? "轨道交通模块：建模、持久化、运行与结果链路架构示意"
      : kind === "layers"
        ? "图层系统：业务、映射、拾取与数据库四层结构示意"
        : "微中观协同与数据聚合示意，非实测数据";
  return (
    <div className={`case-diagram diagram-${kind}`}>
      <svg
        viewBox={kind === "rail" ? "0 0 744 369" : "0 0 612 161"}
        role="img"
        aria-label={label}
      >
        <defs>
          <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
            <path
              d="M28 0H0V28"
              fill="none"
              stroke="#22323c"
              strokeOpacity=".45"
            />
            <circle r="1" fill="#39515b" />
          </pattern>
        </defs>
        {kind === "rail" ? (
          <>
            <text x="25" y="31" className="svg-mono">
              TESSNG / RAIL TRANSIT
            </text>
            <text x="642" y="31" className="svg-caption">
              架构示意
            </text>
            <rect x="1" y="51" width="742" height="317" fill={`url(#${id})`} />
            <path
              d="M30 226H238Q298 226 350 176T469 128H719"
              stroke="#3c555f"
              strokeWidth="16"
              fill="none"
            />
            <path
              d="M30 226H238Q298 226 350 176T469 128H719"
              stroke="#71e2d4"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M350 176Q424 246 513 246H719"
              fill="none"
              stroke="#4a6673"
              strokeWidth="9"
            />
            {[
              { x: 119, y: 226, n: "起点站" },
              { x: 357, y: 171, n: "换乘站" },
              { x: 588, y: 128, n: "终点站" },
            ].map((p) => (
              <g key={p.n}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="8"
                  fill="#11191f"
                  stroke="#71e2d4"
                />
                <circle cx={p.x} cy={p.y} r="3" fill="#71e2d4" />
                <text x={p.x - 18} y={p.y + 35} className="svg-label">
                  {p.n}
                </text>
              </g>
            ))}
            <rect
              x="261"
              y="213"
              width="46"
              height="13"
              fill="#71e2d4"
              rx="3"
            />
            <rect
              x="25"
              y="293"
              width="694"
              height="49"
              fill="#101a20"
              stroke="#283740"
              rx="4"
            />
            {["建模", "持久化", "运行", "结果"].map((l, i) => (
              <g key={l}>
                <text x={40 + i * 181} y="314" className="svg-label">
                  {l}
                </text>
                {i < 3 ? (
                  <path d={`M${80 + i * 181} 309h100`} stroke="#718690" />
                ) : null}
              </g>
            ))}
            <text x="40" y="333" className="svg-mono">
              DATA → MODEL → SIMULATION
            </text>
          </>
        ) : kind === "layers" ? (
          <>
            {[2, 1, 0].map((i) => (
              <path
                key={i}
                d={`M306 ${24 + i * 21}l190 45-190 45-190-45Z`}
                fill={i === 0 ? "#183a3b" : "#17242c"}
                stroke={i === 0 ? "#71e2d4" : "#3c515f"}
              />
            ))}
            <text x="20" y="143" className="svg-mono">
              业务 → 映射 → 拾取 → 数据 / 架构示意
            </text>
          </>
        ) : (
          <>
            {Array.from({ length: 36 }, (_, i) => (
              <circle
                key={i}
                cx={27 + (i % 9) * 69}
                cy={31 + Math.floor(i / 9) * 22}
                r="2.5"
                fill={Math.floor(i / 9) === 1 ? "#71e2d4" : "#49616e"}
              />
            ))}
            <path
              d="M35 107C245 107 355 31 587 31"
              fill="none"
              stroke="#71e2d4"
              strokeWidth="2"
            />
            <text x="20" y="143" className="svg-mono">
              MICRO ↔ MESO / OD → METRICS · 示意
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export function ExperimentDiagram({ type }: { type: string }) {
  return (
    <div
      className="experiment-diagram"
      role="img"
      aria-label={
        type === "mistloop"
          ? "回环空间规则原创示意，非运行截图"
          : "多视图图像联动原创示意，非运行截图"
      }
    >
      <span className="eyebrow">
        {type === "mistloop"
          ? "LOOP / STATE / SOUND"
          : "MULTI-VIEW / SYNC / PIXEL"}
      </span>
      <svg viewBox="0 0 600 220" aria-hidden="true">
        {type === "mistloop" ? (
          <>
            <path
              d="M140 110C140 10 460 10 460 110S140 210 140 110"
              fill="none"
              stroke="#3c555f"
              strokeWidth="30"
            />
            <path
              d="M140 110C140 10 460 10 460 110S140 210 140 110"
              fill="none"
              stroke="#71e2d4"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <circle cx="140" cy="110" r="9" fill="#71e2d4" />
            <text x="248" y="117" fill="#9caeb8" fontSize="14">
              空间回环
            </text>
          </>
        ) : (
          <>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x={50 + i * 170}
                  y="38"
                  width="145"
                  height="145"
                  rx="4"
                  fill="#17242c"
                  stroke="#3c555f"
                />
                <path
                  d={`M${72 + i * 170} 143l30-46 25 19 26-48 20 75Z`}
                  fill="#71e2d4"
                  fillOpacity={0.15 + i * 0.15}
                />
                <path
                  d={`M${122 + i * 170} 70v80M${85 + i * 170} 110h75`}
                  stroke="#71e2d4"
                  strokeWidth="1"
                />
              </g>
            ))}
          </>
        )}
      </svg>
      <span className="caption">原创功能示意 · 非运行截图</span>
    </div>
  );
}
