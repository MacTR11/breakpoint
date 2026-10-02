import { ViewTransition } from "react";

// A template is re-created on every navigation (a layout is not), which is what
// lets the outgoing page fade and the incoming one rise.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
