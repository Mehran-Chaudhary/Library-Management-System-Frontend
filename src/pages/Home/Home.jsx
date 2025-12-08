import { useState, useEffect, useMemo } from "react";
import {
  BookCard,
  SearchBar,
  CategoryFilter,
  LoadingSpinner,
} from "../../components";
import { books, getFeaturedBooks, getNewArrivals } from "../../data";
import { Sparkles, TrendingUp, ChevronRight } from "lucide-react";
import styles from "./Home.module.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const featuredBooks = useMemo(() => getFeaturedBooks(), []);
  const newArrivals = useMemo(() => getNewArrivals(), []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading library..." />
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
              <span className={styles.statValue}>12</span>
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
                src={book.coverImage}
                alt={book.title}
                className={styles.stackedBook}
                style={{ "--index": index }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
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
