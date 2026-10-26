import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsListPage from './pages/ProductsListPage'
import RailwaysPage from './pages/RailwaysPage'
import ProductDetailPage from './components/ProductDetailPage'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/railways" element={<RailwaysPage />} />
      </Routes>
    </div>
  )
}

export default App
