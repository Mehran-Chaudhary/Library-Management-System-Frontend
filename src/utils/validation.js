// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Library membership ID validation (format: LIB-XXXXX or LIB-XXXXX-XXXX)
export const isValidMembershipId = (id) => {
  // Accept LIB- followed by alphanumeric characters and optional dashes
  const idRegex = /^LIB-[A-Z0-9][A-Z0-9-]{3,}$/i;
  return idRegex.test(id);
};

// Name validation (at least 2 words, each at least 2 characters)
export const isValidFullName = (name) => {
  const trimmed = name.trim();
  const words = trimmed.split(/\s+/);
  return words.length >= 2 && words.every((word) => word.length >= 2);
};

// Phone validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Form field validation
export const validateField = (name, value) => {
  switch (name) {
    case "fullName":
      if (!value.trim()) return "Full name is required";
      if (!isValidFullName(value))
        return "Please enter your first and last name";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!isValidEmail(value)) return "Please enter a valid email address";
      return "";
    case "membershipId":
      if (!value.trim()) return "Membership ID is required";
      if (!isValidMembershipId(value))
        return "Invalid format. Must start with LIB- followed by alphanumeric characters";
      return "";
    case "pickupDate":
      if (!value) return "Pickup date is required";
      return "";
    case "duration":
      if (!value) return "Borrowing duration is required";
      return "";
    case "message":
      if (!value.trim()) return "Message is required";
      if (value.trim().length < 20)
        return "Message must be at least 20 characters";
      return "";
    case "subject":
      if (!value.trim()) return "Subject is required";
      if (value.trim().length < 5) return "Subject must be at least 5 characters";
      return "";
    default:
      return "";
  }
};

// Validate entire form
export const validateForm = (formData, fields) => {
  const errors = {};
  let isValid = true;

  fields.forEach((field) => {
    const error = validateField(field, formData[field] || "");
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
