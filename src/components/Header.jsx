function Header() {
  return (
    <header className="header">
      <div className="logo">
        DEV<span>@</span>Deakin
      </div>

      <nav>
        <a href="#home">Home</a>
        <a href="#articles">Articles</a>
        <a href="#tutorials">Tutorials</a>
        <a href="#about">About</a>
      </nav>

      <button className="login-button">
        Login
      </button>
    </header>
  );
}

export default Header;