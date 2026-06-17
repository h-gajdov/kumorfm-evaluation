import { useState } from "react";

function highlight(code) {
  let h = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const strings = [];
  const comments = [];

  // Extract strings first
  h = h.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, (match) => {
    const idx = strings.length;
    strings.push(match);
    return `__STRING_${idx}__`;
  });

  // Extract comments
  h = h.replace(/(#[^\n]*)/g, (match) => {
    const idx = comments.length;
    comments.push(match);
    return `__COMMENT_${idx}__`;
  });

  // Highlight keywords only on raw code
  h = h.replace(
    /\b(import|from|as|def|return|for|in|if|else|elif|with|try|except|finally|class|lambda|None|True|False|and|or|not|while|break|continue|pass|yield|global|nonlocal|raise|async|await|PREDICT|FOR|EACH|WHERE|COUNT|SUM|AVG)\b/g,
    '<span class="tok-k">$1</span>',
  );

  // Restore strings
  h = h.replace(
    /__STRING_(\d+)__/g,
    (_, idx) => `<span class="tok-s">${strings[idx]}</span>`,
  );

  // Restore comments
  h = h.replace(
    /__COMMENT_(\d+)__/g,
    (_, idx) => `<span class="tok-c">${comments[idx]}</span>`,
  );

  return h;
}

export function CodeBlock({ code, lang = "python" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[11px] uppercase tracking-wider text-white/40">
          {lang}
        </span>

        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded bg-white/10 text-white/80 hover:bg-white/20"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="code-block">
        <code
          dangerouslySetInnerHTML={{
            __html: highlight(code),
          }}
        />
      </pre>
    </div>
  );
}
