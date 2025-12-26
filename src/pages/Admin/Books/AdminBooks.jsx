import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Book,
  AlertTriangle,
} from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../../components";
import { adminService, bookService, genreService, authorService } from "../../../services";
import styles from "./AdminBooks.module.css";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publisher: "",
    publicationYear: new Date().getFullYear(),
    pageCount: 0,
    description: "",
    coverImageUrl: "",
    totalCopies: 1,
    genreId: "",
    authorIds: [],
    isFeatured: false,
    isNewArrival: false,
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (genreFilter) params.genreId = genreFilter;

      const response = await adminService.getBooks(params);
      
      if (Array.isArray(response)) {
        setBooks(response);
        setTotalPages(1);
        setTotalItems(response.length);
      } else {
        // Backend returns { books: [...], total, page, totalPages }
        setBooks(response?.books || response?.items || []);
        setTotalPages(response?.totalPages || 1);
        setTotalItems(response?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, genreFilter]);

  const fetchGenresAndAuthors = useCallback(async () => {
    try {
      const [genresData, authorsData] = await Promise.all([
        genreService.getGenres().catch(() => []),
        authorService.getAuthors().catch(() => []),
      ]);
      setGenres(Array.isArray(genresData) ? genresData : []);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);
    } catch (error) {
      console.error("Error fetching genres/authors:", error);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchGenresAndAuthors();
  }, [fetchGenresAndAuthors]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await bookService.createBook(formData);
      setShowAddModal(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error creating book:", error);
      alert(error.message || "Failed to create book");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;
    setFormLoading(true);
    try {
      await bookService.updateBook(selectedBook.id, formData);
      setShowEditModal(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
      alert(error.message || "Failed to update book");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    setFormLoading(true);
    try {
      await bookService.deleteBook(selectedBook.id);
      setShowDeleteModal(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert(error.message || "Failed to delete book");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || "",
      isbn: book.isbn || "",
      publisher: book.publisher || "",
      publicationYear: book.publicationYear || new Date().getFullYear(),
      pageCount: book.pageCount || 0,
      description: book.description || "",
      coverImageUrl: book.coverImageUrl || "",
      totalCopies: book.totalCopies || 1,
      genreId: book.genre?.id || book.genreId || "",
      authorIds: book.authors?.map((a) => a.id) || [],
      isFeatured: book.isFeatured || false,
      isNewArrival: book.isNewArrival || false,
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (book) => {
    setSelectedBook(book);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      isbn: "",
      publisher: "",
      publicationYear: new Date().getFullYear(),
      pageCount: 0,
      description: "",
      coverImageUrl: "",
      totalCopies: 1,
      genreId: "",
      authorIds: [],
      isFeatured: false,
      isNewArrival: false,
    });
    setSelectedBook(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleAuthorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData((prev) => ({ ...prev, authorIds: selectedOptions }));
  };

  const getStatusClass = (status) => {
    const statusMap = {
      available: styles.available,
      reserved: styles.reserved,
      borrowed: styles.borrowed,
      unavailable: styles.unavailable,
    };
    return statusMap[status?.toLowerCase()] || "";
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading books..." />
      </div>
    );
  }

  return (
    <div className={styles.booksPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by title or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className={styles.filterGroup}>
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="borrowed">Borrowed</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              className={styles.filterSelect}
              value={genreFilter}
              onChange={(e) => {
                setGenreFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Book
        </Button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        {books.length > 0 ? (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>ISBN</th>
                  <th>Genre</th>
                  <th>Copies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>
                      <div className={styles.bookInfo}>
                        <img
                          src={book.coverImageUrl || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=150&fit=crop"}
                          alt={book.title}
                          className={styles.bookCover}
                        />
                        <div className={styles.bookDetails}>
                          <h4>{book.title}</h4>
                          <p>{book.authors?.map((a) => a.name).join(", ") || "Unknown"}</p>
                        </div>
                      </div>
                    </td>
                    <td>{book.isbn || "N/A"}</td>
                    <td>{book.genre?.name || "General"}</td>
                    <td>
                      {book.availableCopies ?? 0}/{book.totalCopies ?? 0}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${getStatusClass(book.status)}`}>
                        {book.status || "Available"}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          onClick={() => openEditModal(book)}
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => openDeleteModal(book)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, totalItems)} of{" "}
                {totalItems} books
              </span>
              <div className={styles.paginationControls}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`${styles.pageBtn} ${page === pageNum ? styles.active : ""}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <Book size={48} />
            <h3>No Books Found</h3>
            <p>Try adjusting your filters or add a new book</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          resetForm();
        }}
        title={showAddModal ? "Add New Book" : "Edit Book"}
        size="large"
      >
        <form onSubmit={showAddModal ? handleAddBook : handleEditBook}>
          <div className={styles.modalBody}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>ISBN</label>
                <input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Publisher</label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Publication Year</label>
                <input
                  type="number"
                  name="publicationYear"
                  value={formData.publicationYear}
                  onChange={handleInputChange}
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Page Count</label>
                <input
                  type="number"
                  name="pageCount"
                  value={formData.pageCount}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Total Copies *</label>
                <input
                  type="number"
                  name="totalCopies"
                  value={formData.totalCopies}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Genre</label>
                <select
                  name="genreId"
                  value={formData.genreId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Genre</option>
                  {genres.map((genre) => (
                    <option key={genre.id} value={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Authors</label>
                <select
                  multiple
                  value={formData.authorIds}
                  onChange={handleAuthorChange}
                  style={{ minHeight: "80px" }}
                >
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formGroup + " " + styles.full}>
              <label>Cover Image URL</label>
              <input
                type="url"
                name="coverImageUrl"
                value={formData.coverImageUrl}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </div>

            <div className={styles.formGroup + " " + styles.full}>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Book description..."
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                <label htmlFor="isFeatured">Featured Book</label>
              </div>
              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  name="isNewArrival"
                  id="isNewArrival"
                  checked={formData.isNewArrival}
                  onChange={handleInputChange}
                />
                <label htmlFor="isNewArrival">New Arrival</label>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              {showAddModal ? "Add Book" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedBook(null);
        }}
        title="Delete Book"
        size="small"
      >
        <div className={styles.deleteConfirm}>
          <AlertTriangle size={48} />
          <h4>Are you sure?</h4>
          <p>
            This will permanently delete &quot;{selectedBook?.title}&quot;. This action
            cannot be undone.
          </p>
          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedBook(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteBook} loading={formLoading}>
              Delete Book
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminBooks;
