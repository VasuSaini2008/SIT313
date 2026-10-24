
import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
      }

      setStatus("success");
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.message === "Failed to fetch"
          ? "Unable to connect to the server. Please try again."
          : error.message
      );
    }
  }

  return (
    <section className="newsletter-section" id="newsletter">
      <h2>Sign up for our daily insider</h2>

      <p className="newsletter-description">
        Get the latest updates and news delivered to your inbox.
      </p>

      <form className="newsletter-form" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="newsletter-email">
          Your email address
        </label>

        <input
          id="newsletter-email"
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          disabled={status === "loading"}
        />

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`form-message ${status}`}
          role="status"
          aria-live="polite"
        >
          {status === "success" && <CheckCircle2 size={17} />}
          {message}
        </p>
      )}

      <p className="privacy-note">
        Join our community and stay up to date.
      </p>
    </section>
  );
}
