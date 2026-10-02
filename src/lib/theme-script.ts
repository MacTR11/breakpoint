// Runs before the page paints, so the right theme is there from the first
// frame: a saved choice if there is one, otherwise the device's setting.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;
