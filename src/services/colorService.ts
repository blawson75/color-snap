import { colorNames, LanguageCode } from '../utils/colorNames';

export function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return { h, s, v };
}

export function classifyColorKey(r: number, g: number, b: number): string {
  const { h, s, v } = rgbToHsv(r, g, b);

  if (v < 0.15) return 'black';
  if (s < 0.12 && v > 0.85) return 'white';
  if (s < 0.18) return 'gray';

  if (h >= 0 && h < 15) return s > 0.5 && v > 0.7 ? 'red' : 'brown';
  if (h >= 15 && h < 40) return 'orange';
  if (h >= 30 && h < 50 && s >= 0.5 && v >= 0.8) return 'amber';
  if (h >= 40 && h < 70) return 'yellow';
  if (h >= 70 && h < 165) return 'green';
  if (h >= 165 && h < 260) return 'blue';
  if (h >= 260 && h < 310) return 'purple';
  if (h >= 310 && h < 360) return s > 0.2 ? 'pink' : 'gray';

  if (v < 0.4) return 'brown';

  return 'gray';
}

export function getColorName(r: number, g: number, b: number, lang: LanguageCode = 'en'): string {
  const key = classifyColorKey(r, g, b);
  const langVocab = colorNames[lang] || colorNames.en;
  return langVocab[key] || colorNames.en[key] || 'color';
}
