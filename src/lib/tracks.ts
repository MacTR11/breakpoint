// The topic strands problems are grouped into on the course map.

export type Track = { id: string; title: string; blurb: string; color: string };

export const TRACKS: Track[] = [
  { id: "basics", color: "#0a84ff", title: "Python basics", blurb: "Selection, loops, arithmetic and tracing code by hand." },
  { id: "strings", color: "#ff375f", title: "Strings", blurb: "Slicing, building, searching and transforming text." },
  { id: "lists", color: "#ff9f0a", title: "Lists and dictionaries", blurb: "One- and two-dimensional arrays, records and lookups." },
  { id: "recursion", color: "#bf5af2", title: "Functions and recursion", blurb: "Scope, parameters and functions that call themselves." },
  { id: "searching", color: "#30b0c7", title: "Searching", blurb: "Linear and binary search: writing them, tracing them, counting their steps." },
  { id: "sorting", color: "#5e5ce6", title: "Sorting", blurb: "Bubble, insertion, merge and quick sort, written by hand." },
  { id: "debugging", color: "#ff453a", title: "Debugging", blurb: "Broken code to repair, and bugs to spot before they bite." },
  { id: "structures", color: "#30d158", title: "Data structures", blurb: "Stacks, queues, linked lists, trees and hash tables." },
  { id: "oop", color: "#00c7be", title: "Object-oriented programming", blurb: "Classes, encapsulation, inheritance and polymorphism." },
  { id: "robust", color: "#ffb300", title: "Robust programs", blurb: "Validation, messy input, file records and choosing test data." },
  { id: "bits", color: "#32ade6", title: "Bits and bytes", blurb: "Binary, hexadecimal and bitwise operations, in code." },
  { id: "algorithms", color: "#ff2d92", title: "Algorithm challenges", blurb: "Graphs, path finding, backtracking, dynamic programming and Big O." },
];

export const TRACK_IDS = TRACKS.map((t) => t.id);
export const trackTitle = (id: string) => TRACKS.find((t) => t.id === id)?.title ?? id;
export const trackColor = (id: string) => TRACKS.find((t) => t.id === id)?.color ?? "#8e8e93";
