// filepath: src/infrastructure/mappers/__tests__/TerminalMapper.test.ts
import { describe, it, expect } from 'vitest';
import { ChallengeMapperFactory } from '../challenge.mappers';
import { TerminalContent } from '@/core/entities/challenges/challenge.entity';

describe('TerminalMapper', () => {
    const mapper = ChallengeMapperFactory.getMapper('TERMINAL');

    it('hauria de mapejar un JSON complet correctament al català', () => {
        const rawData = {
            instruction: { ca: 'Fes això', en: 'Do this' },
            initialCommand: 'docker',
            validCommands: ['docker ps', 'docker ls'],
            hint: { ca: 'Pista', en: 'Hint' },
            explanation: { ca: 'Explicació', en: 'Expl' },
            outputParams: { success: 'Ok', error: 'Fail' }
        };

        const result = mapper.map(rawData, 'ca') as TerminalContent;

        expect(result).toEqual({
            instruction: 'Fes això',
            initialCommand: 'docker',
            validCommands: ['docker ps', 'docker ls'],
            hint: 'Pista',
            explanation: 'Explicació',
            outputParams: { success: 'Ok', error: 'Fail' }
        });
    });

    it('hauria de fer fallback a langlès o valors per defecte si falta traducció', () => {
        const rawData = {
            instruction: { en: 'Do this' }, // No hi ha 'ca'
            
            // CORRECCIÓ: Posem comandes reals. Si posem null, el mapper retornarà [], no 2.
            // Volem provar que SI hi ha comandes, es mantenen encara que falti la traducció.
            validCommands: ['ls -la', 'ls -l -a'], 
            
            outputParams: {}
        };

        const result = mapper.map(rawData, 'ca') as TerminalContent;

        // Ara sí que té sentit esperar 2 comandes
        expect(result.validCommands).toHaveLength(2); 
        expect(result.instruction).toBe('Do this'); // Fallback a anglès
        expect(result.validCommands[0]).toBe('ls -la');
    });

    it('hauria de gestionar inputs corruptes sense llançar excepció', () => {
        const rawCorrupt = "Això no és un objecte";
        const result = mapper.map(rawCorrupt, 'ca');
        expect(result).toBeDefined();
        expect(result).toHaveProperty('instruction');
    });
});