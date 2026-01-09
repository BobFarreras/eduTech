// filepath: src/presentation/utils/icon-mapper.tsx
import { 
  Code2, 
  Database, 
  Server, 
  Globe, 
  Cpu, 
  Terminal,
  ShieldCheck,
  Atom,
  Container,
  Layers,
  LucideIcon 
} from 'lucide-react';

// Mapa de claus (string BD) -> Components (Lucide)
const ICON_MAP: Record<string, LucideIcon> = {
  'code': Code2,
  'database': Database,
  'server': Server,
  'web': Globe,
  'algo': Cpu,
  'terminal': Terminal,
  
  // Nous temes
  'brand-react': Atom,
  'security': ShieldCheck,
  'docker': Container,
  'fullstack': Layers,
  
  // Fallback
  'default': Code2 
};

/**
 * Retorna directament el JSX de la icona.
 * Així al component només has de fer: {getTopicIcon(nom, classes)}
 */
export const getTopicIcon = (iconName: string, className?: string) => {
  const IconComponent = ICON_MAP[iconName] || ICON_MAP['default'];
  return <IconComponent className={className} />;
};