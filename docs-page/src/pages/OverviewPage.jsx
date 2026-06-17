import Sidebar from "../components/Sidebar";
import { Helmet } from "react-helmet-async";

function OverviewPage() {
  return (
    <div className="min-h-screen flex">
      <Helmet>
        <title>Kumo RFM Docs</title>
      </Helmet>
      <Sidebar></Sidebar>
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
          <div className="mb-2 text-xs font-mono uppercase tracking-widest text-primary">
            Documentation · v0.1
          </div>
          <h1>Kumo RFM — Field Documentation</h1>
          <p className="!text-lg !text-foreground/70 !leading-relaxed">
            A practical, notebook-driven guide to the{" "}
            <a href="https://kumo.ai" target="_blank" rel="noreferrer">
              Kumo
            </a>{" "}
            Relational Foundation Model (KumoRFM). It documents the exact
            patterns we used for a databases project: connecting to KumoRFM,
            pulling data from <strong>Google BigQuery</strong>, building a{" "}
            <code>LocalGraph</code>, and asking it questions with the{" "}
            <strong>PQL</strong> predictive query language.
          </p>
          <div className="callout">
            <strong>What's inside.</strong> Eight runnable Colab notebooks
            across an e-commerce dataset (Northwind, MovieLens) and four medical
            datasets (MIMIC-III, MIMIC-IV, eICU-CRD, ORCHID, ENCoDE), plus a PDF
            of the official Kumo RFM Playground for the e-commerce demo.
          </div>
          <h2>Start here</h2>
          <ul>
            <li>
              <a href="/getting-started">
                Install <code>kumoai</code> and initialize the SDK
              </a>{" "}
              with your API key.
            </li>
            <li>
              <a href="/connect-bigquery">Connect to BigQuery</a> and load
              tables from the PhysioNet public datasets.
            </li>
            <li>
              <a href="/local-graph">Build a LocalGraph</a> — declare primary
              keys, link foreign keys, visualize the ER diagram.
            </li>
            <li>
              <a href="/predictions">Ask predictive questions</a> with PQL:
              churn, freight forecast, mortality risk.
            </li>
          </ul>
          <h2>The companion PDF</h2>
          <p>
            The <a href="/playground">RFM Playground — E-commerce</a> page wraps
            the official Kumo PDF walkthrough that ships alongside this project.
            Use it as a guided tour of the playground UI before opening the
            notebooks.
          </p>
          <h2>Datasets covered</h2>
          <div className="not-prose grid sm:grid-cols-2 gap-3 my-6">
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                Northwind
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Classic relational e-commerce schema — first end-to-end test.
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                MovieLens 20M
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Large-scale stress test of the graph materializer.
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                MIMIC-III
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ICU clinical data — 48h mortality prediction.
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                MIMIC-IV
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Hospital + ICU module loading from BigQuery.
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                eICU-CRD
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Multi-center critical care database, static graph.
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                ORCHID
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                10-table temporal medical graph.
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="font-display font-semibold text-foreground">
                ENCoDE
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Sparse temporal graph spanning 80+ years.
              </div>
            </div>
          </div>
          <p className="!text-sm !text-muted-foreground">
            Source notebooks are downloadable from the{" "}
            <a href="/notebooks">Notebooks</a> page.
          </p>
        </main>
      </div>
    </div>
  );
}

export default OverviewPage;
