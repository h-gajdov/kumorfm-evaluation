import { HashRouter, Routes, Route } from "react-router-dom";
import OverviewPage from "./pages/OverviewPage";
import GettingStartedPage from "./pages/GettingStartedPage";
import RFMPlaygroundPage from "./pages/RFMPlaygroundPage";
import ConnectBigQuery from "./pages/ConnectBigQueryPage";
import BuildingLocalGraphPage from "./pages/BuildingLocalGraphPage";
import PQLPage from "./pages/PQLPage";
import RateLimitsPage from "./pages/RateLimitsPage";
import AllNotebooksPage from "./pages/AllNotebooksPage";
import NotebookPage from "./pages/NotebookPage";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/playground" element={<RFMPlaygroundPage />} />
          <Route path="/connect-bigquery" element={<ConnectBigQuery />} />
          <Route path="/local-graph" element={<BuildingLocalGraphPage />} />
          <Route path="/predictions" element={<PQLPage />} />
          <Route path="/limits" element={<RateLimitsPage />} />
          <Route path="/notebooks" element={<AllNotebooksPage />} />
          <Route path="/notebooks/:slug" element={<NotebookPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
