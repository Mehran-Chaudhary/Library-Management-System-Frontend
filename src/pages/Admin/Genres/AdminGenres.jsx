import { useState, useEffect, useCallback } from "react";
import { Tag, Plus, Edit2, Trash2, AlertTriangle, Book } from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../../components";
import { genreService } from "../../../services";
import styles from "./AdminGenres.module.css";

const AdminGenres = () => {
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formLoading, setFormLoading] = useState(false);

  const fetchGenres = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await genreService.getGenres();
      setGenres(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setGenres([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  const handleAddGenre = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await genreService.createGenre(formData);
      setShowAddModal(false);
      setFormData({ name: "", description: "" });
      fetchGenres();
    } catch (error) {
      console.error("Error creating genre:", error);
      alert(error.message || "Failed to create genre");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditGenre = async (e) => {
    e.preventDefault();
    if (!selectedGenre) return;
    setFormLoading(true);
    try {
      await genreService.updateGenre(selectedGenre.id, formData);
      setShowEditModal(false);
      setSelectedGenre(null);
      setFormData({ name: "", description: "" });
      fetchGenres();
    } catch (error) {
      console.error("Error updating genre:", error);
      alert(error.message || "Failed to update genre");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGenre = async () => {
    if (!selectedGenre) return;
    setFormLoading(true);
    try {
      await genreService.deleteGenre(selectedGenre.id);
      setShowDeleteModal(false);
      setSelectedGenre(null);
      fetchGenres();
    } catch (error) {
      console.error("Error deleting genre:", error);
      alert(error.message || "Failed to delete genre");
    } finally {
      setFormLoading(false);
    }
  };

  const openEditModal = (genre) => {
    setSelectedGenre(genre);
    setFormData({ name: genre.name || "", description: genre.description || "" });
    setShowEditModal(true);
  };

  const openDeleteModal = (genre) => {
    setSelectedGenre(genre);
    setShowDeleteModal(true);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading genres..." />
      </div>
    );
  }

  return (
    <div className={styles.genresPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h2>Manage Genres</h2>
          <p>{genres.length} genres in catalog</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>
          Add Genre
        </Button>
      </div>

      <div className={styles.genresGrid}>
        {genres.length > 0 ? (
          genres.map((genre) => (
            <div key={genre.id} className={styles.genreCard}>
              <div className={styles.genreIcon}>
                <Tag size={20} />
              </div>
              <div className={styles.genreInfo}>
                <h4>{genre.name}</h4>
                {genre.description && <p>{genre.description}</p>}
                <div className={styles.genreStats}>
                  <Book size={14} />
                  <span>{genre.bookCount || genre._count?.books || 0} books</span>
                </div>
              </div>
              <div className={styles.genreActions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => openEditModal(genre)}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.danger}`}
                  onClick={() => openDeleteModal(genre)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Tag size={48} />
            <h3>No Genres Found</h3>
            <p>Add your first genre to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedGenre(null);
          setFormData({ name: "", description: "" });
        }}
        title={showAddModal ? "Add Genre" : "Edit Genre"}
        size="small"
      >
        <form onSubmit={showAddModal ? handleAddGenre : handleEditGenre}>
          <div className={styles.formGroup}>
            <label>Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Genre name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Genre description (optional)"
              rows={3}
            />
          </div>
          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedGenre(null);
                setFormData({ name: "", description: "" });
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={formLoading}>
              {showAddModal ? "Add Genre" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedGenre(null);
        }}
        title="Delete Genre"
        size="small"
      >
        <div className={styles.deleteConfirm}>
          <AlertTriangle size={48} />
          <h4>Delete &quot;{selectedGenre?.name}&quot;?</h4>
          <p>This action cannot be undone. Associated books will need to be reassigned.</p>
          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedGenre(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteGenre} loading={formLoading}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGenres;
