import { addDays } from './validation.js';

/**
 * How many units of `room` are still free for every night of the stay.
 * A reservation occupies the nights from checkIn (inclusive) to checkOut (exclusive).
 */
export function remainingUnits(room, reservations, checkIn, checkOut) {
  const relevant = reservations.filter(
    (r) => r.roomId === room.id && r.status !== 'cancelled' && r.checkIn < checkOut && checkIn < r.checkOut,
  );
  let maxBooked = 0;
  for (let night = checkIn; night < checkOut; night = addDays(night, 1)) {
    const booked = relevant
      .filter((r) => r.checkIn <= night && night < r.checkOut)
      .reduce((sum, r) => sum + r.rooms, 0);
    maxBooked = Math.max(maxBooked, booked);
  }
  return Math.max(0, room.inventory - maxBooked);
}

export function quote(room, stay) {
  return room.price * stay.nights * stay.rooms;
}
