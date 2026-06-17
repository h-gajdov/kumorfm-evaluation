import { CodeBlock } from "../components/CodeBlock";
import Sidebar from "../components/Sidebar";

function PQLPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={5}></Sidebar>
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
          <h1>Predictions & PQL</h1>
          <p>
            Kumo's <strong>Predictive Query Language (PQL)</strong> reads like a
            SQL/forecast hybrid. Every query has the same skeleton:
          </p>
          <CodeBlock
            code="PREDICT <aggregation>(<table.column>, <start>, <end>, <unit>) [comparison]
FOR EACH <entity_table>.<entity_id>
[WHERE <filter on past behaviour>]"
          />
          <h2>1. Classification - churn</h2>
          <p>
            From <code>testing_kumo.ipynb</code>. We predict whether a customer
            will place <strong>zero</strong> orders in the next 30 days,
            restricted to customers active in the previous 90 days.
          </p>
          <CodeBlock
            code={`query = """
PREDICT COUNT(orders.*, 0, 30, days) = 0
FOR EACH customers.customerID
WHERE COUNT(orders.*, -90, 0, days) > 0
"""

customer_ids = customers["customerID"].tolist()
df = model.predict(query, indices=customer_ids)`}
          />
          <p>The returned DataFrame has columns:</p>
          <ul>
            <li>
              <code>ENTITY</code> - the customer ID
            </li>
            <li>
              <code>ANCHOR_TIMESTAMP</code> - the cutoff date; history before is
              the input, future after is the target
            </li>
            <li>
              <code>TARGET_PRED</code> - <code>True</code> = will churn,{" "}
              <code>False</code> = will order
            </li>
            <li>
              <code>True_PROB</code> / <code>False_PROB</code> - class
              probabilities in [0, 1]
            </li>
          </ul>
          <h2>2. Regression - freight forecast</h2>
          <CodeBlock
            code={`query_freight = """
PREDICT SUM(orders.freight, 0, 90, days)
FOR EACH customers.customerID
"""
df_freight = model.predict(query_freight, indices=customers["customerID"].tolist())`}
          />
          <p>
            <code>TARGET_PRED</code> is now a scalar - predicted total freight
            cost over the next 90 days.
          </p>
          <h2>3. Count regression - workload</h2>
          <CodeBlock
            code={`query = """
PREDICT COUNT(orders.*, 0, 60, days)
FOR EACH employees.employeeID
"""
df_emp = model.predict(query, indices=employees["employeeID"].tolist())`}
          />

          <h2>4. Mortality - MIMIC-III</h2>
          <p>
            With a properly linked clinical graph (see{" "}
            <a href="/kumorfm-evaluation/local-graph">Building a LocalGraph</a>)
            you can ask binary-outcome questions on derived target columns:
          </p>
          <CodeBlock
            code={`icustays_df["died_within_48h"] = (
    icustays_df["deathtime"].notna()
    & ((icustays_df["deathtime"] - icustays_df["intime"]).dt.total_seconds() / 3600 <= 48)
).astype(int)

query = """
PREDICT icustays.died_within_48h
FOR EACH icustays.stay_id
"""
df = model.predict(query, indices=icustays_df["stay_id"].tolist())`}
          />

          <h2>Interpreting the output</h2>
          <p>
            Plot probability distributions to spot mass at the extremes - a
            healthy classifier shows a bimodal distribution rather than a flat
            band around 0.5.
          </p>
          <CodeBlock
            code={`import seaborn as sns
sns.histplot(df["True_PROB"], bins=15, kde=True)

high_risk = df[df["True_PROB"] > 0.7].sort_values("True_PROB", ascending=False)`}
          />

          <p>
            See <a href="/kumorfm-evaluation/limits">Rate Limits &amp; Tips</a>{" "}
            for what to expect when you push the free tier with batch
            predictions.
          </p>
        </main>
      </div>
    </div>
  );
}

export default PQLPage;
