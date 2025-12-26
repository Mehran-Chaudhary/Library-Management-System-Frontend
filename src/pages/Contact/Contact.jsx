import { useState } from "react";
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button, Input } from "../../components";
import { contactService } from "../../services";
import { useAuth } from "../../context";
import { validateForm } from "../../utils";
import styles from "./Contact.module.css";

const Contact = () => {
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateForm(formData, [
      "fullName",
      "email",
      "subject",
      "message",
    ]);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Use authenticated endpoint if logged in, public otherwise
      if (isAuthenticated) {
        // For authenticated users, only send subject and message
        const payload = {
          subject: formData.subject,
          message: formData.message,
        };
        console.log("Sending authenticated message:", payload);
        await contactService.sendAuthenticatedMessage(payload);
      } else {
        // For public users, send full contact info
        // Backend expects 'name' and 'email' fields
        await contactService.sendContactMessage({
          name: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        });
      }
      
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error sending message:", err);
      setSubmitError(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h2>Message Sent!</h2>
          <p>
            Thank you for reaching out. Our librarian will get back to you
            within 24-48 hours.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: user ? `${user.firstName} ${user.lastName}` : "",
                email: user?.email || "",
                subject: "",
                message: "",
              });
            }}
          >
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Contact Librarian</h1>
        <p>Have questions? We&apos;re here to help!</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <h2>Send us a Message</h2>
            
            {submitError && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Mehran Akhtar"
                error={errors.fullName}
                fullWidth
              />

              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="mehran.dev.au@gmail.com"
                error={errors.email}
                fullWidth
              />

              <Input
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="How can we help?"
                error={errors.subject}
                fullWidth
              />

              <div className={styles.textareaWrapper}>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className={`${styles.textarea} ${
                    errors.message ? styles.hasError : ""
                  }`}
                />
                {errors.message && (
                  <span className={styles.error}>{errors.message}</span>
                )}
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                fullWidth
                size="large"
                icon={Send}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Library Information</h3>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <MapPin size={20} />
              </div>
              <div>
                <h4>Address</h4>
                <p>
                  Air University Islamabad
                  <br />
                  Pakistan
                </p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Phone size={20} />
              </div>
              <div>
                <h4>Phone</h4>
                <p>+92 312 444 7335</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Mail size={20} />
              </div>
              <div>
                <h4>Email</h4>
                <p>mehran.dev.au@gmail.com</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <Clock size={20} />
              </div>
              <div>
                <h4>Hours</h4>
                <p>
                  Mon - Fri: 9:00 AM - 8:00 PM
                  <br />
                  Sat - Sun: 10:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className={styles.faqCard}>
            <h3>Frequently Asked Questions</h3>
            <div className={styles.faq}>
              <h4>How do I get a library membership?</h4>
              <p>
                Visit our library with a valid ID and proof of address.
                Membership is free for all residents.
              </p>
            </div>
            <div className={styles.faq}>
              <h4>What is the borrowing limit?</h4>
              <p>
                You can borrow up to 5 books at a time for a period of 7, 14, or
                21 days.
              </p>
            </div>
            <div className={styles.faq}>
              <h4>Can I renew my books?</h4>
              <p>
                Yes, you can extend once for an additional 7 days if no one else
                has reserved the book.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
