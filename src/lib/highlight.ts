// A small Python highlighter: enough for the backdrop, the home page summary
// and the sign-in sample. It returns [text, className] pairs for one line.

const TOKEN =
  /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(def|return|if|elif|else|for|while|in|not|and|or|class|import|from|True|False|None|break|continue|pass|try|except|is)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)(?=\()/g;

export type Token = [text: string, className: string];

export function highlight(line: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    if (match.index > last) tokens.push([line.slice(last, match.index), ""]);
    const className = match[1] ? "tok-com" : match[2] ? "tok-str" : match[3] ? "tok-kw" : match[4] ? "tok-num" : "tok-fn";
    tokens.push([match[0], className]);
    last = match.index + match[0].length;
  }
  if (last < line.length) tokens.push([line.slice(last), ""]);
  return tokens;
}
