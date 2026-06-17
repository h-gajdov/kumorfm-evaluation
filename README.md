# KumoRFM Evaluation on Relational Databases

A practical, notebook-driven evaluation of **[KumoRFM](https://kumo.ai)**, Kumo AI's relational foundation model, run against a set of real relational databases — mostly clinical/medical data from PhysioNet, plus a couple of classic e-commerce schemas. The project documents how to connect KumoRFM to BigQuery, assemble a `LocalGraph` from arbitrary tables, and query it with **PQL** (Predictive Query Language) for classification, regression, and multi-horizon forecasting tasks — without any task-specific model training.

The full write-up (theory, methodology, and detailed results) is available in [`Paper.pdf`](./Paper.pdf). This README summarizes that paper and explains how to run the accompanying notebooks and documentation site.

## Repository structure

| Path               | Description                                                                                                                                                            |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Paper.docx`       | The full research paper: theoretical background on Relational Deep Learning, the KumoRFM / KumoRFM-2 architecture, PQL, and detailed results across all datasets.      |
| `notebooks/`       | Runnable Jupyter/Colab notebooks, one per dataset, each loading data from BigQuery, building a graph, and executing PQL queries.                                       |
| `docs-page/`       | A React + Vite documentation site that mirrors the notebooks and presents the methodology, setup steps, and results in a browsable format (Dockerized for deployment). |
| `playground-docs/` | PDF walkthroughs of the official Kumo AI Playground UI, demonstrated on the RelBench-F1 and e-commerce sample datasets.                                                |

## Background

Traditional machine learning on relational databases relies on manual feature engineering: data from related tables is aggregated or flattened into a single static table before training. This process is slow, error-prone, and tends to lose relational structure and subtle dependencies between entities, while also being vulnerable to data leakage.

**Relational Deep Learning (RDL)** instead represents a relational database directly as a heterogeneous, temporal graph: each row becomes a node, row attributes become node features, and foreign-key relationships become edges. KumoRFM builds on this idea with two main components:

- **Table-Agnostic Encoder** — serializes every cell as `(column name, value)` pairs and projects them into a shared latent space using a lightweight LLM and numerical encoders, so the model can interpret entirely new schemas without retraining.
- **Relational Graph Transformer** — an attention-based mechanism (rather than classic message-passing) that performs multi-hop reasoning across linked tables and learns which relations and rows matter most for a given task.

**KumoRFM-2** improves on this with 4-axis pretraining scaling (rows, columns, foreign keys, cross-sample) and early integration of the task definition into the encoder's first layers, rather than only at prediction time.

## Predictive Query Language (PQL)

PQL is a SQL-inspired, declarative language for defining predictive tasks directly over a relational graph, without separately engineering features or training tables. A query specifies three things at once:

- An **anchor entity** (e.g. a patient, a provider, a constructor) — the entity the prediction is made for.
- A **target expression** — an aggregation, filter, or condition over future events (`COUNT`, `SUM`, `AVG`, comparisons, etc.).
- A **prediction window** — `(relative_start, relative_end, time_unit)`, defining how far into the future the target is evaluated.

General syntax:

```sql
PREDICT <target_expression>
FOR EACH <entity>.<primary_key>
[WHERE <filter>]
```

Examples used in this evaluation:

```sql
-- Binary classification: will a patient die within 48 hours of an ICU stay?
PREDICT icustays.died_within_48h
FOR EACH icustays.stay_id

-- Regression: length of stay in the ICU
PREDICT icustays.los
FOR EACH icustays.stay_id
WHERE icustays.los IS NOT NULL

-- Multi-horizon forecasting: ICU visits per patient over the next 10 windows
PREDICT COUNT(icustays.*, 0, 365, days)
FORECAST 10 TIMEFRAMES
FOR EACH patients.subject_id
```

KumoRFM automatically parses the database schema, generates correctly time-aligned training examples for each query, and avoids leaking future information into the training context.

## Setup

Every notebook follows the same bootstrap:

```bash
pip install kumoai
```

```python
import os
import kumoai.experimental.rfm as rfm

os.environ["KUMO_API_KEY"] = "...your-token..."
rfm.init(api_key=os.environ["KUMO_API_KEY"])
```

Most datasets are pulled from public PhysioNet mirrors hosted on Google BigQuery, which requires authenticating once per session:

```bash
gcloud auth application-default login
```

From there, the workflow is always the same: assemble a dict of `pandas.DataFrame`s, wrap it in a `LocalGraph`, declare primary keys and foreign-key links, instantiate a `KumoRFM` model, and call `model.predict(query)` or `model.evaluate(query, metrics=[...])`.

```python
graph = rfm.LocalGraph.from_data({"customers": customers_df, "orders": orders_df})
model = rfm.KumoRFM(graph)
df = model.predict("PREDICT COUNT(orders.*, 0, 30, days) = 0 FOR EACH customers.customerID")
```

## Datasets & notebooks

| Notebook                           | Dataset                                | Task                                                                                               | Graph size                 | Type     |
| ---------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------- | -------- |
| `testing_kumo.ipynb`               | Northwind, MovieLens 20M               | First end-to-end test: churn classification, freight regression, concurrency probing               | —                          | —        |
| `MIMICIII.ipynb`                   | MIMIC-III (clinical/ICU)               | 48h mortality classification, length-of-stay regression, multi-horizon forecasting                 | 1.39M nodes / 5.44M edges  | Temporal |
| `MIMICIV_load.ipynb`               | MIMIC-IV (full hospital module)        | Generic bulk loader and graph builder                                                              | 10.79M nodes / 9.68M edges | Temporal |
| `MIMICIV_mortality.ipynb`          | MIMIC-IV (4-table subset)              | 48h mortality classification (minimal schema baseline)                                             | 9.96M nodes / 1.14M edges  | Temporal |
| `MIMICIV_mortality_extended.ipynb` | MIMIC-IV (7-table subset)              | Same task with richer context, largest graph in the project                                        | 27.6M nodes / 47.3M edges  | Temporal |
| `eICU_CRD.ipynb`                   | eICU Collaborative Research Database   | Discharge location, low blood-pressure flag, lab result prediction across multiple medical centers | 11.5M nodes / 23.1M edges  | Static   |
| `ORCHID.ipynb`                     | ORCHID (organ donation)                | OPO referral counts (7d / 30d), sepsis-risk lactate threshold                                      | 10.2M nodes / 9.0M edges   | Temporal |
| `ENCoDE.ipynb`                     | ENCoDE (skin-tone/oximetry correction) | Numeric regression on biological measurement values                                                | 1.14M nodes / 5.19M edges  | Temporal |

All notebooks are also available as Colab links from the `docs-page` site, and the RelBench-F1 / e-commerce Playground walkthroughs are in `playground-docs/` as PDFs.

## Key results

### MIMIC-III — 48h mortality classification

`PREDICT icustays.died_within_48h FOR EACH icustays.stay_id`

| ACC    | F1     | MRR    | Precision | Recall |
| ------ | ------ | ------ | --------- | ------ |
| 0.9775 | 0.7356 | 0.9888 | 0.9269    | 0.6659 |

High accuracy and precision, but recall is comparatively low — the model misses a meaningful share of true high-risk cases.

### MIMIC-III — ICU length of stay (regression)

`PREDICT icustays.los FOR EACH icustays.stay_id WHERE icustays.los IS NOT NULL`

| MAE    | MAPE   | MSE   | R²     | RMSE   | SMAPE  |
| ------ | ------ | ----- | ------ | ------ | ------ |
| 3.4469 | 2.2446 | 82.21 | 0.3684 | 9.0669 | 0.6143 |

Moderate fit: R² ≈ 0.37 means the model explains roughly a third of the variance in length of stay.

### MIMIC-IV — 48h mortality classification & length of stay

| ACC    | F1     | MRR    | Precision | Recall |
| ------ | ------ | ------ | --------- | ------ |
| 0.9645 | 0.7675 | 0.9825 | 0.8159    | 0.7331 |

| MAE    | MAPE   | MSE   | R²      | RMSE   | SMAPE  |
| ------ | ------ | ----- | ------- | ------ | ------ |
| 2.4341 | 0.9994 | 30.47 | -0.0760 | 5.5200 | 0.6495 |

Classification accuracy is lower than on MIMIC-III, while length-of-stay regression performs worse (negative R²). The likely cause is that the MIMIC-III graph included more linked tables, giving the model richer relational signal to learn from.

### MIMIC-IV — patient age regression

`PREDICT patients.anchor_age FOR EACH patients.subject_id WHERE patients.anchor_age IS NOT NULL`

| MAE    | MAPE   | MSE    | R²      | RMSE   | SMAPE  |
| ------ | ------ | ------ | ------- | ------ | ------ |
| 13.575 | 0.2714 | 284.79 | -0.0425 | 16.876 | 0.2279 |

Results are not satisfactory — this task needs more relational context (additional linked tables) to perform well.

### eICU-CRD, ORCHID, ENCoDE (qualitative)

- **eICU-CRD**: stable, low-variance metrics across discharge-location and lab-result tasks. The Table-Agnostic Encoder handles cross-hospital differences in procedure coding well, since text and numeric attributes are unified before graph propagation.
- **ORCHID**: the model learns hospital/OPO relational structure and historical referral trends well for the 7-day and 30-day OPO referral regressions. The sepsis-risk classification task (lactate > 4 within 24h) underperforms due to extreme event sparsity in the underlying data — the model defaults to predicting 0 for nearly all entities.
- **ENCoDE**: stable latent representations for the regression task despite very high column-level dimensionality and a long (1990–2073), sparse temporal window.

## Documentation site (`docs-page`)

A small React + Vite + Tailwind site that presents the methodology, setup guide, and per-notebook breakdowns (including the graph statistics above) in a browsable format.

```bash
cd docs-page
npm install
npm run dev      # local development server
npm run build    # production build
```

It also ships with a `Dockerfile` for containerized deployment behind nginx:

```bash
cd docs-page
docker build -t kumorfm-docs .
docker run -p 8080:80 kumorfm-docs
```

## Free-tier limitations

This evaluation was carried out on the free tier of KumoRFM, which imposes the following constraints:

- Maximum of 1,000 API calls.
- Running several consecutive `PREDICT` queries can trigger an `"Only one live display may be active at once"` error.
- Maximum of 15 tables per graph.

Official platform limits for reference (SaaS vs. Snowflake Native vs. Databricks Native):

|                        | SaaS       | Snowflake Native | Databricks Native |
| ---------------------- | ---------- | ---------------- | ----------------- |
| Rows per table         | 15 Billion | 1 Billion        | 10 Billion        |
| Columns per table      | 2,000      | 100              | 2,000             |
| Table size             | 2 TB       | 100 GB           | 2 TB              |
| Row size               | 10 KB      | 10 KB            | 10 KB             |
| Tables per graph       | 12         | 12               | 12                |
| Rows per graph         | 30 Billion | 1 Billion        | 30 Billion        |
| Graph size             | 2 TB       | 200 GB           | 2 TB              |
| Edges per graph        | 30 Billion | 4 Billion        | 30 Billion        |
| Parallel job execution | 10         | 1                | 10                |

## Conclusion

Across MIMIC-III, MIMIC-IV, eICU-CRD, ORCHID, and ENCoDE, KumoRFM consistently learns global trends and local structural patterns directly from relational schemas, without manual feature engineering or task-specific training. KumoRFM-2's early integration of task context into the encoder helps maintain classification precision and lower regression error. The clearest limitation observed is performance degradation on tasks with sparse target events or insufficient relational context (fewer linked tables), which points to richer schema linkage as the main lever for further accuracy gains.

## References

- [kumo.ai](https://kumo.ai)
- [KumoRFM overview docs](https://kumo.ai/docs/rfm/overview/)
- [KumoRFM-2: Scaling Foundation Models for Relational Learning (PDF)](https://kumo.ai/kumoRFM-2-scaling-foundation-models-for-relational-learning.pdf)
- [Kumo AI Research](https://kumo.ai/research/)
- [RelBench](https://relbench.stanford.edu/)
- [MIMIC-III](https://physionet.org/content/mimiciii/) · [MIMIC-IV](https://physionet.org/content/mimiciv/) · [eICU-CRD](https://physionet.org/content/eicu-crd/2.0/) · [ENCoDE](https://physionet.org/content/encode-skin-color/1.0.0/) · [ORCHID](https://physionet.org/content/orchid/2.1.1/)
- [Northwind sample database (Neo4j mirror)](https://github.com/neo4j-contrib/northwind-neo4j)
- [MovieLens 20M dataset](https://www.kaggle.com/datasets/grouplens/movielens-20m-dataset)
- [Google BigQuery](https://cloud.google.com/bigquery)

## Author

**Christijan Gajdov**, documentation [page](https://kumo-docs-production.up.railway.app).
