import { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import type { PortfolioProject } from '../data/portfolioMedia';
import { ResilientImage } from './ResilientImage';

interface ProjectModalProps {
  project: PortfolioProject | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border border-zinc-200 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500 truncate">
              {project.category}
              <span aria-hidden="true" className="mx-2 text-zinc-300">
                ·
              </span>
              <span className="font-mono tabular-nums">{project.year}</span>
            </p>
            <h3
              id="project-modal-title"
              className="font-display text-xl font-bold tracking-tight text-[#0A0B0D] truncate"
            >
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-zinc-600 hover:text-[#0A0B0D] hover:bg-zinc-100 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
            <ResilientImage
              src={project.imageSrc}
              alt={project.imageAlt}
              title={project.title}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500">Technology Stack</p>
            <p className="font-mono text-sm text-[#0A0B0D]">
              {project.stack.join(' · ')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2 border-t border-zinc-200">
            <div className="space-y-2">
              <h4 className="font-display text-base font-semibold text-[#0A0B0D]">
                Engineering Challenge
              </h4>
              <p className="text-sm leading-relaxed text-zinc-600">
                {project.challenge}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-base font-semibold text-[#0A0B0D]">
                System Architecture
              </h4>
              <p className="text-sm leading-relaxed text-zinc-600">
                {project.architecture}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-zinc-200">
            <h4 className="font-display text-base font-semibold text-[#0A0B0D]">
              Measured Outcomes
            </h4>
            <ul className="space-y-2">
              {project.impact.map((item) => (
                <li
                  key={item}
                  className="text-sm text-zinc-700 flex items-start gap-3 tabular-nums"
                >
                  <span aria-hidden="true" className="text-[#2563EB] font-mono mt-0.5">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-zinc-200">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#0A0B0D] hover:bg-[#2563EB] rounded-lg transition-colors whitespace-nowrap"
            >
              <span>View Repository</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-[#0A0B0D] bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Architecture Notes</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
