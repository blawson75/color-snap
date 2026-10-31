import { classifyColorKey, getColorName, rgbToHsv } from '../services/colorService';

describe('Color Service', () => {
  describe('rgbToHsv', () => {
    it('converts red correctly', () => {
      const result = rgbToHsv(255, 0, 0);
      expect(result.h).toBeCloseTo(0, 0);
      expect(result.s).toBeCloseTo(1, 1);
      expect(result.v).toBeCloseTo(1, 1);
    });

    it('converts green correctly', () => {
      const result = rgbToHsv(0, 255, 0);
      expect(result.h).toBeCloseTo(120, 0);
      expect(result.s).toBeCloseTo(1, 1);
      expect(result.v).toBeCloseTo(1, 1);
    });

    it('converts blue correctly', () => {
      const result = rgbToHsv(0, 0, 255);
      expect(result.h).toBeCloseTo(240, 0);
      expect(result.s).toBeCloseTo(1, 1);
      expect(result.v).toBeCloseTo(1, 1);
    });

    it('converts white correctly', () => {
      const result = rgbToHsv(255, 255, 255);
      expect(result.s).toBeCloseTo(0, 1);
      expect(result.v).toBeCloseTo(1, 1);
    });

    it('converts black correctly', () => {
      const result = rgbToHsv(0, 0, 0);
      expect(result.v).toBeCloseTo(0, 1);
    });
  });

  describe('classifyColorKey', () => {
    it('classifies red', () => {
      expect(classifyColorKey(255, 0, 0)).toBe('red');
    });

    it('classifies green', () => {
      expect(classifyColorKey(0, 255, 0)).toBe('green');
    });

    it('classifies blue', () => {
      expect(classifyColorKey(0, 0, 255)).toBe('blue');
    });

    it('classifies yellow', () => {
      expect(classifyColorKey(255, 255, 0)).toBe('yellow');
    });

    it('classifies orange', () => {
      expect(classifyColorKey(255, 165, 0)).toBe('orange');
    });

    it('classifies purple', () => {
      expect(classifyColorKey(128, 0, 128)).toBe('purple');
    });

    it('classifies pink', () => {
      expect(classifyColorKey(255, 192, 203)).toBe('pink');
    });

    it('classifies brown', () => {
      expect(classifyColorKey(165, 42, 42)).toBe('brown');
    });

    it('classifies gray', () => {
      expect(classifyColorKey(128, 128, 128)).toBe('gray');
    });

    it('classifies white', () => {
      expect(classifyColorKey(255, 255, 255)).toBe('white');
    });

    it('classifies black', () => {
      expect(classifyColorKey(0, 0, 0)).toBe('black');
    });

    it('classifies amber', () => {
      expect(classifyColorKey(255, 191, 0)).toBe('amber');
    });
  });

  describe('getColorName', () => {
    it('returns English color names', () => {
      expect(getColorName(255, 0, 0, 'en')).toBe('red');
      expect(getColorName(0, 255, 0, 'en')).toBe('green');
      expect(getColorName(0, 0, 255, 'en')).toBe('blue');
    });

    it('returns Spanish color names', () => {
      expect(getColorName(255, 0, 0, 'es')).toBe('rojo');
      expect(getColorName(0, 255, 0, 'es')).toBe('verde');
      expect(getColorName(0, 0, 255, 'es')).toBe('azul');
    });

    it('returns French color names', () => {
      expect(getColorName(255, 0, 0, 'fr')).toBe('rouge');
      expect(getColorName(0, 255, 0, 'fr')).toBe('vert');
      expect(getColorName(0, 0, 255, 'fr')).toBe('bleu');
    });

    it('returns German color names', () => {
      expect(getColorName(255, 0, 0, 'de')).toBe('rot');
      expect(getColorName(0, 255, 0, 'de')).toBe('grün');
      expect(getColorName(0, 0, 255, 'de')).toBe('blau');
    });

    it('returns Italian color names', () => {
      expect(getColorName(255, 0, 0, 'it')).toBe('rosso');
      expect(getColorName(0, 255, 0, 'it')).toBe('verde');
      expect(getColorName(0, 0, 255, 'it')).toBe('blu');
    });

    it('returns Portuguese color names', () => {
      expect(getColorName(255, 0, 0, 'pt')).toBe('vermelho');
      expect(getColorName(0, 255, 0, 'pt')).toBe('verde');
      expect(getColorName(0, 0, 255, 'pt')).toBe('azul');
    });

    it('returns Russian color names', () => {
      expect(getColorName(255, 0, 0, 'ru')).toBe('красный');
      expect(getColorName(0, 255, 0, 'ru')).toBe('зеленый');
      expect(getColorName(0, 0, 255, 'ru')).toBe('синий');
    });

    it('returns Japanese color names', () => {
      expect(getColorName(255, 0, 0, 'ja')).toBe('赤');
      expect(getColorName(0, 255, 0, 'ja')).toBe('緑');
      expect(getColorName(0, 0, 255, 'ja')).toBe('青');
    });

    it('returns Chinese color names', () => {
      expect(getColorName(255, 0, 0, 'zh')).toBe('红');
      expect(getColorName(0, 255, 0, 'zh')).toBe('绿');
      expect(getColorName(0, 0, 255, 'zh')).toBe('蓝');
    });

    it('returns Korean color names', () => {
      expect(getColorName(255, 0, 0, 'ko')).toBe('빨강');
      expect(getColorName(0, 255, 0, 'ko')).toBe('초록');
      expect(getColorName(0, 0, 255, 'ko')).toBe('파랑');
    });

    it('falls back to English for unknown language', () => {
      expect(getColorName(255, 0, 0, 'xx' as any)).toBe('red');
    });
  });
});