import { useState, useEffect, useCallback } from "react";
import { Search, UserCircle, Plus, Edit2, Trash2, AlertTriangle, Book } from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../../components";
import { authorService } from "../../../services";
import styles from "./AdminAuthors.module.css";

const AdminAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [formData, setFormData] = useState({ name: "", bio: "" });
  const [formLoading, setFormLoading] = useState(false);

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await authorService.getAuthors(search ? { search } : {});
      setAuthors(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching authors:", error);
      setAuthors([]);
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await authorService.createAuthor(formData);
      setShowAddModal(false);
      setFormData({ name: "", bio: "" });
      fetchAuthors();
    } catch (error) {
      console.error("Error creating author:", error);
      alert(error.message || "Failed to create author");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAuthor = async (e) => {
    e.preventDefault();
    if (!selectedAuthor) return;
    setFormLoading(true);
    try {
      await authorService.updateAuthor(selectedAuthor.id, formData);
      setShowEditModal(false);
      setSelectedAuthor(null);
      setFormData({ name: "", bio: "" });
      fetchAuthors();
    } catch (error) {
      console.error("Error updating author:", error);
      alert(error.message || "Failed to update author");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteAuthor = async () => {
    if (!selectedAuthor) return;
    setFormLoading(true);
    try {
      await authorService.deleteAuthor(selectedAuthor.id);
      setShowDeleteModal(false);
      setSelectedAuthor(null);
      fetchAuthors();
    } catch (error) {
      console.error("Error deleting author:", error);
      alert(error.message || "Failed to delete author");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (author) => {
    setSelectedAuthor(author);
    setFormData({ name: author.name || "", bio: author.bio || "" });
    setShowEditModal(true);
  };

  const openDeleteModal = (author) => {
    setSelectedAuthor(author);
    setShowDeleteModal(true);
  };

  if (isLoading && authors.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading authors..." />
      </div>
    );
  }

  return (
    <div className={styles.authorsPage}>
      <div className={styles.pageHeader}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Author
        </Button>
      </div>

      <div className={styles.authorsGrid}>
        {authors.length > 0 ? (
          authors.map((author) => (
            <div key={author.id} className={styles.authorCard}>
              <div className={styles.authorAvatar}>
                <UserCircle size={32} />
              </div>
              <div className={styles.authorInfo}>
                <h4>{author.name}</h4>
                {author.bio && <p>{author.bio}</p>}
                <div className={styles.authorStats}>
                  <Book size={14} />
                  <span>{author.bookCount || author._count?.books || 0} books</span>
                </div>
              </div>
              <div className={styles.authorActions}>
                <button className={styles.actionBtn} onClick={() => openEditModal(author)}>
                  <Edit2 size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.danger}`}
                  onClick={() => openDeleteModal(author)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <UserCircle size={48} />
            <h3>No Authors Found</h3>
            <p>Add your first author to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedAuthor(null);
          setFormData({ name: "", bio: "" });
        }}
        title={showAddModal ? "Add Author" : "Edit Author"}
        size="small"
      >
        <form onSubmit={showAddModal ? handleAddAuthor : handleEditAuthor}>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Author name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Short biography (optional)"
              rows={4}
            />
          </div>
          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedAuthor(null);
                setFormData({ name: "", bio: "" });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              {showAddModal ? "Add Author" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAuthor(null);
        }}
        title="Delete Author"
        size="small"
      >
        <div className={styles.deleteConfirm}>
          <AlertTriangle size={48} />
          <h4>Delete &quot;{selectedAuthor?.name}&quot;?</h4>
          <p>This action cannot be undone.</p>
          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedAuthor(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAuthor} loading={formLoading}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAuthors;
