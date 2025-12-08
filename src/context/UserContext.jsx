import { createContext, useContext, useReducer, useEffect } from "react";
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
  MAX_BOOKS_PER_RESERVATION,
} from "../utils";
import { v4 as uuidv4 } from "uuid";

const UserContext = createContext();

const initialState = {
  user: null,
  cart: [],
  wishlist: [],
  reservations: [],
  borrowedBooks: [],
  totalBorrowed: 0,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOAD_STATE":
      return { ...state, ...action.payload };

    case "SET_USER":
      return { ...state, user: action.payload };

    case "ADD_TO_CART": {
      if (state.cart.length >= MAX_BOOKS_PER_RESERVATION) {
        return state;
      }
      if (state.cart.find((item) => item.bookId === action.payload.bookId)) {
        return state;
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.bookId !== action.payload),
      };

    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.bookId === action.payload.bookId
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [] };

    case "ADD_TO_WISHLIST":
      if (state.wishlist.find((id) => id === action.payload)) {
        return state;
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };

    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter((id) => id !== action.payload),
      };

    case "ADD_RESERVATION": {
      const newReservation = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      return {
        ...state,
        reservations: [...state.reservations, newReservation],
        cart: [],
      };
    }

    case "CANCEL_RESERVATION":
      return {
        ...state,
        reservations: state.reservations.map((res) =>
          res.id === action.payload ? { ...res, status: "cancelled" } : res
        ),
      };

    case "PICKUP_RESERVATION": {
      const reservation = state.reservations.find(
        (res) => res.id === action.payload
      );
      if (!reservation) return state;

      const newBorrowedBooks = reservation.books.map((book) => ({
        ...book,
        reservationId: reservation.id,
        borrowedAt: new Date().toISOString(),
        extended: false,
      }));

      return {
        ...state,
        reservations: state.reservations.map((res) =>
          res.id === action.payload ? { ...res, status: "picked_up" } : res
        ),
        borrowedBooks: [...state.borrowedBooks, ...newBorrowedBooks],
        totalBorrowed: state.totalBorrowed + newBorrowedBooks.length,
      };
    }

    case "RETURN_BOOK":
      return {
        ...state,
        borrowedBooks: state.borrowedBooks.filter(
          (book) => book.bookId !== action.payload
        ),
      };

    case "EXTEND_BORROWING":
      return {
        ...state,
        borrowedBooks: state.borrowedBooks.map((book) =>
          book.bookId === action.payload.bookId
            ? {
                ...book,
                dueDate: action.payload.newDueDate,
                extended: true,
              }
            : book
        ),
      };

    default:
      return state;
  }
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedCart = getStorageItem(STORAGE_KEYS.CART, []);
    const savedUser = getStorageItem(STORAGE_KEYS.USER, null);
    const savedReservations = getStorageItem(STORAGE_KEYS.RESERVATIONS, []);
    const savedWishlist = getStorageItem(STORAGE_KEYS.WISHLIST, []);
    const savedBorrowed = getStorageItem(STORAGE_KEYS.BORROWED_BOOKS, {
      books: [],
      total: 0,
    });

    dispatch({
      type: "LOAD_STATE",
      payload: {
        cart: savedCart,
        user: savedUser,
        reservations: savedReservations,
        wishlist: savedWishlist,
        borrowedBooks: savedBorrowed.books || [],
        totalBorrowed: savedBorrowed.total || 0,
      },
    });
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, state.cart);
  }, [state.cart]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.USER, state.user);
  }, [state.user]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.RESERVATIONS, state.reservations);
  }, [state.reservations]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.WISHLIST, state.wishlist);
  }, [state.wishlist]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.BORROWED_BOOKS, {
      books: state.borrowedBooks,
      total: state.totalBorrowed,
    });
  }, [state.borrowedBooks, state.totalBorrowed]);

  const addToCart = (bookId, pickupDate, duration) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { bookId, pickupDate, duration },
    });
  };

  const removeFromCart = (bookId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });
  };

  const updateCartItem = (bookId, updates) => {
    dispatch({ type: "UPDATE_CART_ITEM", payload: { bookId, updates } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const addToWishlist = (bookId) => {
    dispatch({ type: "ADD_TO_WISHLIST", payload: bookId });
  };

  const removeFromWishlist = (bookId) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: bookId });
  };

  const isInWishlist = (bookId) => state.wishlist.includes(bookId);

  const isInCart = (bookId) =>
    state.cart.some((item) => item.bookId === bookId);

  const setUser = (userData) => {
    dispatch({ type: "SET_USER", payload: userData });
  };

  const createReservation = (reservationData) => {
    dispatch({ type: "ADD_RESERVATION", payload: reservationData });
    return state.reservations.length > 0
      ? state.reservations[state.reservations.length - 1]
      : null;
  };

  const cancelReservation = (reservationId) => {
    dispatch({ type: "CANCEL_RESERVATION", payload: reservationId });
  };

  const pickupReservation = (reservationId) => {
    dispatch({ type: "PICKUP_RESERVATION", payload: reservationId });
  };

  const returnBook = (bookId) => {
    dispatch({ type: "RETURN_BOOK", payload: bookId });
  };

  const extendBorrowing = (bookId, newDueDate) => {
    dispatch({ type: "EXTEND_BORROWING", payload: { bookId, newDueDate } });
  };

  const canAddToCart = state.cart.length < MAX_BOOKS_PER_RESERVATION;

  return (
    <UserContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isInCart,
        setUser,
        createReservation,
        cancelReservation,
        pickupReservation,
        returnBook,
        extendBorrowing,
        canAddToCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
