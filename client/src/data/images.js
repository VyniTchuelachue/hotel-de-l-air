/**
 * All photos used on the site. Values are Unsplash photo ids (free licence) used as
 * placeholders. To use your own photos, drop them in client/public/images and replace
 * a value with its path, e.g.  hero: '/images/chambre-executive.jpg'
 */
export const images = {
  hero: '1611892440504-42a792e24d32',
  lobby: '1759038085950-1234ca8f5fed',
  lounge: '1776858107888-2b111bda0d8f',
  garden: '1771814494881-d4a22b02de71',

  executive: '1618773928121-c32242e63f39',
  superieure: '1631049307264-da0ec9d70304',
  standard: '1762117360848-be7490786979',
  roomLounge: '1776763018821-8feeaeeee0a5',
  roomSofa: '1590490360182-c33d57733427',
  roomView: '1771775529138-a7a20ba7e032',
  bathroom: '1789121274502-84fe89234993',

  restaurant: '1772479036537-2f24be392ab0',
  restaurantPlants: '1779609134940-5028533d010e',
  dish: '1467003909585-2f8a72700288',
  dining: '1414235077428-338989a2e8c0',
  bar: '1768821635799-5cafd1831cc3',
  cocktail: '1778104959835-3ca0791641a6',

  breakfast: '1642509600851-63d7b8f2c4b8',
  pool: '1623718649591-311775a30c43',
  gym: '1740895307920-0ba63bffc1c9',
  douala: '/images/au-rythme-de-douala.png',
  sunset: '1474302173007-293973cab927',
};

const WIDTHS = [480, 800, 1200, 1800];
const unsplash = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/** Returns { src, srcSet } for an entry of `images` (Unsplash id or local path). */
export function photo(key) {
  const value = images[key] ?? key;
  if (value.startsWith('/') || value.startsWith('http')) return { src: value };
  return {
    src: unsplash(value, 1200),
    srcSet: WIDTHS.map((w) => `${unsplash(value, w)} ${w}w`).join(', '),
  };
}
