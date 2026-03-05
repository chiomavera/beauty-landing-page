// ====== BOOKING SYSTEM ==============

export function initBooking() {
  const bookingForm = document.querySelector("#booking-form");

  if (!bookingForm) return;

  const submitButton = bookingForm.querySelector("button[type='submit']");
  const btnText = submitButton.querySelector(".btn-text");
  const btnSpinner = submitButton.querySelector(".btn-spinner");

  const fields = bookingForm.querySelectorAll("input, select");

  const dateInput = document.querySelector("#date");
  const timeInput = document.querySelector("#time");

  // =============================
  // SET MINIMUM DATE (TODAY)
  // =============================
  function setMinDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateInput.min = today.toISOString().split("T")[0];
  }

  setMinDate();

  // =============================
  // VALIDATION LOGIC
  // =============================

  // --- Date & Time Validation ---
  function validateDateTime() {
    dateInput.setCustomValidity("");
    timeInput.setCustomValidity("");

    const dateValue = dateInput.value;
    const timeValue = timeInput.value;

    if (!dateValue) return;

    const now = new Date();

    const selectedDate = new Date(dateValue);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Block past date
    if (selectedDate < today) {
      dateInput.setCustomValidity("You cannot book a past date.");
      return;
    }

    // Block past time if booking today
    if (selectedDate.getTime() === today.getTime() && timeValue) {
      const [hours, minutes] = timeValue.split(":").map(Number);

      const selectedDateTime = new Date(dateValue);
      selectedDateTime.setHours(hours, minutes, 0, 0);

      if (selectedDateTime <= now) {
        timeInput.setCustomValidity("This time has already passed.");
      }
    }
  }

  // --- Single Field Validation ---
  function validateField(field) {
    const errorElement = document.querySelector(`#${field.id}-error`);

    // Run custom date/time validation first
    if (field.id === "date" || field.id === "time") {
      validateDateTime();
    }

    if (!field.checkValidity()) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      if (errorElement) {
        errorElement.textContent =
          field.validationMessage || "Please enter a valid value.";
        errorElement.classList.add("active");
      }
    } else {
      field.classList.remove("invalid");
      field.classList.add("valid");

      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.remove("active");
      }
    }
  }

  // --- Submit Button State ---
  function updateSubmitButton() {
    submitButton.disabled = !bookingForm.checkValidity();
  }

  // =============================
  // EVENT LISTENERS
  // =============================

  // Validate when user leaves a field
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      validateField(field);
      updateSubmitButton();
    });
  });

  // Validate immediately on change (important for date/time)
  bookingForm.addEventListener("change", (e) => {
    validateField(e.target);
    updateSubmitButton();
  });

  // Update button state while typing
  bookingForm.addEventListener("input", (e) => {
    // Only validate touched fields to avoid annoying errors while typing
    if (
      e.target.classList.contains("valid") ||
      e.target.classList.contains("invalid")
    ) {
      validateField(e.target);
    }
    updateSubmitButton();
  });

  // =============================
  // TOAST NOTIFICATION
  // =============================
  function showToast(message, type = "success") {
    const toast = document.querySelector("#booking-confirmation");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove("hidden", "success", "error", "show");
    toast.classList.add(type);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  // =============================
  // FORM SUBMISSION
  // =============================
  let isSubmitting = false;

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double-submission
    isSubmitting = true;

    try {
      validateDateTime();

      if (!bookingForm.checkValidity()) {
        fields.forEach((field) => validateField(field));
        return;
      }

      // Loading state
      submitButton.disabled = true;
      submitButton.classList.add("loading");
      btnText.textContent = "Processing...";
      btnSpinner.classList.remove("hidden");

      const formData = Object.fromEntries(new FormData(bookingForm));

      try {
        const { error } = await supabase.from("bookings").insert([formData]);

        if (error) throw error;

        bookingForm.reset();
        setMinDate();

        fields.forEach((field) => {
          field.classList.remove("valid", "invalid");
        });

        showToast("Booking successful!", "success");
      } catch (err) {
        console.error(err);

        if (err.message.includes("unique_booking_slot")) {
          showToast(
            "This time slot is already booked. Please choose another time.",
            "error",
          );
        } else if (err.message.includes("booking_not_in_past")) {
          showToast("You cannot book a past date.", "error");
        } else {
          showToast("Booking failed. Please try again.", "error");
        }
      }

      // Reset button
      btnText.textContent = "Book Appointment";
      btnSpinner.classList.add("hidden");
      submitButton.classList.remove("loading");
      updateSubmitButton();
    } finally {
      isSubmitting = false;
    }
  });
}
