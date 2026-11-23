import { useState } from 'react';
import { useLenisScroll } from './hooks/useLenisScroll';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Solutions } from './components/Solutions';
import { Connect } from './components/Connect';
import { Agents } from './components/Agents';
import { Expertise } from './components/Expertise';
import { FeaturedVideo } from './components/FeaturedVideo';
import { Insights } from './components/Insights';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export function App() {
  const { scrollToTarget } = useLenisScroll();
  const [language, setLanguage] = useState('English');

  return (
    <div className="min-h-screen bg-[#EAE8E4] text-[#2D2D2D] selection:bg-[#2D2D2D] selection:text-[#EAE8E4]">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget('#main-content');
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#2D2D2D] focus:text-[#EAE8E4] focus:rounded-md"
      >
        Skip to content
      </a>

      <Header onNavigate={scrollToTarget} currentLanguage={language} />

      <main id="main-content">
        <Hero
          onConnectClick={() => scrollToTarget('#contact')}
          onScrollDownClick={() => scrollToTarget('#solutions')}
        />
        <Solutions onNavigateContact={() => scrollToTarget('#contact')} />
        <Connect onReachOut={() => scrollToTarget('#contact')} />
        <Agents onExploreMonksFlow={() => scrollToTarget('#contact')} />
        <Expertise onConnectClick={() => scrollToTarget('#contact')} />
        <FeaturedVideo />
        <Insights onConnectClick={() => scrollToTarget('#contact')} />
        <Contact />
      </main>

      <Footer
        onNavigate={scrollToTarget}
        currentLanguage={language}
        onLanguageChange={setLanguage}
      />
    </div>
  );
}

export default App;
