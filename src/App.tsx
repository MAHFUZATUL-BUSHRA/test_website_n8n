import { useState } from 'react';
import { ContactSection } from './components/ContactSection';
import { HeroIntro } from './components/HeroIntro';
import { Navbar } from './components/Navbar';
import { PortfolioChatbot } from './components/PortfolioChatbot';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ENGINEER_PROFILE } from './data/portfolioContext';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0A0B0D]">
      <Navbar onOpenChat={() => setChatOpen(true)} />

      <main className="flex-1">
        <HeroIntro />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection onOpenChat={() => setChatOpen(true)} />
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} {ENGINEER_PROFILE.name}
            <span aria-hidden="true" className="mx-2 text-zinc-300">
              ·
            </span>
            {ENGINEER_PROFILE.location}
          </p>
          <div className="flex items-center gap-6">
            <a href="#intro" className="hover:text-[#0A0B0D] transition-colors">
              Intro
            </a>
            <a href="#projects" className="hover:text-[#0A0B0D] transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-[#0A0B0D] transition-colors">
              Skills
            </a>
            <a href="#contact" className="hover:text-[#0A0B0D] transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>

      <PortfolioChatbot
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
