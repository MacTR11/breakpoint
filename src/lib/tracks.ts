// The topic strands problems are grouped into on the course map.

export type Track = { id: string; title: string; blurb: string };

export const TRACKS: Track[] = [
  { id: "basics", title: "Python basics", blurb: "Selection, loops, arithmetic and tracing code by hand." },
  { id: "strings", title: "Strings", blurb: "Slicing, building, searching and transforming text." },
  { id: "lists", title: "Lists and dictionaries", blurb: "One- and two-dimensional arrays, records and lookups." },
  { id: "recursion", title: "Functions and recursion", blurb: "Scope, parameters and functions that call themselves." },
  { id: "searching", title: "Searching", blurb: "Linear and binary search: writing them, tracing them, counting their steps." },
  { id: "sorting", title: "Sorting", blurb: "Bubble, insertion, merge and quick sort, written by hand." },
  { id: "debugging", title: "Debugging", blurb: "Broken code to repair, and bugs to spot before they bite." },
  { id: "structures", title: "Data structures", blurb: "Stacks, queues, linked lists, trees and hash tables." },
  { id: "oop", title: "Object-oriented programming", blurb: "Classes, encapsulation, inheritance and polymorphism." },
  { id: "robust", title: "Robust programs", blurb: "Validation, messy input, file records and choosing test data." },
  { id: "bits", title: "Bits and bytes", blurb: "Binary, hexadecimal and bitwise operations, in code." },
  { id: "algorithms", title: "Algorithm challenges", blurb: "Graphs, path finding, backtracking, dynamic programming and Big O." },
];

export const TRACK_IDS = TRACKS.map((t) => t.id);
export const trackTitle = (id: string) => TRACKS.find((t) => t.id === id)?.title ?? id;
