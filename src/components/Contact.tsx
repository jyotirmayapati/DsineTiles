import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your inquiry! We will contact you soon.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone',
      details: '+91 7008049913',
      link: 'tel:+917008049913',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email',
      details: 'sunita4dsinetiles@gmail.com',
      link: 'mailto:sunita4dsinetiles@gmail.com',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Location',
      details: 'Baripada, Odisha, India',
      link: '#',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Hours',
      details: 'Open 24/7 - All Day',
      link: '#',
    },
  ]

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-6 py-3 bg-stone-50 border border-stone-200 rounded-sm text-neutral-700 font-body elegant-caps animate-fade-in">
              Get In Touch
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6 refined-heading text-depth animate-fade-up stagger-1">
            Start Your <span className="elegant-italic">Project Today</span>
          </h2>
          <p className="text-xl text-neutral-600 font-body max-w-3xl mx-auto elegant-body animate-fade-up stagger-2">
            Let's discuss how our precast solutions can bring your vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-stone-50 border border-stone-200 rounded-sm p-8 shadow-sm animate-slide-in-left stagger-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-700 font-body font-semibold mb-2 elegant-text">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm text-neutral-900 font-body focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-body font-semibold mb-2 elegant-text">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm text-neutral-900 font-body focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-700 font-body font-semibold mb-2 elegant-text">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm text-neutral-900 font-body focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 font-body font-semibold mb-2 elegant-text">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm text-neutral-900 font-body focus:outline-none focus:border-neutral-600 transition-colors"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-body font-semibold mb-2 elegant-text">
                  Project Type
                </label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm text-neutral-900 font-body focus:outline-none focus:border-neutral-600 transition-colors"
                >
                  <option value="">Select a product</option>
                  <option value="pavers">Precast Pavers</option>
                  <option value="udrains">U Drains</option>
                  <option value="culverts">Box Culverts</option>
                  <option value="walls">Retaining Walls</option>
                  <option value="custom">Custom Solution</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-body font-semibold mb-2 elegant-text">
                  Project Details *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-sm text-neutral-900 font-body focus:outline-none focus:border-neutral-600 transition-colors resize-none"
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black text-white font-body font-semibold text-lg rounded-sm hover:bg-neutral-900 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Send Message</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 animate-slide-in-right stagger-3">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  className="bg-white border border-stone-200 rounded-sm p-6 hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                >
                  <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center text-white mb-4 group-hover:bg-neutral-900 transition-all duration-300">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-display font-bold text-neutral-900 mb-2 elegant-text text-crisp">
                    {info.title}
                  </h3>
                  <p className="text-neutral-600 font-body elegant-body">
                    {info.details}
                  </p>
                </a>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-stone-50 border border-stone-200 rounded-sm p-6 h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-2 elegant-text text-crisp">
                  Visit Our Facility
                </h3>
                <p className="text-neutral-600 font-body elegant-body">
                  Schedule a tour to see our manufacturing process
                </p>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-white border border-stone-200 rounded-sm p-8 text-center shadow-sm">
              <h3 className="text-2xl font-display font-bold text-neutral-900 mb-4 elegant-text text-crisp">
                Need Immediate Assistance?
              </h3>
              <p className="text-neutral-600 font-body mb-6 elegant-body">
                Our team is ready to help with your project requirements
              </p>
              <a
                href="tel:+917008049913"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white font-body font-semibold rounded-sm hover:bg-neutral-900 transform hover:scale-105 transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
