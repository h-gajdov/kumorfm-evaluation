import { CodeBlock } from "../components/CodeBlock";
import Sidebar from "../components/Sidebar";

function RateLimitsPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={6}></Sidebar>
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
          <h1>Rate Limits & Tips</h1>
          <p>
            These notes come straight from the load-tests in{" "}
            <code>testing_kumo.ipynb</code>. They describe observed behaviour on
            the free tier and aren't an official contract.
          </p>

          <h2>One live prediction at a time</h2>
          <p>
            The notebook spins up a <code>ThreadPoolExecutor</code> with{" "}
            <code>max_workers=2</code> and fires concurrent{" "}
            <code>model.predict</code> calls. Only one stream renders live; the
            second is queued.{" "}
            <strong>Don't bother parallelizing predictions in-process</strong> —
            it doesn't speed anything up on the free tier.
          </p>
          <CodeBlock
            code={`from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=2) as ex:
    futures = {ex.submit(dummy_query, i): i for i in range(5)}
    for fut in as_completed(futures):
        if not fut.result():
            ex.shutdown(wait=False, cancel_futures=True)
            break`}
          />

          <h2>Daily call cap</h2>
          <p>
            The FAQ quotes <strong>1,000 calls per day</strong> on the free
            tier. Looping a dummy query until it errors confirms a hard daily
            cutoff — schedule batch jobs accordingly, and cache <code>df</code>{" "}
            outputs locally instead of re-querying.
          </p>

          <h2>Graph size: what we actually pushed through</h2>
          <p>
            The materializer prints a node/edge summary. Here's what worked in
            this project:
          </p>
          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-muted text-foreground/70 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-3 py-2 text-left">Dataset</th>
                  <th className="px-3 py-2 text-right">Nodes</th>
                  <th className="px-3 py-2 text-right">Edges</th>
                  <th className="px-3 py-2 text-right">Materialize</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  ["Northwind (testing_kumo)", "—", "—", "0.8s"],
                  ["MIMIC-III", "1,393,410", "5,444,954", "0.8s"],
                  ["ENCoDE", "1,141,573", "5,188,918", "5.3s"],
                  ["MIMIC-IV mortality", "9,963,622", "1,141,182", "6.1s"],
                  ["ORCHID", "10,248,702", "9,032,302", "9.1s"],
                  ["MIMIC-IV load", "10,790,354", "9,679,878", "8.8s"],
                  ["eICU-CRD (static)", "11,543,467", "23,066,538", "10.2s"],
                  [
                    "MIMIC-IV mortality extended",
                    "27,635,918",
                    "47,278,352",
                    "27.7s",
                  ],
                ].map((r) => (
                  <tr key={r[0]} className="bg-card">
                    <td className="px-3 py-2 font-mono text-[13px]">{r[0]}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {r[1]}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {r[2]}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {r[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Predict latency depends far more on the entity-count of your{" "}
            <code>indices</code> list than on raw graph size. Trim to the
            relevant cohort before calling <code>predict</code>.
          </p>

          <h2>Other gotchas</h2>
          <ul>
            <li>
              <strong>Date dtypes.</strong> BigQuery's <code>dbdate</code> must
              be cast to <code>datetime64</code> or the temporal axis silently
              disappears.
            </li>
            <li>
              <strong>Coincident timestamps.</strong> If many rows share the
              exact same timestamp, shift one table by a second — see{" "}
              <a href="/kumorfm-evaluation/local-graph">LocalGraph</a>.
            </li>
            <li>
              <strong>API key in source.</strong> The notebooks paste the raw
              JWT into a string. For anything beyond a class project, load from
              a Colab Secret instead.
            </li>
          </ul>
        </main>
      </div>
    </div>
  );
}

export default RateLimitsPage;
