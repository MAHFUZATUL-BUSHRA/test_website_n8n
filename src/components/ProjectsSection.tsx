import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, type PortfolioProject } from '../data/portfolioMedia';
import { ProjectModal } from './ProjectModal';
import { ResilientImage } from './ResilientImage';

type CategoryFilter = 'All Work' | PortfolioProject['category'];

const FILTER_OPTIONS: CategoryFilter[] = [
  'All Work',
  'Distributed Systems',
  'Developer Tooling',
  'Real-Time Web',
];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All Work');
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  const visibleProjects = useMemo(() => {
    if (activeCategory === 'All Work') return PROJECTS;
    return PROJECTS.filter((project) => project.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="projects" className="py-20 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <p className="text-sm font-medium text-[#2563EB]">Selected Projects</p>
            <h2
              className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[#0A0B0D]"
              style={{ textWrap: 'balance' }}
            >
              Systems engineered for scale, determinism, and speed.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Filter projects by discipline"
            className="flex flex-wrap items-center gap-1 p-1 bg-zinc-100 rounded-lg border border-zinc-200/80 self-start md:self-auto"
          >
            {FILTER_OPTIONS.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                    isActive
                      ? 'bg-white text-[#0A0B0D] shadow-xs'
                      : 'text-zinc-600 hover:text-[#0A0B0D]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleProjects.map((project, index) => {
            const isHeroSpan = activeCategory === 'All Work' && index === 0;
            return (
              <article
                key={project.id}
                className={`group bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-colors duration-150 hover:border-zinc-400 ${
                  isHeroSpan ? 'md:col-span-2 grid grid-cols-1 lg:grid-cols-12' : 'flex flex-col'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  aria-label={`Inspect ${project.title} case study`}
                  className={`block text-left overflow-hidden bg-zinc-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2563EB] ${
                    isHeroSpan ? 'lg:col-span-7 aspect-[4/3] lg:aspect-auto lg:h-full' : 'aspect-[4/3] w-full'
                  }`}
                >
                  <ResilientImage
                    src={project.imageSrc}
                    alt={project.imageAlt}
                    title={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    containerClassName="w-full h-full"
                  />
                </button>

                <div
                  className={`p-6 sm:p-8 flex flex-col justify-between gap-6 ${
                    isHeroSpan ? 'lg:col-span-5' : 'flex-1'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <span>{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{project.year}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{project.stack.slice(0, 3).join(', ')}</span>
                    </div>

                    <h3 className="font-display text-2xl font-bold tracking-tight text-[#0A0B0D]">
                      {project.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-zinc-600">
                      {project.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4">
                    <span className="font-mono tabular-nums text-xs text-zinc-500 truncate">
                      {project.impact[0]}
                    </span>

                    <button
                      type="button"
                      onClick={() => setSelectedProject(project)}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A0B0D] group-hover:text-[#2563EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                    >
                      <span>Case study</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
