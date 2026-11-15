import heroPortrait from '../assets/images/hero_engineer_portrait_1794736689888.jpg';
import kestrelImage from '../assets/images/project_distributed_kv_1794736690119.jpg';
import meridianImage from '../assets/images/project_edge_compiler_1794736690502.jpg';
import atelierImage from '../assets/images/project_realtime_canvas_1794736691044.jpg';
import pulseImage from '../assets/images/project_observability_mesh_1794736691254.jpg';
import { PROJECTS_META, type PortfolioProjectMeta } from './portfolioContext';

export interface PortfolioProject extends PortfolioProjectMeta {
  imageSrc: string;
  imageAlt: string;
}

const IMAGE_MAP: Record<string, { src: string; alt: string }> = {
  'kestrel-kv': {
    src: kestrelImage,
    alt: 'Brushed anodized aluminum server modules with fiber optic patch cables for Kestrel KV',
  },
  'meridian-edge-ir': {
    src: meridianImage,
    alt: 'Minimalist slate desk with architectural system diagram and precision dial for Meridian Edge Compiler',
  },
  'atelier-crdt-canvas': {
    src: atelierImage,
    alt: 'Minimalist glass display on travertine stone showing geometric vector grids for Atelier Spatial Canvas',
  },
  'pulse-ebpf-tracer': {
    src: pulseImage,
    alt: 'Dark glass instrument screen displaying monochrome acoustic and latency waveforms for Pulse eBPF Tracer',
  },
};

export const HERO_PORTRAIT = {
  src: heroPortrait,
  alt: 'Clara Vance working at a minimalist oak desk beside an industrial window',
};

export const PROJECTS: PortfolioProject[] = PROJECTS_META.map((project) => ({
  ...project,
  imageSrc: IMAGE_MAP[project.id]?.src ?? '',
  imageAlt: IMAGE_MAP[project.id]?.alt ?? project.title,
}));
