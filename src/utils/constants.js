// Book categories/genres
export const GENRES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Fantasy",
  "Mystery",
  "Romance",
  "Self-Help",
  "Children",
];

// Borrowing durations in days
export const BORROWING_DURATIONS = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 21, label: "21 days" },
];

// Maximum books per reservation
export const MAX_BOOKS_PER_RESERVATION = 5;

// Late fine per day per book
export const LATE_FINE_PER_DAY = 2;

// Minimum hours before pickup
export const MIN_PICKUP_HOURS = 24;

// Extension days
export const EXTENSION_DAYS = 7;

// Availability statuses
export const AVAILABILITY_STATUS = {
  AVAILABLE: "AVAILABLE",
  RESERVED: "RESERVED",
  BORROWED: "BORROWED",
  MAINTENANCE: "MAINTENANCE",
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: "booknest_theme",
  CART: "booknest_cart",
  USER: "booknest_user",
  RESERVATIONS: "booknest_reservations",
  WISHLIST: "booknest_wishlist",
  BORROWED_BOOKS: "booknest_borrowed",
};
