const STORAGE_KEY = 'bar-casa-pilona-bookings';

const form = document.getElementById('booking-form');
const formMessage = document.getElementById('form-message');
const bookingsList = document.getElementById('bookings-list');

function getStoredBookings() {
  const saved = localStorage.getItem(STORAGE_KEY);
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function persistBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function renderBookings() {
  const bookings = getStoredBookings();

  if (!bookings.length) {
    bookingsList.innerHTML = '<p class="empty-state">No bookings yet — your next reservation will appear here.</p>';
    return;
  }

  bookingsList.innerHTML = bookings
    .slice()
    .reverse()
    .map(
      (booking) => `
        <article class="booking-item">
          <h3>${booking.name}</h3>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Guests:</strong> ${booking.guests}</p>
          <p><strong>Phone:</strong> ${booking.phone}</p>
          ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
        </article>
      `
    )
    .join('');
}

function setDefaultDate() {
  const dateInput = document.getElementById('booking-date');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
  dateInput.value = tomorrow.toISOString().split('T')[0];
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('guest-name').value.trim();
  const phone = document.getElementById('guest-phone').value.trim();
  const date = document.getElementById('booking-date').value;
  const time = document.getElementById('booking-time').value;
  const guests = document.getElementById('guest-count').value;
  const notes = document.getElementById('booking-notes').value.trim();

  if (!name || !phone || !date || !time || !guests) {
    formMessage.textContent = 'Please complete all required fields before confirming your reservation.';
    formMessage.style.color = '#a33a2a';
    return;
  }

  const booking = { name, phone, date, time, guests, notes };
  const bookings = getStoredBookings();
  bookings.push(booking);
  persistBookings(bookings);
  renderBookings();

  form.reset();
  setDefaultDate();
  formMessage.textContent = `Reservation confirmed for ${name} on ${date} at ${time}.`;
  formMessage.style.color = '#1f5e37';
});

setDefaultDate();
renderBookings();
