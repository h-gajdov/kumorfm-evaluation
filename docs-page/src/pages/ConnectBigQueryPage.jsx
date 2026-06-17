import { CodeBlock } from "../components/CodeBlock";
import Sidebar from "../components/Sidebar";

function ConnectBigQuery() {
  return (
    <div className="min-h-screen flex">
      <Sidebar activeIndex={3}></Sidebar>
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
          <h1>Connect to BigQuery</h1>
          <p>
            Most of the medical-dataset notebooks (MIMIC-III, MIMIC-IV,
            eICU-CRD, ORCHID, ENCoDE) pull their tables straight out of the{" "}
            <strong>PhysioNet public BigQuery</strong> mirror. The flow is
            always the same: authenticate <code>gcloud</code>, open a{" "}
            <code>bigquery.Client</code>, and run <code>SELECT *</code> into a
            DataFrame.
          </p>
          <h2>1. Authenticate</h2>
          <p>
            In a Colab notebook, application-default credentials are the path of
            least resistance.
          </p>
          <CodeBlock code="!gcloud auth application-default login" />
          <div className="callout">
            For the PhysioNet datasets you must first link your PhysioNet
            account to a Google account and accept the data-use agreement for
            each dataset (e.g. <code>mimiciv_3_1_hosp</code>). Without that, the
            BigQuery jobs return <code>403 Access Denied</code>.
          </div>
          <h2>2. Open a client</h2>
          <CodeBlock
            code='from google.cloud import bigquery

client = bigquery.Client(project="diesel-charge-465712-f8")
# Billing project - must be a project you own, not physionet-data'
          />
          <h2>3. List the tables in a dataset</h2>
          <CodeBlock
            code='tables_df = client.query("
    SELECT table_name
    FROM `physionet-data.mimiciv_3_1_hosp.INFORMATION_SCHEMA.TABLES`
").to_dataframe()'
          />
          <h2>4. Load every table into a dictionary of DataFrames</h2>
          <p>
            This helper is reused in <code>MIMICIV_load.ipynb</code>. The
            optional <code>max_rows</code> guard is useful: the full MIMIC-IV
            hospital module is hundreds of millions of rows.
          </p>
          <CodeBlock
            code='def load_tables_dict(tables, client, dataset, max_rows=None):
    result = {}

    for table in tables:
        table_name = table
        print(f"Loading {table_name}...")

        query = f"SELECT * FROM `{dataset}.{table_name}`"
        if max_rows is not None:
            query += f" LIMIT {max_rows}"
        df = client.query(query).to_dataframe()

        result[table_name] = df

    return result'
          />
          <h2>5. Normalize dates</h2>
          <p>
            BigQuery returns <code>DATE</code> and <code>TIME</code> columns as
            the pandas <code>dbdate</code> and <code>dbtime</code> extension
            dtypes. Kumo's temporal graph builder expects real{" "}
            <code>datetime64</code>, so cast them up front.
          </p>
          <CodeBlock
            code="def preprocess_tables_dict(tables_dict):
    for table_name, df in tables_dict.items():
      dbdate_columns = df.dtypes[df.dtypes == 'dbdate'].index.tolist()
      dbtime_columns = df.dtypes[df.dtypes == 'dbtime'].index.tolist()
      for col in dbdate_columns:
        df[col] = pd.to_datetime(df[col])

      for col in dbtime_columns:
        df[col] = pd.to_datetime(df[col], format='%H:%M:%S').dt.time

    return tables_dict"
          />

          <h2>Project-specific SELECTs</h2>
          <p>
            For MIMIC-III we hand-write each <code>SELECT</code> instead of
            pulling whole tables — this renames columns to be Kumo-friendly (
            <code>icustay_id → stay_id</code>, <code>icd9_code → icd_code</code>
            ) and trims unused fields.
          </p>
          <CodeBlock
            code='`icustays_df = client.query("""
    SELECT subject_id, hadm_id, icustay_id AS stay_id, intime, outtime, los
    FROM \`physionet-data.mimiciii_clinical.icustays\`
""").to_dataframe()

patients_df = client.query("""
    SELECT subject_id, gender, dob
    FROM \`physionet-data.mimiciii_clinical.patients\`
""").to_dataframe()`'
          />

          <p>
            Once the data is in a <code>dict[str, pd.DataFrame]</code> with
            clean datetime columns, continue to{" "}
            <a href="/local-graph">Building a LocalGraph</a>.
          </p>
        </main>
      </div>
    </div>
  );
}

export default ConnectBigQuery;
