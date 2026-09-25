import "./style.css";
import {
  AVAILABLE,
  OCCUPIED,
  SEATS_PER_ROW,
  createSeatingMatrix,
  countSeats,
  displaySeats,
  findAdjacentSeats,
  reserveSeat,
} from "./seatManager";

const seating = createSeatingMatrix();
const seatGrid = document.querySelector<HTMLDivElement>("#seat-grid");
const availabilityLabel = document.querySelector<HTMLElement>("#availability-label");
const statusMessage = document.querySelector<HTMLElement>("#status-message");
const adjacentMessage = document.querySelector<HTMLElement>("#adjacent-message");
const resetButton = document.querySelector<HTMLButtonElement>("#reset-button");
const confirmButton = document.querySelector<HTMLButtonElement>("#confirm-button");

let selectedSeat: [number, number] | null = null;

function renderSeats(): void {
  if (!seatGrid || !availabilityLabel) return;

  seatGrid.innerHTML = "";
  seating.forEach((row, rowIndex) => {
    row.forEach((seat, seatIndex) => {
      const button = document.createElement("button");
      const isOccupied = seat === OCCUPIED;
      const isSelected = selectedSeat?.[0] === rowIndex && selectedSeat?.[1] === seatIndex;
      button.className = `seat ${isOccupied ? "seat-occupied" : isSelected ? "seat-selected" : "seat-available"}`;
      button.type = "button";
      button.disabled = isOccupied;
      button.setAttribute("aria-pressed", String(isSelected));
      button.setAttribute("aria-label", `Row ${rowIndex + 1}, seat ${seatIndex + 1}${isOccupied ? ", occupied" : isSelected ? ", selected" : ", available"}`);
      button.textContent = isOccupied ? "×" : "";
      button.addEventListener("click", () => {
        selectedSeat = isSelected ? null : [rowIndex, seatIndex];
        showStatus(selectedSeat ? `Seat ${rowIndex + 1}-${seatIndex + 1} selected. Confirm to reserve it.` : "Seat selection cancelled.", "success");
        renderSeats();
        showAdjacentSeats();
      });
      seatGrid.appendChild(button);
    });
  });

  const [occupiedSeats, availableSeats] = countSeats(seating);
  availabilityLabel.textContent = `${availableSeats} available · ${occupiedSeats} occupied`;
  if (confirmButton) confirmButton.disabled = selectedSeat === null;
}

function showStatus(message: string, tone: "success" | "error"): void {
  if (!statusMessage) return;
  statusMessage.textContent = message;
  statusMessage.className = `status-message status-${tone}`;
}

function showAdjacentSeats(): void {
  if (!adjacentMessage) return;
  const pairs = findAdjacentSeats(seating);
  adjacentMessage.textContent = pairs.length > 0
    ? `${pairs.length} adjacent options found. ${pairs.slice(0, 3).join(" · ")}${pairs.length > 3 ? " · …" : ""}`
    : "No adjacent seats are currently available.";
}

resetButton?.addEventListener("click", () => {
  selectedSeat = null;
  seating.forEach((row) => row.fill(AVAILABLE));
  showStatus("Room reset. Every seat is available.", "success");
  showAdjacentSeats();
  renderSeats();
});

confirmButton?.addEventListener("click", () => {
  if (!selectedSeat) {
    showStatus("Select an available seat before confirming.", "error");
    return;
  }

  const [rowIndex, seatIndex] = selectedSeat;
  const message = reserveSeat(seating, rowIndex + 1, seatIndex + 1);
  const confirmed = seating[rowIndex][seatIndex] === OCCUPIED;
  selectedSeat = null;
  showStatus(message, confirmed ? "success" : "error");
  renderSeats();
  showAdjacentSeats();
});

renderSeats();
showAdjacentSeats();

if (import.meta.env?.DEV) {
  displaySeats(seating);
}
