import { validateBooking, isFormValid } from "./validation.js";
import { createBooking } from "./api.js";
import {
  getFormData,
  validateFieldUI,
  updateSubmitButtonUI,
  setMinDateUI,
  clearFieldStyles,
  setButtonLoading,
  renderErrors,
  showToast,
} from "./ui.js";

export function initBooking() {
  const form = document.querySelector("#booking-form");
  if (!form) return;

  const fields = form.querySelectorAll("input, select");
  const submitButton = form.querySelector("button[type='submit']");
  const dateInput = form.querySelector("#date");

  // Initialize UI
  setMinDateUI(dateInput);
  updateSubmitButtonUI(submitButton, false);

  // =============================
  // REAL-TIME VALIDATION
  // =============================

  // Validate when user leaves a field
  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      const data = getFormData(form);
      const errors = validateBooking(data);
      validateFieldUI(form, field, errors);
      updateSubmitButtonUI(submitButton, isFormValid(data));
    });
  });

  // Validate immediately on change (important for date/time/selects)
  form.addEventListener("change", (e) => {
    const data = getFormData(form);
    const errors = validateBooking(data);
    validateFieldUI(form, e.target, errors);
    updateSubmitButtonUI(submitButton, isFormValid(data));
  });

  // Update button state while typing (without showing errors on untouched fields)
  form.addEventListener("input", (e) => {
    if (
      e.target.classList.contains("valid") ||
      e.target.classList.contains("invalid")
    ) {
      const data = getFormData(form);
      const errors = validateBooking(data);
      validateFieldUI(form, e.target, errors);
    }
    const data = getFormData(form);
    updateSubmitButtonUI(submitButton, isFormValid(data));
  });

  // =============================
  // FORM SUBMISSION
  // =============================
  let isSubmitting = false;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    try {
      // Validate form
      const data = getFormData(form);
      const errors = validateBooking(data);

      if (Object.keys(errors).length > 0) {
        renderErrors(form, errors);
        isSubmitting = false;
        return;
      }

      // Show loading state
      setButtonLoading(submitButton, true);

      // Call API layer
      await createBooking(data);

      // Reset form
      form.reset();
      setMinDateUI(dateInput);
      clearFieldStyles(fields);

      // Show success
      showToast("Booking successful!", "success");
    } catch (err) {
      console.error(err);

      // Handle specific errors
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
    } finally {
      // Reset loading state and button
      setButtonLoading(submitButton, false);
      const data = getFormData(form);
      updateSubmitButtonUI(submitButton, isFormValid(data));
      isSubmitting = false;
    }
  });
}
