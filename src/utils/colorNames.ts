export const languages = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean"
};

export type LanguageCode = keyof typeof languages;

export const colorNames: Record<LanguageCode, Record<string, string>> = {
  en: {
    black: "black", white: "white", red: "red", orange: "orange",
    yellow: "yellow", green: "green", blue: "blue", purple: "purple",
    pink: "pink", brown: "brown", gray: "gray", amber: "amber"
  },
  es: {
    black: "negro", white: "blanco", red: "rojo", orange: "naranja",
    yellow: "amarillo", green: "verde", blue: "azul", purple: "morado",
    pink: "rosa", brown: "marrón", gray: "gris", amber: "ámbar"
  },
  fr: {
    black: "noir", white: "blanc", red: "rouge", orange: "orange",
    yellow: "jaune", green: "vert", blue: "bleu", purple: "violet",
    pink: "rose", brown: "marron", gray: "gris", amber: "ambre"
  },
  de: {
    black: "schwarz", white: "weiß", red: "rot", orange: "orange",
    yellow: "gelb", green: "grün", blue: "blau", purple: "lila",
    pink: "rosa", brown: "braun", gray: "grau", amber: "bernstein"
  },
  it: {
    black: "nero", white: "bianco", red: "rosso", orange: "arancione",
    yellow: "giallo", green: "verde", blue: "blu", purple: "viola",
    pink: "rosa", brown: "marrone", gray: "grigio", amber: "ambra"
  },
  pt: {
    black: "preto", white: "branco", red: "vermelho", orange: "laranja",
    yellow: "amarelo", green: "verde", blue: "azul", purple: "roxo",
    pink: "rosa", brown: "marrom", gray: "cinza", amber: "âmbar"
  },
  ru: {
    black: "черный", white: "белый", red: "красный", orange: "оранжевый",
    yellow: "желтый", green: "зеленый", blue: "синий", purple: "фиолетовый",
    pink: "розовый", brown: "коричневый", gray: "серый", amber: "янтарный"
  },
  ja: {
    black: "黒", white: "白", red: "赤", orange: "オレンジ",
    yellow: "黄色", green: "緑", blue: "青", purple: "紫",
    pink: "ピンク", brown: "茶色", gray: "グレー", amber: "琥珀色"
  },
  zh: {
    black: "黑", white: "白", red: "红", orange: "橙",
    yellow: "黄", green: "绿", blue: "蓝", purple: "紫",
    pink: "粉红", brown: "棕色", gray: "灰", amber: "琥珀色"
  },
  ko: {
    black: "검정", white: "흰색", red: "빨강", orange: "주황",
    yellow: "노랑", green: "초록", blue: "파랑", purple: "보라",
    pink: "분홍", brown: "갈색", gray: "회색", amber: "호박색"
  }
};
