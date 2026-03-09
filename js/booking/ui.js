export function getFormData(form) {
  return Object.fromEntries(new FormData(form));
}

// =============================
// FIELD VALIDATION UI
// =============================
export function validateFieldUI(form, field, errors) {
  const errorElement = form.querySelector(`#${field.id}-error`);

  if (errors[field.name]) {
    field.classList.add("invalid");
    field.classList.remove("valid");

    if (errorElement) {
      errorElement.textContent = errors[field.name];
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

// =============================
// SUBMIT BUTTON STATE
// =============================
export function updateSubmitButtonUI(submitButton, isValid) {
  submitButton.disabled = !isValid;
}

// =============================
// MINIMUM DATE CONSTRAINT
// =============================
export function setMinDateUI(dateInput) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateInput.min = today.toISOString().split("T")[0];
}

// =============================
// ERROR RENDERING (BATCH)
// =============================
export function renderErrors(form, errors) {
  const fields = form.querySelectorAll("input, select");

  fields.forEach((field) => {
    if (errors[field.name]) {
      field.classList.add("invalid");
      field.classList.remove("valid");

      const errorElement = form.querySelector(`#${field.id}-error`);
      if (errorElement) {
        errorElement.textContent = errors[field.name];
        errorElement.classList.add("active");
      }
    } else {
      field.classList.remove("invalid");
      field.classList.add("valid");

      const errorElement = form.querySelector(`#${field.id}-error`);
      if (errorElement) {
        errorElement.textContent = "";
        errorElement.classList.remove("active");
      }
    }
  });
}

// =============================
// CLEAR FIELD STYLES
// =============================
export function clearFieldStyles(fields) {
  fields.forEach((field) => {
    field.classList.remove("valid", "invalid");
  });
}

// =============================
// BUTTON LOADING STATE
// =============================
export function setButtonLoading(submitButton, isLoading) {
  if (isLoading) {
    submitButton.disabled = true;
    submitButton.classList.add("loading");
    const btnText = submitButton.querySelector(".btn-text");
    const btnSpinner = submitButton.querySelector(".btn-spinner");
    if (btnText) btnText.textContent = "Processing...";
    if (btnSpinner) btnSpinner.classList.remove("hidden");
  } else {
    submitButton.classList.remove("loading");
    const btnText = submitButton.querySelector(".btn-text");
    const btnSpinner = submitButton.querySelector(".btn-spinner");
    if (btnText) btnText.textContent = "Book Appointment";
    if (btnSpinner) btnSpinner.classList.add("hidden");
  }
}

// =============================
// TOAST NOTIFICATION
// =============================
export function showToast(message, type = "success") {
  const toast = document.querySelector("#booking-confirmation");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove("hidden", "success", "error", "show");
  toast.classList.add(type, "show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}
