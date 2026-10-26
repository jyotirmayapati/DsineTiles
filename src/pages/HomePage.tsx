import Navigation from '../components/Navigation'
import AssemblySection from '../components/assembly/AssemblySection'
import Catalogue from '../components/Catalogue'
import RailwayTeaser from '../components/RailwayTeaser'
import WhyPrecast from '../components/WhyPrecast'
import Process from '../components/Process'
import Calculator from '../components/Calculator'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <AssemblySection />
        <Catalogue />
        <RailwayTeaser />
        <WhyPrecast />
        <Process />
        <Calculator />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
