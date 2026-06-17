import { CodeBlock } from "../components/CodeBlock";
import Sidebar from "../components/Sidebar";

function BuildingLocalGraphPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={4}></Sidebar>
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
          <h1>Building a LocalGraph</h1>
          <p>
            A <code>LocalGraph</code> is Kumo's in-memory representation of your
            relational schema. It tracks tables, primary keys, foreign-key
            links, and (optionally) a temporal axis. There are two construction
            styles, and you'll mix them depending on whether the schema can be
            inferred automatically.
          </p>
          <h2>The fast path: from_data</h2>
          <p>
            Works well when your tables already have unambiguous primary/foreign
            key column names (e.g. Northwind). Kumo infers the schema in one
            call.
          </p>
          <CodeBlock
            code='import kumoai.experimental.rfm as rfm

graph = rfm.LocalGraph.from_data({
    "customers": customers,
    "orders": orders,
    "order_details": order_details,
    "products": products,
    # ...
})
graph.visualize()'
          />
          <h2>The manual path: tables + explicit links</h2>
          <p>
            For messy medical schemas (MIMIC-III, MIMIC-IV) the auto-inferred
            graph leaves orphan tables and ambiguous joins. The fix is to build
            each table, declare the primary key, then link foreign keys by hand.
          </p>
          <CodeBlock
            code='def transform_to_rfm_table(tables_dict):
    result = {}
    for name, df in tables_dict.items():
        result[name] = rfm.LocalTable(df=df, name=name).infer_metadata()
    return result

tables = transform_to_rfm_table(tables_dict)

# Tell Kumo which column uniquely identifies each row
tables["d_icd_diagnoses"].primary_key = "icd_code"
tables["d_icd_procedures"].primary_key = "icd_code"
tables["d_labitems"].primary_key   = "itemid"

graph = rfm.LocalGraph(tables=tables.values())

# Wire up foreign keys explicitly
graph.link(src_table="services",    fkey="subject_id", dst_table="patients")
graph.link(src_table="services",    fkey="hadm_id",    dst_table="admissions")
graph.link(src_table="transfers",   fkey="subject_id", dst_table="patients")
graph.link(src_table="diagnoses_icd", fkey="icd_code", dst_table="d_icd_diagnoses")`'
          />

          <div className="callout warn">
            <strong>Common pitfall.</strong> If two tables share the same
            subject_id but Kumo can't tell which is parent vs. child, the
            auto-inferred link gets dropped silently. Always run
            graph.visualize() and confirm every edge you expect is present.
          </div>

          <h2>Temporal vs. static graphs</h2>
          <p>
            When you materialize the graph, Kumo prints a one-line summary
            telling you whether it found a temporal axis. Examples from the
            project:
          </p>
          <CodeBlock
            code="✅ Materializing graph (8.82s)
   ↳ Identified temporal graph from 2105-01-19 to 2215-03-21
   ↳ Created graph with 10,790,354 nodes and 9,679,878 edges"
          />
          <p>
            A temporal graph unlocks time-bounded PQL queries like
            <code>COUNT(orders.*, 0, 30, days)</code>. A static graph (eICU-CRD
            in this project) only supports aggregation, not windowed forecasts.
          </p>
          <h2>Tip: stabilize coincident timestamps</h2>
          <p>
            In MIMIC-III, multiple operational tables share{" "}
            <code>admittime</code> down to the second, which collapses the
            temporal index. A 1-second offset on the secondary tables keeps the
            timeline intact:
          </p>
          <CodeBlock
            code={`transfers_df["transfer_intime"] = transfers_df["transfer_intime"] + pd.to_timedelta(1, "s")
services_df["transfertime"] = services_df["transfertime"] + pd.to_timedelta(1, "s")`}
          />
          <p>
            Once the graph materializes cleanly, wrap it in{" "}
            <code>rfm.KumoRFM(graph)</code> and head to{" "}
            <a href="/predictions">Predictions &amp; PQL</a>.
          </p>
        </main>
      </div>
    </div>
  );
}

export default BuildingLocalGraphPage;
