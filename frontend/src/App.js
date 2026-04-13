// App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Categories from './pages/Categories';
import ProductsPage from './pages/Product';
import './index.css';
import NavbarPage from './components/Navbar';

export default function App() {
  return (
    <>
      <NavbarPage />
      <Routes>
        <Route path="/" element={<Navigate to="/categories" replace />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products"   element={<ProductsPage />} />
      </Routes>
    </>
  );
}