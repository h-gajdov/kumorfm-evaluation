export const notebooks = [
  {
    slug: "testing-kumo",
    file: "testing_kumo.ipynb",
    title: "Northwind & MovieLens — first test run",
    shortTitle: "Northwind — Test Run",
    blurb:
      "Self-contained walkthrough: install kumoai, load the Northwind CSVs, build a LocalGraph, and run churn / freight / workload predictions. Also includes a free-tier rate-limit probe and a MovieLens 20M scale test.",
    bullets: [
      "PREDICT COUNT(orders.*, 0, 30, days) = 0 — customer churn classifier.",
      "PREDICT SUM(orders.freight, 0, 90, days) — freight forecast regression.",
      "ThreadPoolExecutor experiment to test concurrent predictions.",
      "MovieLens 20M as a large-graph stress test.",
    ],
    activeIndex: 8,
    collabUrl: 'https://colab.research.google.com/drive/1_MfZlU6xUzOoBgtOSShXxzRsrNdZSu0T?usp=sharing'
  },
  {
    slug: "mimiciii",
    file: "MIMICIII.ipynb",
    title: "MIMIC-III clinical — 48h mortality",
    shortTitle: "MIMIC-III",
    blurb:
      "Pulls patients, admissions, ICU stays, diagnoses, procedures, transfers and services from the PhysioNet mirror, normalizes timestamps, then trains a 48-hour mortality classifier on ICU stays.",
    bullets: [
      "Hand-written SELECTs that rename icustay_id → stay_id and icd9_code → icd_code.",
      "Derives died_within_48h as a binary target on icustays.",
      "Shifts coincident timestamps by 1s to keep the temporal axis intact.",
    ],
    graph: { nodes: "1,393,410", edges: "5,444,954", time: "0.80s", type: "Temporal" },
    activeIndex: 9,
    collabUrl: 'https://colab.research.google.com/drive/1_nU1lx_wz_pAgg_Jqz-vCEumtqg-cMaA?usp=sharing'
  },
  {
    slug: "mimiciv-load",
    file: "MIMICIV_load.ipynb",
    title: "MIMIC-IV — bulk hospital module load",
    shortTitle: "MIMIC-IV Load",
    blurb:
      "Generic loader for the full mimiciv_3_1_hosp dataset: lists tables from INFORMATION_SCHEMA, pulls each one (with a row cap), preprocesses dates, and assembles a LocalGraph with manually-declared primary keys.",
    bullets: [
      "Reusable load_tables_dict / preprocess_tables_dict / transform_to_rfm_table helpers.",
      "Declares primary keys for d_icd_diagnoses, d_icd_procedures, d_labitems.",
      "Visualizes the ER diagram before defining manual links.",
    ],
    graph: { nodes: "10,790,354", edges: "9,679,878", time: "8.82s", type: "Temporal" },
    activeIndex: 10,
    collabUrl: 'https://colab.research.google.com/drive/1LOEwH3Wre2vqYql8BaryP2aBg2lpExfm?usp=sharing'
  },
  {
    slug: "mimiciv-mortality",
    file: "MIMICIV_mortality.ipynb",
    title: "MIMIC-IV — mortality (4 tables)",
    shortTitle: "MIMIC-IV Mortality",
    blurb:
      "Minimal MIMIC-IV mortality setup using only the four core tables required to express the prediction. Useful baseline before scaling to the extended version.",
    bullets: [
      "Smaller schema → faster materialization, easier debugging.",
      "Same PQL pattern as MIMIC-III mortality.",
    ],
    graph: { nodes: "9,963,622", edges: "1,141,182", time: "6.14s", type: "Temporal" },
    activeIndex: 11,
    collabUrl: 'https://drive.google.com/file/d/1G3QA3NyloZyGu4hmxFzVRlMbnWBF2HuG/view?usp=sharing'
  },
  {
    slug: "mimiciv-mortality-extended",
    file: "MIMICIV_mortality_extended.ipynb",
    title: "MIMIC-IV — mortality (extended)",
    shortTitle: "MIMIC-IV Mortality (Extended)",
    blurb:
      "Same prediction task as the base MIMIC-IV mortality notebook, but with seven tables wired into the graph. Demonstrates how added context tables affect graph size and predict latency.",
    bullets: [
      "27.6M nodes / 47.3M edges — the largest graph in the project.",
      "Shows trade-off between richer context and 27s materialization time.",
    ],
    graph: { nodes: "27,635,918", edges: "47,278,352", time: "27.70s", type: "Temporal" },
    activeIndex: 12,
    collabUrl: 'https://colab.research.google.com/drive/13ODZ66LAwMd8332GGLmX-krNHBnMfnl1?usp=sharing'
  },
  {
    slug: "eicu",
    file: "eICU_CRD.ipynb",
    title: "eICU-CRD — multi-center static graph",
    shortTitle: "eICU-CRD",
    blurb:
      "Loads the eICU Collaborative Research Database from BigQuery. Unlike the MIMIC notebooks, the graph is identified as static (no temporal axis), which limits queries to non-windowed aggregations.",
    bullets: [
      "9 tables, 11.5M nodes, 23M edges.",
      "Demonstrates Kumo's behaviour on a static graph.",
    ],
    graph: { nodes: "11,543,467", edges: "23,066,538", time: "10.17s", type: "Static" },
    activeIndex: 13,
    collabUrl: 'https://colab.research.google.com/drive/1HsCgu3NrEwmzj96CclO83bUQJ62RHCnA?usp=sharing'
  },
  {
    slug: "orchid",
    file: "ORCHID.ipynb",
    title: "ORCHID — 10-table temporal graph",
    shortTitle: "ORCHID",
    blurb:
      "Builds a 10-table temporal medical graph spanning ten years (2028–2038 in synthetic time). Good reference for a moderately complex schema that materializes cleanly without manual fixes.",
    bullets: [
      "Auto-inferred schema across 10 tables.",
      "Temporal window: 2028-01-01 → 2038-06-01.",
    ],
    graph: { nodes: "10,248,702", edges: "9,032,302", time: "9.14s", type: "Temporal" },
    activeIndex: 14,
    collabUrl: 'https://colab.research.google.com/drive/1WPlCiMstSpZUQt6SQJqv_eNmO3IjGR7k?usp=sharing'
  },
  {
    slug: "encode",
    file: "ENCoDE.ipynb",
    title: "ENCoDE — sparse, very-long-window graph",
    shortTitle: "ENCoDE",
    blurb:
      "Smaller node count but a temporal window stretching from 1990 to 2073. A useful case study for how Kumo handles long sparse timelines.",
    bullets: [
      "Only ~1.1M nodes but 5.2M edges.",
      "83-year temporal window.",
    ],
    graph: { nodes: "1,141,573", edges: "5,188,918", time: "5.28s", type: "Temporal" },
    activeIndex: 15,
    collabUrl: 'https://colab.research.google.com/drive/1w0656cgtx74q2VJBDQNJy_EmCX9OHz3P?usp=sharing'
  },
];

export const bySlug = Object.fromEntries(notebooks.map((n) => [n.slug, n]));
