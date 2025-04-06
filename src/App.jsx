import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import TokenUsageChart from "./components/TokenUsageChart";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/chat/:chatId"
          element={<ChatPage />}
        />
        <Route
          path="/token-usage"
          element={<TokenUsageChart />}
        />
      </Routes>
    </Router>
  );
}

export default App;
