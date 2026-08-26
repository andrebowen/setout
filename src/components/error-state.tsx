import type { ReactNode } from "react";

export function ErrorState({title, body, action}:{title:string; body?:string; action?:ReactNode}){
  return (
    <div role="alert" className="p-6 bg-card border rounded-md">
      <h3 className="text-lg font-semibold">{title}</h3>
      {body ? <p className="text-subtle mt-2">{body}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
