
import { Link } from "react-router-dom";

export default function Login() {
  function handleLogin(event) {
    event.preventDefault();
    alert(
      "This demonstration form does not authenticate users. Connect your existing authentication service to enable login."
    );
  }

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Login</h1>

        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
        />

        <button className="primary-button" type="submit">
          Login
        </button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}
