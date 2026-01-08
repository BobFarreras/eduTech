// filepath: src/presentation/utils/icon-mapper.tsx
import { 
  Code2, 
  Database, 
  Server, 
  Globe, 
  Cpu, 
  Terminal, 
  LucideIcon 
} from 'lucide-react';

/**
 * Mapa d'icones disponibles per als temes.
 * La clau ha de coincidir amb el camp 'icon_name' de la BD.
 */
const ICON_MAP: Record<string, LucideIcon> = {
  'code': Code2,
  'database': Database,
  'server': Server,
  'web': Globe,
  'algo': Cpu,
  'terminal': Terminal,
  // Fallback per defecte
  'default': Code2 
};

export const getTopicIcon = (iconName: string): LucideIcon => {
  return ICON_MAP[iconName] || ICON_MAP['default'];
};