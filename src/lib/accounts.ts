import { randomInt } from "node:crypto";

// Usernames, generated passwords and the student CSV. No database access here.

export const MIN_PASSWORD = 6;
export const MAX_IMPORT = 500;

/** Usernames are stored and compared in lower case, so "JSmith" and "jsmith" are the same account. */
export const cleanUsername = (value: string) => value.trim().toLowerCase();

/** Why a username cannot be used, or null if it is fine. */
export function usernameProblem(username: string): string | null {
  if (username.length < 2 || username.length > 32) return "Usernames are 2 to 32 characters long.";
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(username)) return "Usernames use letters, numbers, dots, hyphens and underscores, and start with a letter or number.";
  return null;
}

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD) return `Passwords need at least ${MIN_PASSWORD} characters.`;
  if (password.length > 100) return "Passwords can be at most 100 characters.";
  return null;
}

/** A username made from a name: first initial and surname, with a number added if that is taken. */
export function usernameFor(name: string, taken: Set<string>) {
  const words = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
  const base = (words.length > 1 ? words[0][0] + words[words.length - 1] : (words[0] ?? "student")).slice(0, 28).padEnd(2, "x");
  let username = base;
  for (let n = 2; taken.has(username); n++) username = `${base}${n}`;
  return username;
}

const FIRST = ["amber", "brisk", "calm", "clever", "cosmic", "crisp", "dusty", "eager", "early", "fuzzy", "gentle", "giant", "glad", "golden", "happy", "icy", "jolly", "keen", "lively", "lucky", "mellow", "misty", "noble", "olive", "plucky", "proud", "quick", "quiet", "rapid", "rosy", "rusty", "shiny", "silver", "snowy", "sunny", "swift", "tidy", "vivid", "witty", "zesty"];
const SECOND = ["acorn", "badger", "beacon", "birch", "canyon", "comet", "coral", "falcon", "fern", "garnet", "harbour", "heron", "island", "jigsaw", "kettle", "lantern", "maple", "meadow", "nutmeg", "ocean", "otter", "pebble", "pepper", "planet", "quartz", "raven", "river", "rocket", "saddle", "sparrow", "summit", "thistle", "tiger", "tulip", "valley", "walnut", "willow", "window", "yarrow", "zebra"];

/** A password a student can read off a sheet and type: two words and a number. */
export const generatePassword = () => `${FIRST[randomInt(FIRST.length)]}-${SECOND[randomInt(SECOND.length)]}-${randomInt(10, 100)}`;

/** Split CSV text into rows of cells. Handles quoted cells, and tabs or semicolons in place of commas. */
export function parseCsv(text: string): string[][] {
  const source = text.replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  const firstLine = source.split("\n", 1)[0];
  const separator = firstLine.includes("\t") ? "\t" : firstLine.split(";").length > firstLine.split(",").length ? ";" : ",";
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"' && source[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"' && cell === "") quoted = true;
    else if (char === separator) {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  row.push(cell);
  rows.push(row);
  return rows.map((cells) => cells.map((c) => c.trim())).filter((cells) => cells.some(Boolean));
}

export type ImportRow = { line: number; name: string; username: string; password: string };

const HEADERS: Record<string, "name" | "first" | "last" | "username" | "password"> = {
  name: "name",
  "full name": "name",
  fullname: "name",
  student: "name",
  "student name": "name",
  "first name": "first",
  firstname: "first",
  forename: "first",
  "last name": "last",
  lastname: "last",
  surname: "last",
  username: "username",
  "user name": "username",
  user: "username",
  login: "username",
  password: "password",
  pass: "password",
};

/**
 * Read the student CSV. With a heading row the columns can be in any order
 * (name, or first name and surname; username; password). Without one they are
 * taken as name, username, password. Username and password may be left out.
 */
export function readStudentCsv(text: string): { rows: ImportRow[]; errors: string[] } {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], errors: ["There is nothing to import."] };
  const heading = table[0].map((cell) => HEADERS[cell.toLowerCase()]);
  const hasHeading = heading.some(Boolean);
  const column = (kind: string) => (hasHeading ? heading.indexOf(kind as never) : ["name", "username", "password"].indexOf(kind));
  if (hasHeading && column("name") < 0 && column("first") < 0 && column("last") < 0) return { rows: [], errors: ['The heading row needs a "name" column (or "first name" and "surname").'] };

  const body = hasHeading ? table.slice(1) : table;
  if (body.length > MAX_IMPORT) return { rows: [], errors: [`That is ${body.length} rows. Import at most ${MAX_IMPORT} at a time.`] };
  const errors: string[] = [];
  const rows: ImportRow[] = [];
  body.forEach((cells, index) => {
    const line = index + (hasHeading ? 2 : 1);
    const at = (kind: string) => cells[column(kind)] ?? "";
    // School systems often export "Surname, Forename" in one cell.
    const listed = /^([^,]+),([^,]+)$/.exec(at("name"));
    const name = (listed ? `${listed[2]} ${listed[1]}` : at("name") || `${at("first")} ${at("last")}`).replace(/\s+/g, " ").trim();
    if (!name) return errors.push(`Row ${line} has no name.`);
    rows.push({ line, name: name.slice(0, 80), username: cleanUsername(at("username")), password: at("password") });
  });
  return { rows, errors };
}
