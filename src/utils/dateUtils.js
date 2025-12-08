// Format date to readable string
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format date for input field (YYYY-MM-DD)
export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Get minimum pickup date (24 hours from now)
export const getMinPickupDate = () => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return formatDateForInput(date);
};

// Calculate due date based on pickup date and duration
export const calculateDueDate = (pickupDate, durationDays) => {
  const date = new Date(pickupDate);
  date.setDate(date.getDate() + durationDays);
  return date;
};

// Get remaining days until due date
export const getRemainingDays = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Check if a date is overdue
export const isOverdue = (dueDate) => {
  return getRemainingDays(dueDate) < 0;
};

// Calculate late fine
export const calculateLateFine = (dueDate, finePerDay) => {
  const daysOverdue = Math.abs(getRemainingDays(dueDate));
  return isOverdue(dueDate) ? daysOverdue * finePerDay : 0;
};

// Check if pickup date is valid (at least 24 hours from now)
export const isValidPickupDate = (pickupDate) => {
  const pickup = new Date(pickupDate);
  const minDate = new Date();
  minDate.setHours(minDate.getHours() + 24);
  return pickup >= minDate;
};

// Get relative time string
export const getRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = targetDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days overdue`;
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else {
    return `${diffDays} days remaining`;
  }
};
