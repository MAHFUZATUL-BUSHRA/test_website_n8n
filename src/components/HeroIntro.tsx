import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ENGINEER_PROFILE } from '../data/portfolioContext';
import { HERO_PORTRAIT } from '../data/portfolioMedia';
import { ResilientImage } from './ResilientImage';

export function HeroIntro() {
  return (
    <section id="intro" className="pt-12 md:pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <p className="text-sm font-medium text-zinc-500">
                {ENGINEER_PROFILE.title}
                <span aria-hidden="true" className="mx-2 text-zinc-300">
                  ·
                </span>
                {ENGINEER_PROFILE.location}
              </p>

              <h1
                className="font-display font-bold tracking-tight text-[#0A0B0D] leading-[1.06]"
                style={{
                  fontSize: 'clamp(2.25rem, 4.2vw, 3.65rem)',
                  textWrap: 'balance',
                }}
              >
                {ENGINEER_PROFILE.introHeadline}
              </h1>

              <div className="space-y-4 max-w-2xl text-[15px] md:text-base leading-relaxed text-zinc-600">
                <p>{ENGINEER_PROFILE.introLead}</p>
                <p>{ENGINEER_PROFILE.introBody}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
              >
                <span>Explore Projects</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-[#0A0B0D] hover:text-[#2563EB] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
              >
                <span>Get in touch</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="h-72 sm:h-96 lg:h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
              <ResilientImage
                src={HERO_PORTRAIT.src}
                alt={HERO_PORTRAIT.alt}
                title={ENGINEER_PROFILE.name}
                className="w-full h-full object-cover object-center"
                containerClassName="w-full h-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-zinc-200 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {ENGINEER_PROFILE.metrics.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-mono tabular-nums text-2xl md:text-3xl font-medium tracking-tight text-[#0A0B0D]">
                {metric.value}
              </p>
              <p className="text-xs md:text-sm text-zinc-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-14 border-y border-zinc-200/80 bg-white overflow-hidden py-3"
      >
        <div className="flex w-max animate-marquee whitespace-nowrap text-xs font-medium tracking-wide text-zinc-500">
          <span className="px-6">
            selected works · distributed systems · edge runtimes · real-time web · open source · technical writing
          </span>
          <span className="px-6">
            selected works · distributed systems · edge runtimes · real-time web · open source · technical writing
          </span>
          <span className="px-6">
            selected works · distributed systems · edge runtimes · real-time web · open source · technical writing
          </span>
          <span className="px-6">
            selected works · distributed systems · edge runtimes · real-time web · open source · technical writing
          </span>
        </div>
      </div>
    </section>
  );
}
