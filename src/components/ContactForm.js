import React, { useState } from 'react';
import '../styles/ContactForm.css'; // Adjust path if your CSS is elsewhere

export default function ContactForm() {
  const email = "mag.boudha@gmail.com";
  const phoneNumber = "61450704907";
  const whatsappMessage = encodeURIComponent("Hi! I’m interested in your artwork.");

  const [messageSent, setMessageSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessageSent(false);

    const formData = new FormData(e.target);

    try {
      const response = await fetch('https://formspree.io/f/xwpbzkyg', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        e.target.reset();
        setMessageSent(true);
        setTimeout(() => setMessageSent(false), 4000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  return (
    <section id="contact" className="contact-form-section">
      <h2 className="contact-form__title">Contact Me</h2>

      <div className="contact-form__options">
        <a
          href={`mailto:${email}?subject=Artwork Enquiry`}
          className="contact-form__btn contact-form__btn--email"
        >
          Email Me
        </a>

        <a
          href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-form__btn contact-form__btn--whatsapp"
        >
          Message on WhatsApp
        </a>
      </div>

      <div className="contact-form__form-wrapper">
        <p className="contact-form__form-text">Or send me a quick message here:</p>
        <form
          onSubmit={handleSubmit}
          className="contact-form"
          noValidate
        >
          <input
            type="email"
            name="_replyto"
            placeholder="Your Email"
            required
            className="contact-form__input"
          />
          <textarea
            name="message"
            placeholder="Your Message..."
            rows="5"
            required
            className="contact-form__textarea"
          />
          <button type="submit" className="contact-form__submit-btn">
            Send Enquiry
          </button>
        </form>

        {messageSent && (
          <p className="contact-form__success-message">Message sent successfully!</p>
        )}
        {error && (
          <p className="contact-form__error-message">{error}</p>
        )}
      </div>
    </section>
  );
}
