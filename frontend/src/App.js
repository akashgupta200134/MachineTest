import { Routes, Route, Navigate } from "react-router-dom";
import CategoriesPage from "./pages/Categories";
import ProductsPage from "./pages/Product";
import NavbarPage from "./components/Navbar";

function App() {
  return (
    <>
      <NavbarPage />

      <Routes>
        <Route path="/" element={<Navigate to="/categories" />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </>
  );
}
export default App;
