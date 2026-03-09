export function validateBooking(data) {
  const errors = {};

  // Name validation
  if (!data.name) {
    errors.name = "Full name is required.";
  } else if (data.name.trim().length < 3) {
    errors.name = "Name must be at least 3 characters.";
  }

  // Email validation
  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email.";
  }

  // Service validation
  if (!data.service) {
    errors.service = "Please select a service.";
  }

  // Package validation
  if (!data.package) {
    errors.package = "Please select a package.";
  }

  // Date validation
  if (!data.date) {
    errors.date = "Date is required.";
  } else {
    const selectedDate = new Date(data.date);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.date = "You cannot book a past date.";
    }
  }

  // Time validation
  if (!data.time) {
    errors.time = "Time is required.";
  }

  // Combined date/time validation
  if (data.date && data.time) {
    const now = new Date();
    const [h, m] = data.time.split(":").map(Number);
    const selectedDateTime = new Date(data.date);
    selectedDateTime.setHours(h, m, 0, 0);

    if (selectedDateTime <= now) {
      errors.time = "This time has already passed.";
    }
  }

  return errors;
}

// Check if form is valid without showing errors
export function isFormValid(data) {
  const errors = validateBooking(data);
  return Object.keys(errors).length === 0;
}
