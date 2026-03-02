import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  "https://llmwcqivyuqytbtqcaoz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsbXdjcWl2eXVxeXRidHFjYW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjE0NzMsImV4cCI6MjA4NTY5NzQ3M30.4UBQ8aPfdTylIyjWUjr7rn2xvcRmpizd1elxxmjGMVk",
);

  // ====== NAVIGATION ==============
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#nav-menu");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen);
  });

    // ====== BOOKING SYSTEM ==============
  const bookingForm = document.querySelector("#booking-form");
  const submitButton = bookingForm.querySelector("button[type='submit']");
  const btnText = submitButton.querySelector(".btn-text");
  const btnSpinner = submitButton.querySelector(".btn-spinner");
  const fields = bookingForm.querySelectorAll("input, select");

  // Track which fields the user has interacted with
  const touchedFields = new Set();

  // Mark field as touched on blur, then validate it
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      touchedFields.add(field.id);
      validateField(field);
      updateSubmitButton();
    });
  });

  // On input/change: update button state + re-validate only touched fields
  bookingForm.addEventListener("input", () => {
    validateTouchedFields();
    updateSubmitButton();
  });
  bookingForm.addEventListener("change", () => {
    validateTouchedFields();
    updateSubmitButton();
  });

  // Enable/disable submit button based on overall form validity
  function updateSubmitButton() {
    submitButton.disabled = !bookingForm.checkValidity();
  }

  // Validate a single field and show/hide its error
  function validateField(field) {
    const errorElement = document.querySelector(`#${field.id}-error`);

    if (!field.checkValidity()) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      if (errorElement) {
        if (field.validity.valueMissing) {
          errorElement.textContent = "This field is required.";
        } else if (field.validity.tooShort) {
          errorElement.textContent = `Must be at least ${field.minLength} characters.`;
        } else if (field.validity.typeMismatch) {
          errorElement.textContent = "Enter a valid email address.";
        } else {
          errorElement.textContent = "Please enter a valid value.";
        }
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

  // Only validate fields the user has already interacted with
  function validateTouchedFields() {
    fields.forEach((field) => {
      if (touchedFields.has(field.id)) {
        validateField(field);
      }
    });
  }

  // Validate ALL fields (used on submit attempt)
  function validateAllFields() {
    fields.forEach((field) => {
      touchedFields.add(field.id); // mark everything as touched
      validateField(field);
    });
  }

  // ======= Reusable Toast Function =======
  function showToast(message, type = "success") {
    const toast = document.querySelector("#booking-confirmation");
    toast.textContent = message;
    toast.classList.remove("hidden", "success", "error", "show");
    toast.classList.add(type);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add("show");
      });
    });

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  // ===== Submit =========
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!bookingForm.checkValidity()) {
      validateAllFields();
      return;
    }

    // Start Loading State
    submitButton.disabled = true;
    submitButton.classList.add("loading");
    btnText.textContent = "Processing...";
    btnSpinner.classList.remove("hidden");

    const formData = Object.fromEntries(new FormData(bookingForm));

    try {
      const { error } = await supabase.from("bookings").insert([formData]);
      if (error) throw error;

      bookingForm.reset();
      touchedFields.clear();
      fields.forEach((field) => {
        field.classList.remove("valid", "invalid");
      });

      showToast("Booking successful!", "success");
    } catch (err) {
      console.error(err);
      if (err.message.includes("unique_booking_slot")) {
        showToast("This time slot is already booked. Please choose another time.", "error");
      } else {
        showToast("Booking failed. Please try again.", "error");
      }
    }

    // End Loading State
    btnText.textContent = "Book Appointment";
    btnSpinner.classList.add("hidden");
    submitButton.classList.remove("loading");
    // Keep disabled after reset (form is empty again)
    submitButton.disabled = true;
  });
