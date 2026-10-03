"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readDraft, writeDraft } from "@/lib/drafts";

type Lesson = { id: string; slug: string; title: string };

const CHECK_SECONDS = 8;

/**
 * For students: asks every few seconds whether the teacher is running a live
 * lesson. A new one opens its challenge (once, and not in the middle of a mock
 * paper); after that, a strip links back to it from anywhere else. While the
 * challenge is open the teacher is told, so their board shows who has it.
 */
export function LiveBanner() {
  const pathname = usePathname();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    let stopped = false;
    const check = async () => {
      if (document.hidden) return;
      try {
        const response = await fetch("/api/live", { cache: "no-store" });
        if (!response.ok) return;
        const { lesson } = (await response.json()) as { lesson: Lesson | null };
        if (!stopped) setLesson((now) => (now?.id === lesson?.id ? now : lesson));
      } catch {}
    };
    check();
    const interval = setInterval(check, CHECK_SECONDS * 1000);
    document.addEventListener("visibilitychange", check);
    return () => {
      stopped = true;
      clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  const href = lesson ? `/problems/${lesson.slug}` : null;
  const here = href !== null && pathname === href;
  const lessonId = lesson?.id;

  // Taken to a new lesson's challenge once. Leaving it afterwards is allowed.
  useEffect(() => {
    if (!lessonId || !href || here) return;
    const key = `live-sent:${lessonId}`;
    if (readDraft(key)) return;
    writeDraft(key, "1");
    if (!pathname.startsWith("/mock/")) router.push(href);
  }, [lessonId, href, here, pathname, router]);

  useEffect(() => {
    if (!lessonId || !here) return;
    fetch("/api/live", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lessonId }) }).catch(() => {});
  }, [lessonId, here]);

  if (!lesson || !href) return null;
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6" role="status">
      <p className="live-strip">
        <span className="tag" style={{ "--tone": "var(--fail)" } as React.CSSProperties}>
          Live
        </span>
        {here ? (
          <span className="min-w-0 flex-1">This is the class challenge for now. Your teacher can see when you open, try and solve it.</span>
        ) : (
          <>
            <span className="min-w-0 flex-1">
              Your teacher has set <b className="font-semibold">{lesson.title}</b> for the class now.
            </span>
            <Link href={href} className="btn btn-primary">
              Open it
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
