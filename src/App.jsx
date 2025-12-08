import { Routes, Route } from "react-router-dom";
import { Navbar, Footer } from "./components";
import {
  Home,
  BookDetails,
  Cart,
  Confirmation,
  Dashboard,
  Contact,
} from "./pages";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/confirmation" element={<Confirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
