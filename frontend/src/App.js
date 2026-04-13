import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Categories from './pages/Categories';
import Products from './pages/Products';
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      <Routes>
        <Route path="/"           element={<Navigate to="/categories" replace />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products"   element={<Products />} />
      </Routes>
    </div>
  );
}