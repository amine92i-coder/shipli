import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import Home from './pages/Home';
import About from './pages/About';
import Solutions from './pages/Solutions';
import Calculator from './pages/Calculator';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import Blog from './pages/Blog';
import Gallery from './pages/Gallery';
import FaqPage from './pages/FaqPage';
import Careers from './pages/Careers';
import Start from './pages/Start';
import NotFound from './pages/NotFound';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);
  return null;
}

/** Everywhere except the sourcing form, where it would sit over the fields. */
function FloatingChat() {
  const { pathname } = useLocation();
  return pathname === '/start' ? null : <WhatsAppButton />;
}

export default function App() {
  return (
    <div className="grain relative min-h-svh overflow-x-clip">
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/start" element={<Start />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
