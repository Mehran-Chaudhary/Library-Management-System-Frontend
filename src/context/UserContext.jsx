import { createContext, useContext, useReducer, useEffect, useRef, useCallback } from "react";
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
  MAX_BOOKS_PER_RESERVATION,
} from "../utils";
import { wishlistService } from "../services";

const UserContext = createContext();

const initialState = {
  user: null,
  cart: [],
  wishlist: [], // Now stores full wishlist items from backend
  wishlistBookIds: [], // Quick lookup for bookIds
  reservations: [],
  borrowedBooks: [],
  totalBorrowed: 0,
  isWishlistLoading: false,
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

    // Wishlist actions - now sync with backend
    case "SET_WISHLIST":
      return { 
        ...state, 
        wishlist: action.payload,
        wishlistBookIds: action.payload.map(item => item.book?.id || item.bookId),
      };

    case "SET_WISHLIST_LOADING":
      return { ...state, isWishlistLoading: action.payload };

    case "ADD_TO_WISHLIST_OPTIMISTIC":
      if (state.wishlistBookIds.includes(action.payload)) {
        return state;
      }
      return { 
        ...state, 
        wishlistBookIds: [...state.wishlistBookIds, action.payload],
      };

    case "REMOVE_FROM_WISHLIST_OPTIMISTIC":
      return {
        ...state,
        wishlist: state.wishlist.filter((item) => (item.book?.id || item.bookId) !== action.payload),
        wishlistBookIds: state.wishlistBookIds.filter((id) => id !== action.payload),
      };

    case "SET_RESERVATIONS":
      return { ...state, reservations: action.payload };

    case "ADD_RESERVATION":
      return {
        ...state,
        reservations: [...state.reservations, action.payload],
        cart: [],
      };

    case "CANCEL_RESERVATION":
      return {
        ...state,
        reservations: state.reservations.map((res) =>
          res.id === action.payload ? { ...res, status: "cancelled" } : res
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

// Lazy initializer function - runs once synchronously before first render
const getInitialState = () => {
  try {
    const savedCart = getStorageItem(STORAGE_KEYS.CART, []);
    return {
      ...initialState,
      cart: savedCart,
    };
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
    return initialState;
  }
};

export const UserProvider = ({ children }) => {
  // Use lazy initialization to load cart from localStorage SYNCHRONOUSLY
  const [state, dispatch] = useReducer(userReducer, null, getInitialState);
  const isInitialized = useRef(true); // Already initialized via lazy init

  // Fetch wishlist from backend on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchWishlistFromBackend();
    }
  }, []);

  // Fetch wishlist from backend
  const fetchWishlistFromBackend = async () => {
    dispatch({ type: "SET_WISHLIST_LOADING", payload: true });
    try {
      const wishlistItems = await wishlistService.getWishlist();
      const items = Array.isArray(wishlistItems) ? wishlistItems : [];
      dispatch({ type: "SET_WISHLIST", payload: items });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      dispatch({ type: "SET_WISHLIST_LOADING", payload: false });
    }
  };

  // Save cart to localStorage on changes (only after initialization)
  useEffect(() => {
    if (!isInitialized.current) return;
    setStorageItem(STORAGE_KEYS.CART, state.cart);
  }, [state.cart]);

  // Cart functions - book parameter is optional but recommended to store book data
  const addToCart = useCallback((bookId, pickupDate, duration, book = null) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { bookId, pickupDate, duration, book },
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });
  }, []);

  const updateCartItem = useCallback((bookId, updates) => {
    dispatch({ type: "UPDATE_CART_ITEM", payload: { bookId, updates } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const isInCart = useCallback((bookId) => 
    state.cart.some((item) => item.bookId === bookId),
  [state.cart]);

  // Wishlist functions - sync with backend API
  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    dispatch({ type: "SET_WISHLIST_LOADING", payload: true });
    try {
      const wishlistItems = await wishlistService.getWishlist();
      const items = Array.isArray(wishlistItems) ? wishlistItems : [];
      dispatch({ type: "SET_WISHLIST", payload: items });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      dispatch({ type: "SET_WISHLIST_LOADING", payload: false });
    }
  }, []);

  const addToWishlist = useCallback(async (bookId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn("Cannot add to wishlist: not authenticated");
      return;
    }

    // Optimistic update
    dispatch({ type: "ADD_TO_WISHLIST_OPTIMISTIC", payload: bookId });

    try {
      await wishlistService.addToWishlist(bookId);
      // Refetch to get full wishlist data
      await fetchWishlist();
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // Revert optimistic update
      dispatch({ type: "REMOVE_FROM_WISHLIST_OPTIMISTIC", payload: bookId });
    }
  }, [fetchWishlist]);

  const removeFromWishlist = useCallback(async (bookId) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Optimistic update
    dispatch({ type: "REMOVE_FROM_WISHLIST_OPTIMISTIC", payload: bookId });

    try {
      await wishlistService.removeFromWishlist(bookId);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      // Refetch on error
      await fetchWishlist();
    }
  }, [fetchWishlist]);

  const isInWishlist = useCallback((bookId) => 
    state.wishlistBookIds.includes(bookId),
  [state.wishlistBookIds]);

  // User functions
  const setUser = useCallback((userData) => {
    dispatch({ type: "SET_USER", payload: userData });
  }, []);

  // Reservation functions
  const createReservation = useCallback((reservationData) => {
    dispatch({ type: "ADD_RESERVATION", payload: reservationData });
  }, []);

  const setReservations = useCallback((reservations) => {
    dispatch({ type: "SET_RESERVATIONS", payload: reservations });
  }, []);

  const cancelReservation = useCallback((reservationId) => {
    dispatch({ type: "CANCEL_RESERVATION", payload: reservationId });
  }, []);

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
        setReservations,
        cancelReservation,
        fetchWishlist,
        canAddToCart,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
