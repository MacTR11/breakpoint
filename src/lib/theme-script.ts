// Runs before the page paints, so the right theme is there from the first
// frame: a saved choice if there is one, otherwise the device's setting. It
// also keeps the Easter egg's terminal mode on for the rest of the tab's life.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);if(sessionStorage.getItem("terminal"))document.documentElement.classList.add("terminal")}catch(e){}})()`;
