import catalog from '../../../shared/rooms.json';

/** Hotel facts shown across the site. Update them here only. */
export const hotel = {
  name: "Hôtel de l'Air",
  phone: '+237 6 87 01 80 69',
  phoneHref: 'tel:+237687018069',
  whatsappHref: 'https://wa.me/237687018069',
  email: 'reservation@hotel-de-lair.com',
  street: "Avenue de l'Indépendance",
  district: 'Bonapriso',
  city: 'Douala',
  country: 'Cameroun',
  coords: { lat: 4.0195597, lng: 9.7013965 },
  mapsUrl: 'https://maps.app.goo.gl/vZpgA9UBJg72MyLN6',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=4.0195597,9.7013965',
  // Centered on the hotel without a search query, so Google shows no info card (the pin is drawn by MapEmbed).
  mapEmbedUrl: 'https://maps.google.com/maps?ll=4.0195597,9.7013965&z=16&output=embed',
  instagram: 'https://www.instagram.com/hotel_de_lair/',
  facebook: 'https://www.facebook.com/61556578353614',
  ratings: {
    booking: { score: 8.5, staff: 9.4, url: 'https://www.booking.com/hotel/cm/de-l-air-douala.html' },
    hotelsCom: { score: 8.6, url: 'https://fr.hotels.com/ho3897065280/' },
  },
};

export const { rooms, currency, maxRoomsPerBooking } = catalog;
export const lowestPrice = Math.min(...rooms.map((r) => r.price));
export const roomById = (id) => rooms.find((r) => r.id === id);
