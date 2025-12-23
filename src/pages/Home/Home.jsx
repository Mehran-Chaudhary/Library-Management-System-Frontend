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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [booksResponse, featured, arrivals, genreList] = await Promise.all([
          bookService.getBooks(),
          bookService.getFeaturedBooks(10),
          bookService.getNewArrivals(10),
          genreService.getGenres().catch(() => []),
        ]);

        // API interceptor now extracts data directly, handle both array and paginated response
        const booksData = Array.isArray(booksResponse) ? booksResponse : (booksResponse?.books || booksResponse || []);
        setBooks(booksData);
        setFeaturedBooks(Array.isArray(featured) ? featured : []);
        setNewArrivals(Array.isArray(arrivals) ? arrivals : []);
        
        // Prepare genre list with "All" as first option
        const genreArray = Array.isArray(genreList) ? genreList : [];
        const genreNames = genreArray.map(g => g.name) || [];
        setGenres(["All", ...genreNames]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter books based on search and genre
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const title = book.title || "";
      const authorName = book.authors?.map(a => a.name).join(" ") || book.author || "";
      
      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const bookGenre = book.genres?.map(g => g.name) || [book.genre];
      const matchesGenre =
        selectedGenre === "All" || bookGenre.includes(selectedGenre);
      
      return matchesSearch && matchesGenre;
    });
  }, [books, searchQuery, selectedGenre]);

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
              onChange={setSearchQuery}
              placeholder="Search by title or author..."
            />
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{books.length}+</span>
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
            onChange={setSelectedGenre}
            categories={genres}
          />
        </div>
        {filteredBooks.length > 0 ? (
          <div className={styles.booksGrid}>
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No books found matching your criteria.</p>
            <button
              className={styles.resetBtn}
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
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
