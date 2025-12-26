import { Routes, Route } from "react-router-dom";
import { Navbar, Footer, ProtectedRoute } from "./components";
import {
  Home,
  BookDetails,
  Cart,
  Confirmation,
  Dashboard,
  Contact,
  Login,
  Register,
  // Admin Pages
  AdminLayout,
  AdminDashboard,
  AdminBooks,
  AdminReservations,
  AdminBorrowings,
  AdminUsers,
  AdminGenres,
  AdminAuthors,
  AdminMessages,
} from "./pages";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Admin Routes - Separate layout without Navbar/Footer */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="LIBRARIAN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="books" element={<AdminBooks />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="borrowings" element={<AdminBorrowings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="authors" element={<AdminAuthors />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* Main App Routes with Navbar/Footer */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected Routes - require authentication */}
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout/confirmation"
                    element={
                      <ProtectedRoute>
                        <Confirmation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
