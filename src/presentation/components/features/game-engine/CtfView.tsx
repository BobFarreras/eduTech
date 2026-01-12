// filepath: src/presentation/components/features/game-engine/CtfView.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Challenge } from '@/core/entities/challenges/challenge.entity';
import { CtfContent, VirtualFile } from '@/core/entities/challenges/definitions/ctf.content';
import { Terminal, Flag, CheckCircle, Lock } from 'lucide-react';
import { useLocale } from 'next-intl';
import { LocalizedText } from '@/core/entities/challenges/definitions/theory.content';
interface CtfViewProps {
    challenge: Challenge;
    onNext: (isCorrect: boolean) => void;
}

export function CtfView({ challenge, onNext }: CtfViewProps) {
    const content = challenge.content as CtfContent;
    const locale = useLocale() as 'ca' | 'es' | 'en';

    // ESTAT DEL JOC
    const [history, setHistory] = useState<string[]>(['Initializing Kali Linux Environment...', 'Connected to Target.']);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState<VirtualFile[]>(content.initialFileSystem);
    const [capturedFlags, setCapturedFlags] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Helper per textos
    // ✅ SOLUCIÓ: Tipar l'entrada. Acceptem undefined per seguretat.
    const getText = (obj: LocalizedText | undefined): string => {
        if (!obj) return '';
        return obj[locale] || obj['ca'] || '';
    };

    // Auto-scroll terminal
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Comprovar victòria
    useEffect(() => {
        if (capturedFlags.length === content.flags.length) {
            setTimeout(() => onNext(true), 2000); // Victòria automàtica al tenir totes les flags
        }
    }, [capturedFlags, content.flags.length, onNext]);

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const cmd = input.trim();
        const newHistory = [...history, `root@kali:~# ${cmd}`];

        // 1. COMANDES BÀSIQUES SIMULADES
        if (cmd === 'ls') {
            const fileList = files.map(f => f.name).join('  ');
            newHistory.push(fileList || '(empty directory)');
        }
        else if (cmd.startsWith('cat ')) {
            const fileName = cmd.split(' ')[1];
            const file = files.find(f => f.name === fileName);
            if (file) {
                newHistory.push(file.content);
                // Detectar si el contingut és una flag (format flag{...})
                if (file.content.includes('flag{')) {
                    const match = file.content.match(/flag\{([^}]+)\}/);
                    if (match) verifyFlag(match[0]);
                }
            } else {
                newHistory.push(`cat: ${fileName}: No such file or directory`);
            }
        }
        else if (cmd === 'clear') {
            setHistory([]);
            setInput('');
            return;
        }
        // 2. COMANDES DE GUIÓ (STORYLINE)
        else {
            // Busquem si la comanda encaixa amb alguna del JSON
            const validCmd = content.validCommands.find(c => new RegExp(c.commandRegex).test(cmd));

            if (validCmd) {
                newHistory.push(validCmd.output);

                // Desbloquejar fitxer si cal
                if (validCmd.unlocksFile) {
                    const [name, content] = validCmd.unlocksFile.split('::'); // Format "nom::contingut"
                    if (!files.find(f => f.name === name)) {
                        setFiles(prev => [...prev, { name, content }]);
                        newHistory.push(`[SYSTEM] New file created: ${name}`);
                    }
                }
            } else {
                newHistory.push(`bash: ${cmd.split(' ')[0]}: command not found`);
            }
        }

        setHistory(newHistory);
        setInput('');
    };

    const verifyFlag = (secret: string) => {
        const flag = content.flags.find(f => f.secret === secret);
        if (flag && !capturedFlags.includes(flag.id)) {
            setCapturedFlags(prev => [...prev, flag.id]);
            setHistory(prev => [...prev, `🎉 CAPTURED FLAG: ${secret}`]);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-150 w-full max-w-6xl mx-auto bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">

            {/* SIDEBAR (Missions) */}
            <div className="w-full md:w-1/4 bg-slate-900 p-4 border-r border-slate-800 flex flex-col gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-500" />
                        CTF MISSION
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Operation: {getText(content.missionTitle)}</p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded text-sm text-slate-300">
                    {getText(content.missionBriefing)}
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase">Flags to Capture</h3>
                    {content.flags.map(flag => {
                        const isCaptured = capturedFlags.includes(flag.id);
                        return (
                            <div key={flag.id} className={`p-3 rounded border transition-all ${isCaptured ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-900 border-slate-700'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`font-mono text-sm ${isCaptured ? 'text-emerald-400' : 'text-slate-400'}`}>
                                        {getText(flag.name)}
                                    </span>
                                    {isCaptured ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Flag className="w-4 h-4 text-slate-600" />}
                                </div>
                                <div className="text-xs text-slate-500 mt-1">{getText(flag.description)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* TERMINAL AREA */}
            <div className="flex-1 flex flex-col bg-black font-mono text-sm">

                {/* Terminal Header */}
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                    <Terminal className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-400">root@kali: ~</span>
                </div>

                {/* Terminal Output */}
                <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-1 text-green-400">
                    {history.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap wrap-break-word">{line}</div>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleCommand} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                    <span className="text-green-500 font-bold">root@kali:~#</span>
                    <input
                        autoFocus
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                        placeholder="type command..."
                    />
                </form>
            </div>

        </div>
    );
}