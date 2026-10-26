import { useState } from "react";
import "./App.css";

export default function App() {
  const [active, setActive] = useState("json");
  const [json, setJson] = useState('{"name":"DevKit","version":1}');
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [oldText, setOldText] = useState("Hello world");
  const [newText, setNewText] = useState("Hello DevKit");
  const [result, setResult] = useState(null);

  function formatJSON() {
    try {
      setOutput(JSON.stringify(JSON.parse(json), null, 2));
      setError("");
    } catch {
      setOutput("");
      setError("Invalid JSON! Please check your input.");
    }
  }

  function convertCase(type) {
    if (type === "upper") setOutput(text.toUpperCase());
    if (type === "lower") setOutput(text.toLowerCase());
    if (type === "title") {
      setOutput(
        text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
      );
    }
    setError("");
  }

  function compareTexts() {
    const a = oldText.split("\n");
    const b = newText.split("\n");
    const lines = [];
    const max = Math.max(a.length, b.length);

    for (let i = 0; i < max; i++) {
      if (a[i] === b[i]) {
        lines.push({ type: "same", text: a[i] ?? "" });
      } else {
        if (a[i] !== undefined) {
          lines.push({ type: "removed", text: "- " + a[i] });
        }
        if (b[i] !== undefined) {
          lines.push({ type: "added", text: "+ " + b[i] });
        }
      }
    }

    setResult(lines);
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setError("Copied successfully!");
    } catch {
      setError("Select the output and copy it manually.");
    }
  }

  function selectTool(tool) {
    setActive(tool);
    setOutput("");
    setError("");
    setResult(null);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>⚡ DevKit</h2>
        <p>YOUR DEVELOPER TOOLBOX</p>

        <button onClick={() => selectTool("json")}>
          {"{ }"} JSON Formatter
        </button>

        <button onClick={() => selectTool("case")}>
          Aa Case Converter
        </button>

        <button onClick={() => selectTool("diff")}>
          ⇄ Text Diff Checker
        </button>
      </aside>

      <main className="content">
        <span className="eyebrow">DEVKIT / TOOLBOX</span>

        {active === "json" && (
          <section>
            <h1>JSON Formatter</h1>
            <p>Make your JSON clean and readable.</p>

            <label>YOUR JSON INPUT</label>
            <textarea
              value={json}
              onChange={e => setJson(e.target.value)}
            />

            <button onClick={formatJSON}>Format JSON</button>
            {error && <p>{error}</p>}

            {output && (
              <>
                <h3>Formatted Output</h3>
                <pre>{output}</pre>
                <button onClick={copyOutput}>Copy Output</button>
              </>
            )}
          </section>
        )}

        {active === "case" && (
          <section>
            <h1>Case Converter</h1>
            <p>Convert text into different letter cases.</p>

            <label>YOUR TEXT</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Type your text here..."
            />

            <button onClick={() => convertCase("upper")}>
              UPPERCASE
            </button>
            <button onClick={() => convertCase("lower")}>
              lowercase
            </button>
            <button onClick={() => convertCase("title")}>
              Title Case
            </button>

            {output && <pre>{output}</pre>}
            {output && <button onClick={copyOutput}>Copy Output</button>}
            {error && <p>{error}</p>}
          </section>
        )}

        {active === "diff" && (
          <section>
            <h1>Text Diff Checker</h1>
            <p>Compare two texts and find the changes.</p>

            <label>ORIGINAL TEXT</label>
            <textarea
              value={oldText}
              onChange={e => setOldText(e.target.value)}
              placeholder="Enter original text"
            />

            <label>NEW TEXT</label>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Enter new text"
            />

            <button onClick={compareTexts}>Compare Texts</button>

            {result && (
              <div className="diff-results">
                {result.map((line, i) => (
                  <p className={line.type} key={i}>
                    {line.text || "(empty line)"}
                    {" — "}
                    {line.type === "added"
                      ? "ADDED"
                      : line.type === "removed"
                      ? "REMOVED"
                      : "UNCHANGED"}
                  </p>
                ))}
              </div>
            )}
          </section>
        )}

        <footer>DevKit © 2026 | Simple tools, smarter workflow.</footer>
      </main>
    </div>
  );
}
