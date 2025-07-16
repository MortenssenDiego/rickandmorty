import { translateStatus, translateGender } from '../statusTranslator';

describe('statusTranslator', () => {
  describe('translateStatus', () => {
    it('should translate Alive to Vivo', () => {
      expect(translateStatus('Alive')).toBe('Vivo');
    });

    it('should translate Dead to Muerto', () => {
      expect(translateStatus('Dead')).toBe('Muerto');
    });

    it('should translate unknown to Desconocido', () => {
      expect(translateStatus('unknown')).toBe('Desconocido');
    });

    it('should return original value for unrecognized status', () => {
      expect(translateStatus('CustomStatus')).toBe('CustomStatus');
    });

    it('should handle empty string', () => {
      expect(translateStatus('')).toBe('');
    });
  });

  describe('translateGender', () => {
    it('should translate Male to Masculino', () => {
      expect(translateGender('Male')).toBe('Masculino');
    });

    it('should translate Female to Femenino', () => {
      expect(translateGender('Female')).toBe('Femenino');
    });

    it('should translate Genderless to Sin género', () => {
      expect(translateGender('Genderless')).toBe('Sin género');
    });

    it('should translate unknown to Desconocido', () => {
      expect(translateGender('unknown')).toBe('Desconocido');
    });

    it('should return original value for unrecognized gender', () => {
      expect(translateGender('CustomGender')).toBe('CustomGender');
    });

    it('should handle empty string', () => {
      expect(translateGender('')).toBe('');
    });
  });
}); 