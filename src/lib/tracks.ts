// The topic strands problems are grouped into on the course map.

/**
 * `color` is the topic's own colour: its tile is filled with it and its name is
 * written in it, so it must be deep enough for white text. `glyph` is a scrap
 * of code printed faintly on the tile.
 */
export type Track = { id: string; title: string; blurb: string; color: string; glyph: string };

export const TRACKS: Track[] = [
  { id: "warmup", color: "#d6409f", glyph: "hi", title: "First steps", blurb: "Short wins to get you going: one idea at a time, with most of the code already there." },
  { id: "basics", color: "#0a7aff", glyph: ">>>", title: "Python basics", blurb: "Selection, loops, arithmetic and tracing code by hand." },
  { id: "strings", color: "#e8365d", glyph: '"ab"', title: "Strings", blurb: "Slicing, building, searching and transforming text." },
  { id: "lists", color: "#d96d00", glyph: "[ ]", title: "Lists and dictionaries", blurb: "One- and two-dimensional arrays, records and lookups." },
  { id: "recursion", color: "#a550e0", glyph: "f(f)", title: "Functions and recursion", blurb: "Scope, parameters and functions that call themselves." },
  { id: "searching", color: "#1492aa", glyph: "==", title: "Searching", blurb: "Linear and binary search: writing them, tracing them, counting their steps." },
  { id: "sorting", color: "#5856d6", glyph: "a<b", title: "Sorting", blurb: "Bubble, insertion, merge and quick sort, written by hand." },
  { id: "debugging", color: "#e5372c", glyph: "!=", title: "Debugging", blurb: "Broken code to repair, and bugs to spot before they bite." },
  { id: "structures", color: "#2a9d48", glyph: "{ }", title: "Data structures", blurb: "Stacks, queues, linked lists, trees and hash tables." },
  { id: "oop", color: "#00a096", glyph: ".self", title: "Object-oriented programming", blurb: "Classes, encapsulation, inheritance and polymorphism." },
  { id: "robust", color: "#c48500", glyph: "try", title: "Robust programs", blurb: "Validation, messy input, file records and choosing test data." },
  { id: "bits", color: "#2b8ed6", glyph: "0b1", title: "Bits and bytes", blurb: "Binary, hexadecimal and bitwise operations, in code." },
  { id: "algorithms", color: "#8e7350", glyph: "O(n)", title: "Algorithm challenges", blurb: "Graphs, path finding, backtracking, dynamic programming and Big O." },
  { id: "exam", color: "#4a5a82", glyph: "[6]", title: "Exam-style questions", blurb: "Write-the-code questions in the style of the H446 papers: a scenario, several parts, and marks for each." },
];

export const TRACK_IDS = TRACKS.map((t) => t.id);
export const trackTitle = (id: string) => TRACKS.find((t) => t.id === id)?.title ?? id;
export const trackColor = (id: string) => TRACKS.find((t) => t.id === id)?.color ?? "#8e8e93";
export const trackGlyph = (id: string) => TRACKS.find((t) => t.id === id)?.glyph ?? "";
