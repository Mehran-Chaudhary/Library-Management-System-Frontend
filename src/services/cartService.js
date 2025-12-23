/**
 * Cart Service (Frontend Only - LocalStorage)
 * 
 * IMPORTANT: There is NO backend API for cart!
 * Cart is stored in localStorage and only synced when creating a reservation.
 * 
 * Cart Flow:
 * 1. User adds books to cart (localStorage)
 * 2. User goes to /cart page
 * 3. User fills details and creates reservation
 * 4. Cart items sent to backend via /api/reservations POST
 * 5. Cart cleared from localStorage after successful reservation
 */

const CART_STORAGE_KEY = 'reservationCart';

const cartService = {
  /**
   * Add a book to cart
   * @param {Object} book - Full book object from backend
   * @param {number} borrowingDuration - 7, 14, or 21 days
   * @param {string} pickupDate - ISO date string (optional, can be set later)
   * @returns {Object} { success: boolean, error?: string }
   */
  add: (book, borrowingDuration = 14, pickupDate = null) => {
    try {
      const cart = cartService.get();
      
      // Check if already in cart
      if (cart.find(item => item.bookId === book.id)) {
        return { success: false, error: 'Book already in cart' };
      }
      
      // Check max limit (5 books per reservation)
      if (cart.length >= 5) {
        return { success: false, error: 'Maximum 5 books per reservation' };
      }
      
      // Store full book object and borrowing details
      cart.push({
        bookId: book.id,
        book: book,  // Store full book object for display
        borrowingDuration: borrowingDuration,  // Must match backend field name!
        pickupDate: pickupDate,
        duration: borrowingDuration, // Keep for backward compatibility
        addedAt: new Date().toISOString()
      });
      
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Failed to add to cart' };
    }
  },

  /**
   * Get all cart items
   * @returns {Array} Cart items with book details
   */
  get: () => {
    try {
      return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  },

  /**
   * Remove a book from cart by bookId
   * @param {string} bookId - Book UUID
   */
  remove: (bookId) => {
    try {
      const cart = cartService.get();
      const filtered = cart.filter(item => item.bookId !== bookId);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },

  /**
   * Update a cart item
   * @param {string} bookId - Book UUID
   * @param {Object} updates - Fields to update (borrowingDuration, pickupDate, etc.)
   */
  update: (bookId, updates) => {
    try {
      const cart = cartService.get();
      const updated = cart.map(item => 
        item.bookId === bookId 
          ? { ...item, ...updates }
          : item
      );
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  },

  /**
   * Clear entire cart
   */
  clear: () => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  },

  /**
   * Get cart count
   * @returns {number} Number of items in cart
   */
  count: () => {
    return cartService.get().length;
  },

  /**
   * Check if a book is in cart
   * @param {string} bookId - Book UUID
   * @returns {boolean} True if book is in cart
   */
  isInCart: (bookId) => {
    return cartService.get().some(item => item.bookId === bookId);
  },

  /**
   * Format cart items for backend reservation API
   * Returns array in format: [{ bookId, borrowingDuration }]
   * @returns {Array} Formatted items for backend
   */
  formatForBackend: () => {
    const cart = cartService.get();
    return cart.map(item => ({
      bookId: item.bookId,
      borrowingDuration: item.borrowingDuration || item.duration || 14
    }));
  },

  /**
   * Get the earliest pickup date from cart items
   * @returns {string|null} ISO date string or null
   */
  getPickupDate: () => {
    const cart = cartService.get();
    if (cart.length === 0) return null;
    
    // Find first item with pickup date
    const itemWithDate = cart.find(item => item.pickupDate);
    return itemWithDate?.pickupDate || null;
  }
};

export default cartService;
