// Builds the end-to-end tests' database from nothing: a new prisma/e2e.db file,
// the content files, and the classes and students in e2e/accounts.ts. Run by
// playwright.config.ts before it starts the site. It refuses to run for any
// database but that file.
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { guessYear } from "../src/lib/classes";
import { hashPassword } from "../src/lib/passwords";
import { STUDENTS } from "./accounts";

const url = process.env.DATABASE_URL ?? "";
if (url !== "file:./e2e.db") throw new Error(`Refusing to reset ${url || "a database with no DATABASE_URL"}: the end-to-end tests only use file:./e2e.db.`);

// A new, empty file each run: this suite's own database, never the dev one.
for (const file of ["prisma/e2e.db", "prisma/e2e.db-journal"]) rmSync(file, { force: true });
execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });

const db = new PrismaClient();
(async () => {
  const groups = new Map<string, string>();
  for (const name of [...new Set(Object.values(STUDENTS).map((s) => s.group))].sort()) {
    groups.set(name, (await db.class.create({ data: { name, year: guessYear(name) } })).id);
  }
  for (const s of Object.values(STUDENTS)) {
    await db.user.create({ data: { name: s.name, username: s.username, role: "STUDENT", passwordHash: await hashPassword(s.password), classId: groups.get(s.group) } });
  }
  console.log(`e2e: ${groups.size} classes and ${Object.keys(STUDENTS).length} students ready.`);
  await db.$disconnect();
})();
