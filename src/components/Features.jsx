export default function Features() {
  const features = [
    {
      title: 'Advanced Manufacturing',
      description: 'State-of-the-art production facilities utilizing cutting-edge technology for precision and consistency.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      title: 'Quality Assurance',
      description: 'Rigorous testing and inspection protocols ensuring every product meets international standards.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Rapid Installation',
      description: 'Prefabricated components designed for quick assembly, reducing construction time and labor costs.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Sustainable Solutions',
      description: 'Eco-friendly manufacturing processes and recyclable materials supporting green construction initiatives.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Custom Engineering',
      description: 'Tailored solutions designed to meet specific project requirements and unique specifications.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Expert Installation',
      description: 'Professional installation services backed by experienced teams ensuring perfect execution.',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ]

  const benefits = [
    { value: '50%', label: 'Faster Installation' },
    { value: '30%', label: 'Cost Savings' },
    { value: '100%', label: 'Quality Control' },
    { value: '25yr+', label: 'Product Lifespan' },
  ]

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-electric-500/10 border border-electric-500/30 rounded-full text-electric-400 font-technical text-sm tracking-widest uppercase">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white mb-6">
            Engineered for <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-xl text-concrete-300 font-technical max-w-3xl mx-auto">
            Industry-leading capabilities backed by decades of expertise and innovation
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-electric-500 to-electric-600 rounded-lg flex items-center justify-center text-slate-950 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-gradient transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-concrete-300 font-technical leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Bar */}
        <div className="glass-effect rounded-2xl p-8 tech-border">
          <h3 className="text-2xl font-display font-bold text-center text-white mb-8">
            Measurable Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-display font-black text-gradient mb-2">
                  {benefit.value}
                </div>
                <div className="text-concrete-400 font-technical text-sm uppercase tracking-wide">
                  {benefit.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mt-20">
          <h3 className="text-3xl font-display font-bold text-center text-white mb-12">
            Our <span className="text-gradient">Process</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Consultation', desc: 'Understand your project needs' },
              { step: '02', title: 'Engineering', desc: 'Design custom solutions' },
              { step: '03', title: 'Manufacturing', desc: 'Precision production' },
              { step: '04', title: 'Installation', desc: 'Expert deployment' },
            ].map((phase, index) => (
              <div key={index} className="relative group">
                <div className="glass-effect rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-5xl font-display font-black text-electric-500/30 mb-2">
                    {phase.step}
                  </div>
                  <h4 className="text-xl font-display font-bold text-white mb-2 group-hover:text-gradient transition-all duration-300">
                    {phase.title}
                  </h4>
                  <p className="text-concrete-400 font-technical text-sm">
                    {phase.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-electric-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
