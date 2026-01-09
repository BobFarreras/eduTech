// filepath: src/core/entities/challenge.entity.test.ts
import { describe, it, expect } from 'vitest';
// 1. IMPORT CORRECTE
import { Challenge, CodeFixContent } from './challenge.entity'; 

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
        description: 'Completa el hook', // 2. Nom Correcte
        initialCode: 'const [val, setVal] = ___(0);', // 3. Nom Correcte
        solution: 'useState', // 4. Nom Correcte
        tests: []
      } as CodeFixContent
    };

    // Act & Assert
    if (codeChallenge.type === 'CODE_FIX') {
        const content = codeChallenge.content as CodeFixContent;
        expect(content.initialCode).toContain('___'); // 5. Nom Correcte
        expect(content.solution).toBe('useState');
    } else {
        throw new Error('Type guard failed');
    }
  });
});