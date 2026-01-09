// filepath: src/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Creem wrappers amb tipatge segur per al routing definit
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);