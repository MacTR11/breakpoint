// The OCR H446 A Level Computer Science specification, as far as it is needed
// to label problems and draw the course map.

export type SpecSection = { ref: string; title: string; note?: string };
export type SpecComponent = { id: number; code: string; title: string; blurb: string; sections: SpecSection[] };

export const COMPONENTS: SpecComponent[] = [
  {
    id: 1,
    code: "01",
    title: "Computer systems",
    blurb: "Data representation, data structures, Boolean algebra, assembly language, object-oriented programming, SQL and web technologies.",
    sections: [
      { ref: "1.1", title: "Processors, input, output and storage" },
      { ref: "1.2", title: "Software and software development" },
      { ref: "1.3", title: "Exchanging data" },
      { ref: "1.4", title: "Data types, data structures and algorithms" },
      { ref: "1.5", title: "Legal, moral, cultural and ethical issues", note: "Extended-writing content, so there are no auto-marked tasks here." },
    ],
  },
  {
    id: 2,
    code: "02",
    title: "Algorithms and programming",
    blurb: "Computational thinking, programming techniques, and the standard searching, sorting and path-finding algorithms.",
    sections: [
      { ref: "2.1", title: "Elements of computational thinking" },
      { ref: "2.2", title: "Problem solving and programming" },
      { ref: "2.3", title: "Algorithms" },
    ],
  },
  {
    id: 3,
    code: "03",
    title: "Programming project",
    blurb: "The skills the project is marked on: validation, robust code, classes, testing and evaluation.",
    sections: [
      { ref: "3.1", title: "Analysis of the problem" },
      { ref: "3.2", title: "Design of the solution" },
      { ref: "3.3", title: "Developing the solution" },
      { ref: "3.4", title: "Evaluation" },
    ],
  },
];

export const SUBSECTIONS: Record<string, string> = {
  "1.1.1": "Structure and function of the processor",
  "1.1.2": "Types of processor",
  "1.1.3": "Input, output and storage",
  "1.2.1": "Systems software",
  "1.2.2": "Applications generation",
  "1.2.3": "Software development",
  "1.2.4": "Types of programming language",
  "1.3.1": "Compression, encryption and hashing",
  "1.3.2": "Databases",
  "1.3.3": "Networks",
  "1.3.4": "Web technologies",
  "1.4.1": "Data types",
  "1.4.2": "Data structures",
  "1.4.3": "Boolean algebra",
  "2.1.1": "Thinking abstractly",
  "2.1.2": "Thinking ahead",
  "2.1.3": "Thinking procedurally",
  "2.1.4": "Thinking logically",
  "2.1.5": "Thinking concurrently",
  "2.2.1": "Programming techniques",
  "2.2.2": "Computational methods",
  "2.3.1": "Algorithms",
  "3.1": "Analysis of the problem",
  "3.2": "Design of the solution",
  "3.3": "Developing the solution",
  "3.4": "Evaluation",
};

export const SPEC_REFS = Object.keys(SUBSECTIONS);

/** "1.4.1" belongs to section "1.4"; component 3 references are already sections. */
export const sectionOf = (specRef: string) => specRef.split(".").slice(0, 2).join(".");

export const componentOf = (specRef: string) => Number(specRef[0]);

export const specLabel = (specRef: string) => (SUBSECTIONS[specRef] ? `${specRef} ${SUBSECTIONS[specRef]}` : specRef);
