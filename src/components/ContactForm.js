import React from 'react';
import '../styles/ContactForm.css'; // Adjust path if needed

export default function ContactForm() {
  const email = "mag.boudha@gmail.com";
  const phoneNumber = "61450704907"; // no plus sign
  const whatsappMessage = encodeURIComponent("Hi! I’m interested in your artwork.");

  return (
    <section id="contact" className="contact-form-section">
      <h2 className="contact-form__title">Contact Us</h2>

      <div className="contact-form__container">
        <div className="contact-form__left">
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
            <p className="contact-form__form-text">
              Or send me a quick message here:
            </p>
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
          </div>
        </div>

        <div className="contact-form__right">
          <h3>We would love to hear from you.</h3>
          <p>
            We're here to help you find the perfect piece of art! For all enquiries, please send us a note here or email us at <a href="mailto:mag.boudha@gmail.com">mag.boudha@gmail.com</a>.
          </p>
          <p>Thank you!</p>
        </div>
      </div>
    </section>
  );
}
