import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Create from "./pages/create";
import Visualize from "./pages/visualize";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/visualize" element={<Visualize />} />
    </Routes>
  );
}

export default App;
