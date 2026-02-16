import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductsListPage from './pages/ProductsListPage'
import ProductDetailPage from './components/ProductDetailPage'

function App() {
  return (
    <div className="relative bg-white min-h-screen">
      {/* Content */}
      <div className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
