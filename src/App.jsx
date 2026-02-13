import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductDetailPage from './components/ProductDetailPage'

function App() {
  return (
    <div className="relative bg-slate-950">
      {/* Animated background grid */}
      <div className="fixed inset-0 blueprint-line opacity-20 pointer-events-none" />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
