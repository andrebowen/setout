export function Logo({ className }: { className?: string }) {
  // "S" mark — shared with SlabSet (three offset slab-course bars), redrawn in
  // Setout's own dark-badge / cream-cutout construction (no SlabSet yellow).
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect width="32" height="32" rx="6" fill="currentColor" />
      <g fill="#EFECE3">
        <polygon points="6.67,10.11 21.40,10.11 25.33,6.18 10.60,6.18" />
        <polygon points="6.67,17.96 21.40,17.96 25.33,14.04 10.60,14.04" />
        <polygon points="6.67,25.82 21.40,25.82 25.33,21.89 10.60,21.89" />
        <polygon points="6.67,10.11 10.60,10.11 10.60,14.04 6.67,17.96" />
        <polygon points="21.40,17.96 25.33,14.04 25.33,21.89 21.40,25.82" />
      </g>
    </svg>
  );
}
