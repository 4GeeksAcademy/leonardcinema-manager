export const ROW_COUNT = 8;
export const SEATS_PER_ROW = 10;
export const AVAILABLE = 0;
export const OCCUPIED = 1;

export type SeatingMatrix = number[][];

// Creates an empty room where every seat is available.
export function createSeatingMatrix(): SeatingMatrix {
  return Array.from({ length: ROW_COUNT }, () =>
    Array.from({ length: SEATS_PER_ROW }, () => AVAILABLE)
  );
}

// Returns the occupied and available totals in that order.
export function countSeats(seating: SeatingMatrix): [number, number] {
  let occupiedSeats = 0;

  for (const row of seating) {
    for (const seat of row) {
      if (seat === OCCUPIED) occupiedSeats += 1;
    }
  }

  return [occupiedSeats, seating.length * SEATS_PER_ROW - occupiedSeats];
}

// Reserves a 1-based row and seat number and explains the result.
export function reserveSeat(
  seating: SeatingMatrix,
  rowNumber: number,
  seatNumber: number
): string {
  const rowIndex = rowNumber - 1;
  const seatIndex = seatNumber - 1;

  if (
    rowIndex < 0 ||
    rowIndex >= seating.length ||
    seatIndex < 0 ||
    seatIndex >= SEATS_PER_ROW
  ) {
    return `Seat ${rowNumber}-${seatNumber} is outside the screening room.`;
  }

  if (seating[rowIndex][seatIndex] === OCCUPIED) {
    return `Seat ${rowNumber}-${seatNumber} is already taken.`;
  }

  seating[rowIndex][seatIndex] = OCCUPIED;
  return `Seat ${rowNumber}-${seatNumber} reserved successfully.`;
}

// Finds every horizontal pair of available seats and returns 1-based positions.
export function findAdjacentSeats(seating: SeatingMatrix): string[] {
  const adjacentSeats: string[] = [];

  for (let rowIndex = 0; rowIndex < seating.length; rowIndex += 1) {
    for (let seatIndex = 0; seatIndex < SEATS_PER_ROW - 1; seatIndex += 1) {
      if (
        seating[rowIndex][seatIndex] === AVAILABLE &&
        seating[rowIndex][seatIndex + 1] === AVAILABLE
      ) {
        adjacentSeats.push(`Row ${rowIndex + 1}, seats ${seatIndex + 1}-${seatIndex + 2}`);
      }
    }
  }

  return adjacentSeats;
}

// Prints the matrix using X for occupied and L for available seats.
export function displaySeats(seating: SeatingMatrix): void {
  console.log(
    "    " +
      Array.from({ length: SEATS_PER_ROW }, (_, index) =>
        String(index + 1).padStart(2, " ")
      ).join(" ")
  );

  seating.forEach((row, rowIndex) => {
    console.log(
      `${String(rowIndex + 1).padStart(2, " ")}  ${row
        .map((seat) => (seat === OCCUPIED ? "X" : "L"))
        .join("  ")}`
    );
  });
}
