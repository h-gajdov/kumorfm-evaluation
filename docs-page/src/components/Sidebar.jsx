import { ThemeToggle } from "./ThemeToggle";
import logo from "../assets/logo.png";

const NAV_ITEMS = [
  // Introduction
  { href: "/", label: "Overview" },
  { href: "/getting-started", label: "Getting Started" },
  { href: "/playground", label: "RFM Playground (PDF)" },
  // Core Workflow
  { href: "/connect-bigquery", label: "Connect to BigQuery" },
  { href: "/local-graph", label: "Building a LocalGraph" },
  { href: "/predictions", label: "Predictions & PQL" },
  { href: "/limits", label: "Rate Limits & Tips" },
  // Example Notebooks
  { href: "/notebooks", label: "All Notebooks" },
  { href: "/notebooks/testing-kumo", label: "Northwind — Test Run" },
  { href: "/notebooks/mimiciii", label: "MIMIC-III" },
  { href: "/notebooks/mimiciv-load", label: "MIMIC-IV Load" },
  { href: "/notebooks/mimiciv-mortality", label: "MIMIC-IV Mortality" },
  {
    href: "/notebooks/mimiciv-mortality-extended",
    label: "MIMIC-IV Mortality Extended",
  },
  { href: "/notebooks/eicu", label: "eICU-CRD" },
  { href: "/notebooks/orchid", label: "ORCHID" },
  { href: "/notebooks/encode", label: "ENCoDE" },
];

function NavLink({ href, label, isActive }) {
  return (
    <li>
      <a
        href={href}
        className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
          isActive
            ? "bg-primary/15 text-white font-medium border-l-2 border-primary -ml-px"
            : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-white"
        }`}
        {...(isActive
          ? { "aria-current": "page", "data-status": "active" }
          : {})}
      >
        {label}
      </a>
    </li>
  );
}

const SECTIONS = [
  { heading: "Introduction", range: [0, 2] },
  { heading: "Core Workflow", range: [3, 6] },
  { heading: "Example Notebooks", range: [7, 15] },
];

function Sidebar({ activeIndex = 0 }) {
  return (
    <aside className="-translate-x-full lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border overflow-y-auto transition-transform">
      <div className="px-6 py-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <a className="flex items-center gap-2.5 active" href="/">
            <img src={logo} className="w-8 h-8"></img>
            {/* <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sidebar font-bold text-sm">
              K
            </div> */}
            <div>
              <div className="font-display font-semibold text-white text-base leading-tight">
                Kumo RFM
              </div>
              <div className="text-[11px] uppercase tracking-wider text-sidebar-foreground/60">
                Field Docs
              </div>
            </div>
          </a>
          <ThemeToggle />
        </div>
      </div>

      <nav className="px-3 py-5 space-y-6">
        {SECTIONS.map(({ heading, range: [start, end] }) => (
          <div key={heading}>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {heading}
            </div>
            <ul className="space-y-0.5">
              {NAV_ITEMS.slice(start, end + 1).map((item, offset) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={start + offset === activeIndex}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-6 py-4 mt-auto border-t border-sidebar-border text-[11px] text-sidebar-foreground/50">
        Unofficial documentation compiled from project notebooks.
      </div>
    </aside>
  );
}

export default Sidebar;
