// The accounts the end-to-end tests sign in with. They exist only in the
// tests' own database (prisma/e2e.db), made by e2e/prepare.ts.

export type Account = { username: string; password: string };

export const TEACHER: Account = { username: "teacher", password: "e2e-teacher-pass" };

/** One student per area of the site, so the tests do not trip over each other's progress. */
export const STUDENTS = {
  ann: { name: "Ann Archer", username: "aarcher", password: "e2e-pass-ann", group: "12A" },
  ben: { name: "Ben Baker", username: "bbaker", password: "e2e-pass-ben", group: "12A" },
  cat: { name: "Cat Cole", username: "ccole", password: "e2e-pass-cat", group: "12B" },
  dan: { name: "Dan Dixon", username: "ddixon", password: "e2e-pass-dan", group: "12A" },
  eve: { name: "Eve Evans", username: "eevans", password: "e2e-pass-eve", group: "12B" },
  fay: { name: "Fay Ford", username: "fford", password: "e2e-pass-fay", group: "13A" },
  gus: { name: "Gus Grant", username: "ggrant", password: "e2e-pass-gus", group: "13A" },
  hal: { name: "Hal Hughes", username: "hhughes", password: "e2e-pass-hal", group: "13A" },
  ivy: { name: "Ivy Irwin", username: "iirwin", password: "e2e-pass-ivy", group: "13B" },
  jo: { name: "Jo Jones", username: "jjones", password: "e2e-pass-jo", group: "12B" },
  // The only student in 13C, so a live lesson for 13C pulls nobody else away.
  kit: { name: "Kit Kerr", username: "kkerr", password: "e2e-pass-kit", group: "13C" },
} satisfies Record<string, Account & { name: string; group: string }>;
