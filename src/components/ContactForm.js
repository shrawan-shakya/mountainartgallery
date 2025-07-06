import React from 'react';
import '../styles/ContactForm.css';

export default function ContactForm() {
  const email = "mag.boudha@gmail.com";
  const phoneNumber = "61450704907";
  const whatsappMessage = encodeURIComponent("Hi! I’m interested in your artwork.");

  return (
    <section id="contact" className="contact-form-section">
      <h2 className="contact-form__title">Contact Us</h2>

      <div className="contact-form__container">
        <div className="contact-form__left">
          <h3>We would love to hear from you.</h3>
          <p>
            We're here to help you find the perfect piece of art! For all enquiries, please send us a note here or email us at <a href={`mailto:${email}`}>{email}</a>.
          </p>
          <p>Thank you!</p>
        </div>

        <div className="contact-form__right">
          <div className="contact-form__form-wrapper">
            <p className="contact-form__form-text">Send me a quick message:</p>
            <form
              action="https://formspree.io/f/xwpbzkyg"
              method="POST"
              className="contact-form"
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

            <div className="contact-form__or">or</div>

            <a
              href={`https://wa.me/${phoneNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-form__btn contact-form__btn--whatsapp"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
