import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import HomePage from "./Pages/HomePage";
import SearchPage from "./Pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
