import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Mail, Clock, CheckCircle, Eye, X } from "lucide-react";
import { Button, Modal, LoadingSpinner } from "../../../components";
import { adminService } from "../../../services";
import { formatDate } from "../../../utils";
import styles from "./AdminMessages.module.css";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPendingOnly, setShowPendingOnly] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = showPendingOnly
        ? await adminService.getPendingMessages()
        : await adminService.getContactMessages();
      setMessages(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [showPendingOnly]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkRead = async (messageId) => {
    setActionLoading(true);
    try {
      await adminService.markMessageRead(messageId);
      fetchMessages();
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseMessage = async (messageId) => {
    setActionLoading(true);
    try {
      await adminService.closeMessage(messageId);
      setShowDetailModal(false);
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Error closing message:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openDetail = (message) => {
    setSelectedMessage(message);
    setShowDetailModal(true);
    if (!message.isRead) {
      handleMarkRead(message.id);
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className={styles.messagesPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h2>Contact Messages</h2>
          <p>{messages.length} {showPendingOnly ? "pending" : "total"} messages</p>
        </div>
        <div className={styles.filterToggle}>
          <button
            className={`${styles.toggleBtn} ${showPendingOnly ? styles.active : ""}`}
            onClick={() => setShowPendingOnly(true)}
          >
            <Clock size={16} />
            Pending
          </button>
          <button
            className={`${styles.toggleBtn} ${!showPendingOnly ? styles.active : ""}`}
            onClick={() => setShowPendingOnly(false)}
          >
            <Mail size={16} />
            All
          </button>
        </div>
      </div>

      <div className={styles.messagesList}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.messageCard} ${!message.isRead ? styles.unread : ""}`}
              onClick={() => openDetail(message)}
            >
              <div className={styles.messageHeader}>
                <div className={styles.sender}>
                  <div className={styles.senderAvatar}>
                    {message.name?.[0] || "U"}
                  </div>
                  <div className={styles.senderInfo}>
                    <span className={styles.senderName}>{message.name}</span>
                    <span className={styles.senderEmail}>{message.email}</span>
                  </div>
                </div>
                <div className={styles.messageDate}>
                  {formatDate(message.createdAt)}
                </div>
              </div>
              <div className={styles.messagePreview}>
                <h4>{message.subject || "No Subject"}</h4>
                <p>{message.message?.slice(0, 120)}...</p>
              </div>
              <div className={styles.messageStatus}>
                {message.isClosed ? (
                  <span className={styles.closedBadge}>
                    <CheckCircle size={14} />
                    Closed
                  </span>
                ) : message.isRead ? (
                  <span className={styles.readBadge}>
                    <Eye size={14} />
                    Read
                  </span>
                ) : (
                  <span className={styles.newBadge}>New</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <MessageSquare size={48} />
            <h3>No Messages</h3>
            <p>{showPendingOnly ? "No pending messages" : "No messages yet"}</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedMessage(null);
        }}
        title="Message Details"
        size="medium"
      >
        {selectedMessage && (
          <div className={styles.detailModal}>
            <div className={styles.detailHeader}>
              <div className={styles.detailSender}>
                <div className={styles.detailAvatar}>
                  {selectedMessage.name?.[0] || "U"}
                </div>
                <div>
                  <h4>{selectedMessage.name}</h4>
                  <p>{selectedMessage.email}</p>
                </div>
              </div>
              <span className={styles.detailDate}>
                {formatDate(selectedMessage.createdAt)}
              </span>
            </div>

            <div className={styles.detailSubject}>
              <strong>Subject:</strong> {selectedMessage.subject || "No Subject"}
            </div>

            <div className={styles.detailMessage}>
              {selectedMessage.message}
            </div>

            <div className={styles.detailActions}>
              {!selectedMessage.isClosed && (
                <Button
                  onClick={() => handleCloseMessage(selectedMessage.id)}
                  loading={actionLoading}
                >
                  <X size={16} />
                  Close Message
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminMessages;
