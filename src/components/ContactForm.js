import React from 'react';

export default function ContactForm() {
  return (
    <section id="contact" className="contact">
      <h2>Contact Me</h2>
      <form action="https://formspree.io/f/YOUR-ID" method="POST">
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="_replyto" placeholder="Your Email" required />
        <textarea name="message" placeholder="Your Message..." rows="5" required />
        <button type="submit">Send Inquiry</button>
      </form>
    </section>
  );
}
