import { Link, useParams } from "react-router-dom";
import { bySlug, notebooks } from "../data/notebooks";
import Sidebar from "../components/Sidebar";

export default function NotebookPage() {
  const { slug } = useParams();
  const nb = bySlug[slug];

  if (!nb) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 min-w-0">
          <header className="lg:hidden sticky top-0 z-20 bg-background/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
            <button
              className="text-sm font-medium text-foreground/80"
              aria-label="Open navigation"
            >
              ☰ Menu
            </button>
            <span className="text-sm font-display font-semibold">
              Kumo RFM Docs
            </span>
          </header>
          <main className="max-w-3xl mx-auto px-6 lg:px-12 py-10 lg:py-16 doc-prose">
            <h1>Notebook not found</h1>
            <Link to="/kumorfm-evaluation/notebooks">← All notebooks</Link>
          </main>
        </div>
      </div>
    );
  }

  const url = `/notebooks/${nb.file}`;

  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={nb.activeIndex}></Sidebar>
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 bg-background/90 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <button
            className="text-sm font-medium text-foreground/80"
            aria-label="Open navigation"
          >
            ☰ Menu
          </button>
          <span className="text-sm font-display font-semibold">
            Kumo RFM Docs
          </span>
        </header>
        <main className="max-w-3xl mx-auto px-6 lg:px-12 py-10 lg:py-16 doc-prose">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-2">
            Notebook
          </div>
          <h1>{nb.title}</h1>
          <p className="!text-lg !text-foreground/70">{nb.blurb}</p>

          {nb.graph && (
            <div className="not-prose flex flex-wrap gap-2 mt-4 mb-2">
              <Pill
                label={nb.graph.type}
                tone={nb.graph.type === "Static" ? "warn" : "ok"}
              />
              <Pill label={`${nb.graph.nodes} nodes`} />
              <Pill label={`${nb.graph.edges} edges`} />
              <Pill label={`materialized in ${nb.graph.time}`} />
            </div>
          )}

          <div className="not-prose flex flex-wrap gap-2 my-6">
            <a
              href={url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"
            >
              Download <code className="text-xs opacity-80">{nb.file}</code>
            </a>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card font-medium text-sm hover:bg-muted"
            >
              View raw JSON ↗
            </a>
            <a
              href={nb.collabUrl ?? "https://colab.research.google.com/"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card font-medium text-sm hover:bg-muted"
            >
              Open Colab
            </a>
          </div>

          <h2>What it covers</h2>
          <ul>
            {nb.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          <h2>Related pages</h2>
          <ul>
            <li>
              <Link to="/kumorfm-evaluation//getting-started">
                Getting Started
              </Link>{" "}
              — install &amp; init.
            </li>
            <li>
              <Link to="/kumorfm-evaluation//connect-bigquery">
                Connect to BigQuery
              </Link>{" "}
              — the loader used in this notebook.
            </li>
            <li>
              <Link to="/kumorfm-evaluation//local-graph">
                Building a LocalGraph
              </Link>{" "}
              — graph assembly &amp; linking.
            </li>
            <li>
              <Link to="/kumorfm-evaluation//predictions">
                Predictions &amp; PQL
              </Link>{" "}
              — the query syntax.
            </li>
          </ul>

          <div className="not-prose mt-12 pt-6 border-t flex items-center justify-between text-sm">
            <Link
              to="/kumorfm-evaluation//notebooks"
              className="text-primary hover:underline"
            >
              ← All notebooks
            </Link>
            <Neighbor slug={nb.slug} />
          </div>
        </main>
      </div>
    </div>
  );
}

function Neighbor({ slug }) {
  const idx = notebooks.findIndex((n) => n.slug === slug);
  const next = notebooks[idx + 1];
  if (!next) return null;
  return (
    <Link
      to={`/kumorfm-evaluation//notebooks/${next.slug}`}
      className="text-primary hover:underline"
    >
      Next: {next.shortTitle} →
    </Link>
  );
}

function Pill({ label, tone = "neutral" }) {
  const cls =
    tone === "ok"
      ? "bg-primary/10 text-primary"
      : tone === "warn"
        ? "bg-accent/10 text-accent"
        : "bg-muted text-muted-foreground";
  return (
    <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${cls}`}>
      {label}
    </span>
  );
}
