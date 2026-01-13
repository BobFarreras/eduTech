// filepath: src/presentation/components/icons/icon-library.tsx
import React from 'react';

type IconProps = { className?: string };

// --- ICONES EXISTENTS (Les teves) ---
export function SupabaseIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M11.5286 0.179546C11.8331 -0.0812412 12.2919 -0.0533377 12.5643 0.24243L23.6622 12.2932C23.9326 12.5868 23.8877 13.048 23.5614 13.2813L13.3359 20.5925L15.9762 23.1152C16.2584 23.3849 16.0599 23.8673 15.6692 23.8673H11.5286C11.2241 24.1281 10.7653 24.1002 10.4929 23.8044L-0.605008 11.7537C-0.875401 11.46 -0.830532 10.9989 -0.504224 10.7655L9.72131 3.45435L7.08095 0.931661C6.79877 0.661952 6.99727 0.179546 7.38795 0.179546H11.5286Z" fill="#3ECF8E" />
        </svg>
    );
}

export function ReactIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <circle cx="12" cy="12" r="2" fill="#61DAFB" />
            <g stroke="#61DAFB" strokeWidth="1.5" fill="none">
                <ellipse cx="12" cy="12" rx="10" ry="4" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
            </g>
        </svg>
    );
}

export function TypeScriptIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M2 0h20c1.1 0 2 0.9 2 2v20c0 1.1-0.9 2-2 2H2c-1.1 0-2-0.9-2-2V2c0-1.1 0.9-2 2-2zm13.5 17.9c1.3 0 2.2-0.7 2.6-1.7h-1.7c-0.2 0.4-0.5 0.6-0.9 0.6-0.7 0-1-0.6-1-1.7v-3.3h2.9v-1.4h-2.9v-2.1h-1.7v2.1h-1.6v1.4h1.6v3.5c0 1.6 0.9 2.5 2.7 2.5zm-6.7 0c1.5 0 2.6-0.8 2.8-2h-1.7c-0.2 0.5-0.6 0.8-1.1 0.8-0.8 0-1.2-0.6-1.2-1.6v-3.2h2.8v-1.4h-2.8v-2.1h-1.7v2.1h-1.6v1.4h1.6v3.5c0 1.7 1.1 2.5 2.9 2.5z" fill="#3178C6" />
        </svg>
    );
}

// --- NOVES ICONES PER ALS TOPICS ---

export function DockerIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M1.5 14.5h2v2h-2v-2zm3.5 0h2v2h-2v-2zm3.5 0h2v2h-2v-2zm-3.5-3.5h2v2h-2v-2zm3.5 0h2v2h-2v-2zm3.5 0h2v2h-2v-2zm-3.5-3.5h2v2h-2v-2zm12.91 3.25c-.53-.78-1.73-1.69-3.53-1.69-.37 0-.72.04-1.06.11V11h-2v9.88h12.55c.34-2.58-1.17-4.52-3.19-5.91-.76-.52-1.65-.89-2.77-.97z" fill="#2496ED" />
        </svg>
    );
}

export function PhpIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
             <ellipse cx="12" cy="12" rx="11" ry="11" fill="#777BB4" />
             <path d="M6 9h3c1 0 1.5.5 1.5 1.5S10 12 9 12H7v3H6V9zm4 0h1v6h-1V9zm3 0h3c1 0 1.5.5 1.5 1.5S17 12 16 12h-2v3h-1V9z" fill="white" />
        </svg>
    );
}

export function SecurityIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#EF4444" />
        </svg>
    );
}

export function OwaspIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
             <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2" />
             <path d="M12 2L4 6v5c0 5 3 9 8 10s8-5 8-10V6l-8-4z" fill="none" stroke="white" strokeWidth="1.5" />
             <path d="M12 8v8M8 12h8" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}