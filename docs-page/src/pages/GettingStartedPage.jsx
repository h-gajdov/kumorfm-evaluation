import { CodeBlock } from "../components/CodeBlock";
import Sidebar from "../components/Sidebar";

function GettingStartedPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={1}></Sidebar>
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
          <h1>Getting Started</h1>
          <p>
            Every notebook in this project follows the same three-line
            bootstrap. If you can run this block, you have a working Kumo
            environment.
          </p>
          <h2>1. Install</h2>
          <CodeBlock code="!pip install kumoai" />
          <h2>2. Set your API key</h2>
          <p>
            Grab an API key from the Kumo dashboard. In Colab the simplest
            pattern is to put it on the process environment before calling
            <code>rfm.init</code>.
            <CodeBlock
              code='import os
import kumoai.experimental.rfm as rfm

os.environ["KUMO_API_KEY"] = "...your-token..."
rfm.init(api_key=os.environ["KUMO_API_KEY"])
# or simply put it as an environment variable'
            />
          </p>
          <div className="callout warn">
            <strong>Don't commit your key.</strong> The keys printed in the
            source notebooks are personal tokens — replace them with your own
            and ideally load from Colab Secrets or an environment variable
            instead of hard-coding.
          </div>
          <h2>3. Verify the import</h2>
          <p>
            From here on, the workflow always looks the same: assemble a dict of
            pandas DataFrames, wrap it in a <code>LocalGraph</code>, instantiate
            a <code>KumoRFM</code>
            model, and call <code>model.predict(query)</code>.
          </p>
          <CodeBlock
            code='import pandas as pd

graph = rfm.LocalGraph.from_data({"customers": customers_df, "orders": orders_df})
model = rfm.KumoRFM(graph)
df = model.predict(
    "PREDICT COUNT(orders.*, 0, 30, days) = 0 FOR EACH customers.customerID"
)'
          ></CodeBlock>
          <p>
            Continue to <a href="/connect-bigquery">Connect to BigQuery</a> for
            loading real datasets, or jump to{" "}
            <a href="/predictions">Predictions &amp; PQL</a> for the query
            syntax.
          </p>
        </main>
      </div>
    </div>
  );
}

export default GettingStartedPage;
