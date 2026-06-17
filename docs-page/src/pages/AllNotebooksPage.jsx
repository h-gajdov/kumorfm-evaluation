import Sidebar from "../components/Sidebar";
import { notebooks } from "../data/notebooks";
import { Link } from "react-router-dom";

function AllNotebooksPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={7}></Sidebar>
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
          <h1>Example Notebooks</h1>
          <p>
            Each notebook below is a self-contained Colab demonstration. They
            share the same three-step spine (load data → build graph → predict)
            but differ in dataset, schema complexity, and whether the graph is
            temporal or static.
          </p>

          <div className="not-prose grid gap-4 my-8">
            {notebooks.map((nb) => (
              <Link
                key={nb.slug}
                to={"/notebooks/" + nb.slug}
                params={{ slug: nb.slug }}
                className="block rounded-lg border bg-card p-5 hover:border-primary/60 hover:shadow-sm transition-all"
              >
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <div className="font-display font-semibold text-lg text-foreground">
                    {nb.title}
                  </div>
                  <code className="text-[11px] text-muted-foreground">
                    {nb.file}
                  </code>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {nb.blurb}
                </p>
                {nb.graph && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Pill
                      label={nb.graph.type}
                      tone={nb.graph.type === "Static" ? "warn" : "ok"}
                    />
                    <Pill label={`${nb.graph.nodes} nodes`} />
                    <Pill label={`${nb.graph.edges} edges`} />
                    <Pill label={`materialized in ${nb.graph.time}`} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
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

export default AllNotebooksPage;
