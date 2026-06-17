import { CodeBlock } from "../components/CodeBlock";
import Sidebar from "../components/Sidebar";
import playgroundPdf from "../assets/docs/e-commerce-1.pdf";

function RFMPlaygroundPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={2}></Sidebar>
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
          <h1>RFM Playground — E-commerce</h1>
          <p>
            <p>
              This page wraps the official <strong>Kumo RFM Playground</strong>{" "}
              PDF. It's the most beginner-friendly entry point: a UI-driven
              walkthrough that uses the same Northwind-style e-commerce schema
              you'll see in <code>testing_kumo.ipynb</code>.
            </p>
            <p>
              Read it first if you've never seen a predictive query — it shows
              the same <code>PREDICT … FOR EACH</code> grammar applied to churn
              and customer-lifetime-value problems, with screenshots of the
              hosted playground UI.
            </p>

            <div className="not-prose my-6 flex flex-wrap gap-3">
              <a
                href={playgroundPdf}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90"
              >
                Open PDF in new tab ↗
              </a>
              <a
                href={playgroundPdf}
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-card font-medium text-sm hover:bg-muted"
              >
                Download PDF
              </a>
            </div>

            <div className="not-prose rounded-lg border overflow-hidden bg-card">
              <iframe
                src={playgroundPdf}
                title="Kumo RFM Playground — E-commerce walkthrough"
                className="w-full h-[80vh]"
              />
            </div>

            <h2>How it pairs with the notebooks</h2>
            <p>
              The PDF demonstrates the same predictions we re-implement in code.
              Treat it as the "marketing-website" version, then jump to the
              corresponding notebook for the SDK calls and the data-loading
              details:
            </p>
            <ul>
              <li>
                <a href="/kumorfm-evaluation/notebooks/testing-kumo">
                  testing_kumo.ipynb
                </a>{" "}
                — Northwind churn &amp; freight, the closest match to the PDF
                demo.
              </li>
              <li>
                <a href="/kumorfm-evaluation/connect-bigquery">
                  Connect to BigQuery
                </a>{" "}
                — when you want to replace the demo CSVs with a real warehouse
                source.
              </li>
            </ul>
          </p>
        </main>
      </div>
    </div>
  );
}

export default RFMPlaygroundPage;
