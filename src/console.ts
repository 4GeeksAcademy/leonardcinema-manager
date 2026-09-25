import {
  createSeatingMatrix,
  countSeats,
  displaySeats,
  findAdjacentSeats,
  reserveSeat,
} from "./seatManager";

const seating = createSeatingMatrix();

console.log("Empty cinema room:");
displaySeats(seating);
console.log("Seat totals:", countSeats(seating));
console.log(findAdjacentSeats(seating).slice(0, 3));

console.log(reserveSeat(seating, 4, 5));
console.log(reserveSeat(seating, 4, 5));
console.log("Updated cinema room:");
displaySeats(seating);
console.log("Seat totals:", countSeats(seating));
