import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dasbor from "./components/Dasbor";
import HalamanAwal from "./components/HalamanAwal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HalamanAwal />} />
        <Route path="/dashboard" element={<Dasbor />} />
      </Routes>
    </Router>
  );
}

export default App;