import { BrowserRouter, Routes, Route } from "react-router-dom";
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
      <BrowserRouter>
        <Routes>
          <Route path="/kumorfm-evaluation" element={<OverviewPage />} />
          <Route
            path="/kumorfm-evaluation/getting-started"
            element={<GettingStartedPage />}
          />
          <Route
            path="/kumorfm-evaluation/playground"
            element={<RFMPlaygroundPage />}
          />
          <Route
            path="/kumorfm-evaluation/connect-bigquery"
            element={<ConnectBigQuery />}
          />
          <Route
            path="/kumorfm-evaluation/local-graph"
            element={<BuildingLocalGraphPage />}
          />
          <Route path="/kumorfm-evaluation/predictions" element={<PQLPage />} />
          <Route
            path="/kumorfm-evaluation/limits"
            element={<RateLimitsPage />}
          />
          <Route
            path="/kumorfm-evaluation/notebooks"
            element={<AllNotebooksPage />}
          />
          <Route
            path="/kumorfm-evaluation/notebooks/:slug"
            element={<NotebookPage />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
