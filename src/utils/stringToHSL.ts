interface IHSL {
  h: number;
  s: number;
  l: number;
}

const getHashOfString = function getHashOfString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

const normalizeHash = function normalizeHash(hash: number, min: number, max: number) {
  return Math.floor((hash % (max - min)) + min);
};

const hRange = [0, 360];
const sRange = [60, 100];
const lRange = [70, 85];

const generateHSL = function generateHSL(name: string): IHSL {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  const s = normalizeHash(hash, sRange[0], sRange[1]);
  const l = normalizeHash(hash, lRange[0], lRange[1]);
  return { h, s, l };
};

const HSLtoString = (hsl: IHSL) => {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
};

export const getStringToHSLString = function getStringToHSLString(str: string) {
  return HSLtoString(generateHSL(str));
};
