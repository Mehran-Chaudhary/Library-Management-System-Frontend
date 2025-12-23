import { useState, useEffect, useMemo } from "react";
import {
  BookCard,
  SearchBar,
  CategoryFilter,
  LoadingSpinner,
} from "../../components";
import { bookService, genreService } from "../../services";
import { Sparkles, TrendingUp, ChevronRight, AlertCircle } from "lucide-react";
import styles from "./Home.module.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedGenreId, setSelectedGenreId] = useState(null); // Track genre ID for API
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Fetch initial data (genres, featured, new arrivals)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [featured, arrivals, genreList] = await Promise.all([
          bookService.getFeaturedBooks(10),
          bookService.getNewArrivals(10),
          genreService.getGenres().catch(() => []),
        ]);

        setFeaturedBooks(Array.isArray(featured) ? featured : []);
        setNewArrivals(Array.isArray(arrivals) ? arrivals : []);
        
        // Prepare genre list with "All" as first option and store full genre objects
        const genreArray = Array.isArray(genreList) ? genreList : [];
        setGenres([{ id: null, name: "All" }, ...genreArray]);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch books when pagination, search, or genre changes
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query params for backend
        const params = {
          page: currentPage,
          limit: itemsPerPage,
        };
        
        // Add search if present
        if (searchQuery && searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        
        // Add genreId if a specific genre is selected
        if (selectedGenreId) {
          params.genreId = selectedGenreId;
        }
        
        const booksResponse = await bookService.getBooks(params);

        // API interceptor extracts .data, so booksResponse is now the data object
        // Backend returns: { books: [...], total: 44, totalPages: 4, page: 1, limit: 12 }
        if (booksResponse && typeof booksResponse === 'object' && 'books' in booksResponse) {
          // Paginated response from backend
          setBooks(booksResponse.books || []);
          setTotalPages(booksResponse.totalPages || 1);
          setTotalBooks(booksResponse.total || 0);
          setCurrentPage(booksResponse.page || 1);
        } else if (Array.isArray(booksResponse)) {
          // Fallback: direct array response (legacy or error case)
          setBooks(booksResponse);
          setTotalPages(1);
          setTotalBooks(booksResponse.length);
        } else {
          // Unknown format
          setBooks([]);
          setTotalPages(1);
          setTotalBooks(0);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message || "Failed to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage, itemsPerPage, searchQuery, selectedGenreId]);

  // Handle genre selection
  const handleGenreChange = (genreName) => {
    setSelectedGenre(genreName);
    
    // Find the genre ID from the genres array
    if (genreName === "All") {
      setSelectedGenreId(null);
    } else {
      const genre = genres.find(g => g.name === genreName);
      setSelectedGenreId(genre?.id || null);
    }
    
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  };
  
  // Handle search change with debounce effect
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading library..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} className={styles.errorIcon} />
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button 
          className={styles.retryBtn}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover Your Next
            <span className={styles.highlight}> Great Read</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Explore thousands of books, reserve your favorites, and embark on
            new adventures from the comfort of your home.
          </p>
          <div className={styles.heroSearch}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by title or author..."
            />
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalBooks}+</span>
              <span className={styles.statLabel}>Books</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{genres.length - 1}</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>24/7</span>
              <span className={styles.statLabel}>Access</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.bookStack}>
            {featuredBooks.slice(0, 3).map((book, index) => (
              <img
                key={book.id}
                src={book.coverImageUrl || book.coverImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop"}
                alt={book.title}
                className={styles.stackedBook}
                style={{ "--index": index }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {featuredBooks.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Sparkles className={styles.sectionIcon} size={28} />
              <h2>Featured Books</h2>
            </div>
            <button className={styles.viewAllBtn}>
              View All <ChevronRight size={18} />
            </button>
          </div>
          <div className={styles.featuredGrid}>
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <TrendingUp className={styles.sectionIcon} size={28} />
              <h2>New Arrivals</h2>
            </div>
          </div>
          <div className={styles.newArrivalsGrid}>
            {newArrivals.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* All Books Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <h2>Browse Collection</h2>
          </div>
        </div>
        <div className={styles.filterBar}>
          <CategoryFilter
            selected={selectedGenre}
            onChange={handleGenreChange}
            categories={genres.map(g => g.name)}
          />
        </div>
        {books.length > 0 ? (
          <>
            <div className={styles.booksGrid}>
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  className={styles.pageBtn}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
                
                <div className={styles.pageInfo}>
                  Showing page {currentPage} of {totalPages} ({totalBooks} total books)
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.noResults}>
            <p>No books found matching your criteria.</p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
                setSelectedGenreId(null);
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
