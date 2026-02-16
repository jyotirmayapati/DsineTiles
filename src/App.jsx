import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductDetailPage from './components/ProductDetailPage'

function App() {
  return (
    <div className="relative bg-white min-h-screen">
      {/* Content */}
      <div className="relative">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
