import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../pages/MainPage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import SearchPage from "../pages/SearchPage";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LibraryPage from "../pages/LibraryPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
