// ====== Nagvition ==============
const toggle = document.querySelector(".nav-toggle");
const menu = document.querySelector("#nav-menu");

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", isOpen);
});

// ====== Booking System ==============
// In-memory storage of bookings
const bookings = [];

const bookingForm = document.querySelector("#booking-form");
const bookingCofirmation = document.querySelector("#booking-confirmation");

bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();

// collect the values
const clientName = bookingForm.name.value;
const email = bookingForm.email.value;
const service = bookingForm.service.value;
const packageType = bookingForm.package.value;
const date = bookingForm.date.value;
const time = bookingForm.time.value;

// Save booking
bookings.push({clientName, email, service, packageType, date, time })
console.log(bookings);

bookingForm.reset();
bookingCofirmation.classList.remove("hidden");
});
