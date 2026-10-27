import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { apiRequest, getToken } from './api.js';

const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!getToken()) { setUser(null); setLoading(false); return; }
    try {
      const result = await apiRequest('/auth/me');
      setUser(result.user);
    } catch {
      localStorage.removeItem('d1_token');
      setUser(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { refreshUser(); }, []);

  const value = useMemo(() => ({
    user, loading, refreshUser,
    async register(name, email, password) {
      const result = await apiRequest('/auth/register', {
        method: 'POST', body: JSON.stringify({ name, email, password })
      });
      localStorage.setItem('d1_token', result.token);
      setUser(result.user);
    },
    async login(email, password) {
      const result = await apiRequest('/auth/login', {
        method: 'POST', body: JSON.stringify({ email, password })
      });
      localStorage.setItem('d1_token', result.token);
      setUser(result.user);
    },
    logout() {
      localStorage.removeItem('d1_token');
      setUser(null);
    },
    async upgrade(demoPayment) {
      const result = await apiRequest('/subscription/upgrade', {
        method: 'POST', body: JSON.stringify(demoPayment)
      });
      setUser(result.user);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };
  return <header className="topbar">
    <Link className="brand" to="/"><span className="brand-mark">D</span> DEV@Deakin</Link>
    <nav>
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/pricing">Pricing</NavLink>
      {user ? <>
        <span className="nav-user">{user.name} · {user.plan} plan</span>
        <button className="button button-quiet button-small" onClick={handleLogout}>Log out</button>
      </> : <>
        <NavLink to="/login">Log in</NavLink>
        <Link className="button button-small" to="/register">Create account</Link>
      </>}
    </nav>
  </header>;
}

function Home() {
  const { user } = useAuth();
  return <main>
    <section className="hero">
      <div className="eyebrow"><span className="dot" /> A community for curious builders</div>
      <h1>Share ideas.<br/><span>Build what’s next.</span></h1>
      <p className="hero-copy">A place to publish posts, discover other creators, and choose the plan that fits your work.</p>
      <div className="hero-actions">
        <Link className="button" to="/pricing">Explore plans <span aria-hidden="true">→</span></Link>
        {!user && <Link className="button button-outline" to="/register">Get started</Link>}
      </div>
      <div className="hero-stats">
        <div><strong>Simple</strong><span>plan options</span></div>
        <div><strong>Secure</strong><span>account sessions</span></div>
        <div><strong>Flexible</strong><span>creator workflow</span></div>
      </div>
    </section>
    <section className="feature-grid">
      <article className="feature-card"><div className="feature-icon">✦</div><h3>Publish your ideas</h3><p>Share projects, notes and useful discoveries with the community.</p></article>
      <article className="feature-card"><div className="feature-icon">⌘</div><h3>Find your flow</h3><p>Keep your account and plan status together in one clear place.</p></article>
      <article className="feature-card"><div className="feature-icon">↗</div><h3>Grow at your pace</h3><p>Compare Free and Paid demo plans whenever your needs change.</p></article>
    </section>
  </main>;
}

function AuthPage({ mode }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isRegister = mode === 'register';

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      if (isRegister) await register(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
      navigate('/pricing');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <main className="auth-wrap">
    <section className="auth-card">
      <div className="eyebrow">YOUR DEV@DEAKIN ACCOUNT</div>
      <h1>{isRegister ? 'Create your account' : 'Welcome back'}</h1>
      <p className="muted">{isRegister ? 'Join the community and start with the Free plan.' : 'Log in to manage your subscription.'}</p>
      <form onSubmit={submit} className="form-stack">
        {isRegister && <label>Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name" minLength="2" maxLength="80" required /></label>}
        <label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'} minLength="8" required /></label>
        {isRegister && <p className="field-note">Use at least 8 characters.</p>}
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <button className="button button-full" disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
      </form>
      <p className="auth-switch">{isRegister ? 'Already have an account?' : 'New here?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create an account'}</Link></p>
    </section>
  </main>;
}

const plans = [
  { name: 'Free', price: '$0', period: 'forever', description: 'A good place to start sharing.', features: ['Create an account', 'Publish up to 5 posts per month', 'Upload images up to 5 MB', 'Browse community posts'], currentLabel: 'Start for free' },
  { name: 'Paid', price: '$9', period: 'per month · demo pricing', description: 'More room for active creators.', features: ['Everything in Free', 'Publish up to 50 posts per month', 'Upload images up to 25 MB', 'Priority community support'], featured: true }
];

function Pricing() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();

  function startUpgrade() {
    setNotice('');
    if (!user) { navigate('/login', { state: { from: '/pricing' } }); return; }
    if (user.plan === 'Paid') { setNotice('Your account is already on the Paid plan.'); return; }
    setShowModal(true);
  }

  return <main className="page-shell">
    <section className="page-heading">
      <div className="eyebrow">PLANS & PRICING</div>
      <h1>Room to create, <span>at every stage.</span></h1>
      <p>Choose a plan that works for you. The prices and features below are demonstration content for this project.</p>
      {user && <div className="current-plan">Your current plan: <strong>{user.plan}</strong></div>}
    </section>
    {notice && <div className="alert alert-info">{notice}</div>}
    <section className="plans-grid">
      {plans.map(plan => <article key={plan.name} className={`plan-card ${plan.featured ? 'plan-featured' : ''}`}>
        {plan.featured && <div className="popular-label">FOR ACTIVE CREATORS</div>}
        <h2>{plan.name}</h2><p className="plan-description">{plan.description}</p>
        <div className="price">{plan.price}<span> / {plan.period}</span></div>
        <div className="plan-divider" />
        <p className="includes">WHAT’S INCLUDED</p>
        <ul className="feature-list">{plan.features.map(feature=><li key={feature}><span>✓</span>{feature}</li>)}</ul>
        {plan.name === 'Free' ? (
          <button className="button button-outline button-full" disabled={user?.plan === 'Free'} onClick={()=>navigate('/register')}>
            {user?.plan === 'Free' ? 'Your current plan' : 'Create a free account'}
          </button>
        ) : (
          <button className="button button-full" onClick={startUpgrade}>
            {user?.plan === 'Paid' ? 'Current Paid plan' : 'Upgrade to Paid'}
          </button>
        )}
      </article>)}
    </section>
    <p className="fine-print">Demo only: no actual payment is taken. The upgrade form does not request a real card number or security code.</p>
    {showModal && <UpgradeModal onClose={()=>setShowModal(false)} onSuccess={()=>{
      setShowModal(false);
      setNotice('Success — your account is now on the Paid plan.');
    }} />}
  </main>;
}

function UpgradeModal({ onClose, onSuccess }) {
  const { upgrade } = useAuth();
  const [fullName, setFullName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [reference, setReference] = useState('');
  const [lastFour, setLastFour] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      await upgrade({ fullName: fullName.trim(), billingEmail: billingEmail.trim(), paymentReference: reference.trim(), cardLastFour: lastFour });
      onSuccess();
      window.dispatchEvent(new CustomEvent('d1-plan-updated'));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
      <button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
      <div className="eyebrow">PLAN UPGRADE</div>
      <h2 id="upgrade-title">Move to Paid</h2>
      <p className="muted">Enter demo details to validate the form. No payment is processed.</p>
      <form className="form-stack" onSubmit={submit}>
        <label>Name on billing profile<input value={fullName} onChange={e=>setFullName(e.target.value)} minLength="2" maxLength="80" required /></label>
        <label>Billing email<input type="email" value={billingEmail} onChange={e=>setBillingEmail(e.target.value)} required /></label>
        <label>Demo payment reference<input value={reference} onChange={e=>setReference(e.target.value)} placeholder="e.g. DEMO-2026-001" pattern="[A-Za-z0-9-]{6,40}" required /></label>
        <label>Last four digits (demo only)<input inputMode="numeric" value={lastFour} onChange={e=>setLastFour(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="1234" pattern="\d{4}" minLength="4" maxLength="4" required /></label>
        <p className="field-note">Do not enter a real card number, expiry date or CVV.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <button className="button button-full" disabled={busy}>{busy ? 'Updating plan…' : 'Confirm demo upgrade'}</button>
        <button type="button" className="button button-quiet button-full" onClick={onClose}>Cancel</button>
      </form>
    </section>
  </div>;
}

function NotFound() {
  return <main className="empty-state"><h1>Page not found</h1><Link to="/" className="button">Back home</Link></main>;
}

function AppInner() {
  const { refreshUser } = useAuth();
  useEffect(() => {
    const refresh = () => refreshUser();
    window.addEventListener('d1-plan-updated', refresh);
    return () => window.removeEventListener('d1-plan-updated', refresh);
  }, [refreshUser]);

  return <div className="app-shell"><Header /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/register" element={<AuthPage mode="register" />} />
    <Route path="*" element={<NotFound />} />
  </Routes><footer><span>© 2026 DEV@Deakin · D1 Subscription demo</span><span>Built for learning and demonstration</span></footer></div>;
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
