import type { ReactNode } from "react";
import type { DiagramSpec } from "@/lib/calc";

export function CalcDiagram({ spec }: { spec: DiagramSpec }) {
  if (spec.type === "stairs") return <StairsDiagram spec={spec} />;
  if (spec.type === "pitch") return <PitchDiagram spec={spec} />;
  if (spec.type === "deck") return <DeckDiagram spec={spec} />;
  if (spec.type === "balustrade") return <BalustradeDiagram spec={spec} />;
  if (spec.type === "roof") return <RoofDiagram spec={spec} />;
  return null;
}

function Frame({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-foreground/[0.03] p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <svg viewBox="0 0 320 160" className="h-auto w-full text-foreground" role="img">
        {children}
      </svg>
    </div>
  );
}

function StairsDiagram({ spec }: { spec: Extract<DiagramSpec, { type: "stairs" }> }) {
  const n = Math.min(Math.max(spec.nRisers, 2), 12);
  const g = 220 / (n - 1);
  const r = 110 / n;
  let d = `M 40 140`;
  let x = 40;
  let y = 140;
  for (let i = 0; i < n; i++) {
    y -= r;
    d += ` L ${x} ${y}`;
    x += g;
    d += ` L ${x} ${y}`;
  }
  return (
    <Frame label="Elevation">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M 40 140 H 280" stroke="currentColor" strokeOpacity="0.25" />
      <text x="44" y="154" fontSize="10" fill="currentColor" opacity="0.55" fontFamily="IBM Plex Mono, monospace">
        going
      </text>
      <text
        x="16"
        y="90"
        fontSize="10"
        fill="currentColor"
        opacity="0.55"
        fontFamily="IBM Plex Mono, monospace"
        transform="rotate(-90 16 90)"
      >
        rise
      </text>
    </Frame>
  );
}

function PitchDiagram({ spec }: { spec: Extract<DiagramSpec, { type: "pitch" }> }) {
  const run = Math.max(spec.run, 0.01);
  const rise = Math.max(spec.rise, 0.01);
  const scale = Math.min(220 / run, 110 / rise);
  const w = run * scale;
  const h = rise * scale;
  const x0 = 50;
  const y0 = 140;
  return (
    <Frame label="Pitch triangle">
      <polygon
        points={`${x0},${y0} ${x0 + w},${y0} ${x0 + w},${y0 - h}`}
        fill="currentColor"
        fillOpacity="0.06"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text x={x0 + w / 2 - 10} y={y0 + 14} fontSize="10" fill="currentColor" opacity="0.55" fontFamily="IBM Plex Mono, monospace">
        run
      </text>
      <text x={x0 + w + 8} y={y0 - h / 2} fontSize="10" fill="currentColor" opacity="0.55" fontFamily="IBM Plex Mono, monospace">
        rise
      </text>
      <text x={x0 + w / 2 - 16} y={y0 - h / 2 - 6} fontSize="10" fill="currentColor" opacity="0.7" fontFamily="IBM Plex Mono, monospace">
        rafter
      </text>
    </Frame>
  );
}

function DeckDiagram({ spec }: { spec: Extract<DiagramSpec, { type: "deck" }> }) {
  const boards = Math.min(spec.nBoards, 18);
  const joists = Math.min(spec.nJoists, 14);
  const x = 40;
  const y = 24;
  const w = 240;
  const h = 112;
  const lines = [];
  for (let i = 1; i < boards; i++) {
    const yy = y + (h * i) / boards;
    lines.push(
      <line
        key={`b${i}`}
        x1={x}
        y1={yy}
        x2={x + w}
        y2={yy}
        stroke="currentColor"
        strokeOpacity="0.28"
      />,
    );
  }
  for (let i = 1; i < joists; i++) {
    const xx = x + (w * i) / joists;
    lines.push(
      <line
        key={`j${i}`}
        x1={xx}
        y1={y}
        x2={xx}
        y2={y + h}
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeDasharray="3 3"
      />,
    );
  }
  return (
    <Frame label="Plan">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeWidth="2"
      />
      {lines}
      <text x={x} y={y + h + 16} fontSize="10" fill="currentColor" opacity="0.55" fontFamily="IBM Plex Mono, monospace">
        length
      </text>
      <text
        x={x - 16}
        y={y + h / 2}
        fontSize="10"
        fill="currentColor"
        opacity="0.55"
        fontFamily="IBM Plex Mono, monospace"
        transform={`rotate(-90 ${x - 16} ${y + h / 2})`}
      >
        width
      </text>
    </Frame>
  );
}

function BalustradeDiagram({
  spec,
}: {
  spec: Extract<DiagramSpec, { type: "balustrade" }>;
}) {
  const posts = Math.min(Math.max(spec.nPosts, 2), 10);
  const x0 = 30;
  const w = 260;
  const yTop = 36;
  const yBot = 130;
  const nodes = [];
  for (let i = 0; i < posts; i++) {
    const x = x0 + (w * i) / (posts - 1);
    nodes.push(
      <rect
        key={i}
        x={x - 3}
        y={yTop}
        width="6"
        height={yBot - yTop}
        fill="currentColor"
      />,
    );
  }
  return (
    <Frame label="Elevation">
      <line x1={x0} y1={yTop} x2={x0 + w} y2={yTop} stroke="currentColor" strokeWidth="3" />
      {nodes}
      <line x1={x0} y1={yBot} x2={x0 + w} y2={yBot} stroke="currentColor" strokeOpacity="0.25" />
    </Frame>
  );
}

function RoofDiagram({ spec }: { spec: Extract<DiagramSpec, { type: "roof" }> }) {
  const isGable = spec.roofType !== "skillion";
  return (
    <Frame label={isGable ? "Gable" : "Skillion"}>
      {isGable ? (
        <polygon
          points="40,130 160,36 280,130"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="2"
        />
      ) : (
        <polygon
          points="40,70 280,36 280,130 40,130"
          fill="currentColor"
          fillOpacity="0.06"
          stroke="currentColor"
          strokeWidth="2"
        />
      )}
      <line x1="40" y1="130" x2="280" y2="130" stroke="currentColor" strokeOpacity="0.25" />
    </Frame>
  );
}
