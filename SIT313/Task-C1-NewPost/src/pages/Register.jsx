
import { Link } from "react-router-dom";

export default function Register() {
  function handleRegister(event) {
    event.preventDefault();
    alert(
      "This demonstration form does not create accounts. Connect your existing authentication service to enable registration."
    );
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h1>Register</h1>

        <label htmlFor="register-name">Full Name</label>
        <input
          id="register-name"
          type="text"
          required
          autoComplete="name"
        />

        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          required
          autoComplete="email"
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <button className="primary-button" type="submit">
          Register
        </button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </main>
  );
}
