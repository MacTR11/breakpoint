// Client-side: tells the breakpoint dot in the header that everything passed.
export const PASS_EVENT = "breakpoint:pass";

export const celebrate = () => window.dispatchEvent(new Event(PASS_EVENT));
