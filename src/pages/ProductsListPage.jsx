import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { productsData, categories } from '../data/products'

export default function ProductsListPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Products')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  const filteredProducts = selectedCategory === 'All Products'
    ? productsData
    : productsData.filter(product => product.category === selectedCategory)

  return (
    <div className="relative bg-white min-h-screen">
      <Navigation scrolled={scrolled} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-50 to-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="ornamental-line mx-auto mb-6" />
          <div className="inline-block mb-6">
            <span className="px-5 py-2 bg-white border border-stone-200 rounded-sm text-neutral-700 font-body text-xs tracking-widest uppercase font-medium shadow-sm">
              Complete Catalog
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-neutral-900 mb-6 leading-tight">
            Our <span className="italic">Products</span>
          </h1>
          <p className="text-lg text-neutral-600 font-body max-w-3xl mx-auto leading-relaxed mb-8">
            Explore our comprehensive range of premium precast concrete solutions.
            From pavers to drainage systems, we deliver excellence in every product.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-neutral-500 font-body">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{productsData.length}+ Products</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span>{categories.length - 1} Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-5 py-2.5 rounded-sm font-body text-sm font-medium whitespace-nowrap transition-all duration-300
                  ${selectedCategory === category
                    ? 'bg-black text-white shadow-md'
                    : 'bg-stone-50 text-neutral-700 border border-stone-200 hover:bg-stone-100'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Products Count */}
          <div className="mb-8">
            <p className="text-sm text-neutral-600 font-body">
              Showing <span className="font-semibold text-neutral-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== 'All Products' && (
                <span> in <span className="font-semibold text-neutral-900">{selectedCategory}</span></span>
              )}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="group premium-card overflow-hidden hover:elevated-shadow transition-all duration-500 transform hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-stone-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/e7e5e4/78716c?text=' + encodeURIComponent(product.title)
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-sm shadow-md">
                    <span className="text-neutral-700 font-body font-semibold text-xs tracking-wide">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">
                    {product.title}
                  </h3>

                  {/* Specifications */}
                  {(product.dimensions || product.thickness || product.type) && (
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-neutral-600 font-body">
                        {product.dimensions || product.thickness || product.type}
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-neutral-600 font-body leading-relaxed mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Features - Show first 2 */}
                  <div className="space-y-2 mb-4">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-neutral-600 font-body">
                        <svg className="w-4 h-4 text-neutral-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center space-x-2 text-neutral-700 font-body font-semibold text-sm group-hover:text-black transition-colors">
                    <span>View Details</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-stone-300/60" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                No products found
              </h3>
              <p className="text-neutral-600 font-body mb-6">
                Try selecting a different category
              </p>
              <button
                onClick={() => setSelectedCategory('All Products')}
                className="px-6 py-3 bg-black text-white font-body font-semibold rounded-sm hover:bg-neutral-800 transition-colors"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50 border-t border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <div className="ornamental-line mx-auto mb-8" />
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-neutral-600 font-body mb-8 leading-relaxed">
            We offer custom solutions tailored to your specific requirements.
            Get in touch with our team to discuss your project needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="/#contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white font-body font-semibold rounded-sm hover:bg-neutral-800 transition-all duration-300 shadow-md"
            >
              <span>Contact Us</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white border-2 border-stone-300 text-neutral-700 font-body font-semibold rounded-sm hover:border-black hover:text-black transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="ornamental-line mx-auto mb-4" />
            <p className="text-neutral-500 font-body text-sm">
              © 2026 DsineTiles. All rights reserved. Building the future with precision and elegance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
