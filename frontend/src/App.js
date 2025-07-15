import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import ViewTransactions from "./pages/ViewTransactions";
import Navigation from "./components/Navigation";

function App() {
  return (
    <Router>
      <div className="p-4 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Fraud Detection System</h1>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddTransaction />} />
          <Route path="/transactions" element={<ViewTransactions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
