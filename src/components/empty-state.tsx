import type { ReactNode } from "react";

export function EmptyState({title, body, cta}:{title:string; body?:string; cta?:ReactNode}){
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-20 h-20 rounded-lg bg-card flex items-center justify-center text-foreground">
        {/* simple icon placeholder */}
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {body ? <p className="text-subtle max-w-md">{body}</p> : null}
      {cta ? <div className="mt-2">{cta}</div> : null}
    </div>
  );
}
