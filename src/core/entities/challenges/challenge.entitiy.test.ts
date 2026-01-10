// filepath: src/core/entities/challenges/challenge.entity.test.ts
import { describe, it, expect } from 'vitest';

// ✅ CORRECCIÓ 1: Importem des del './index' (Barrel File)
// Aquest fitxer agrupa totes les exportacions de la carpeta 'challenges'
import { Challenge, CodeFixContent } from './index'; 

describe('Challenge Entity Polymorphism', () => {
  
  it('should correctly type a CODE_FIX challenge', () => {
    // Arrange
    const codeChallenge: Challenge = {
      id: '1',
      topicId: 'react',
      difficultyTier: 1,
      type: 'CODE_FIX',
      createdAt: new Date(),
      content: {
        description: 'Completa el hook',
        initialCode: 'const [val, setVal] = ___(0);',
        solution: 'useState',
        tests: [],
        // ✅ CORRECCIÓ 2: Afegim camps obligatoris definits a la interfície
        hint: 'Pensa en el hook d\'estat',
        options: [] 
      } as CodeFixContent
    };

    // Act & Assert
    if (codeChallenge.type === 'CODE_FIX') {
        // TypeScript ara sap segur que és CodeFixContent gràcies a l'import correcte
        const content = codeChallenge.content as CodeFixContent;
        
        expect(content.initialCode).toContain('___');
        expect(content.solution).toBe('useState');
    } else {
        throw new Error('Type guard failed');
    }
  });
});