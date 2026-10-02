import { useState } from 'react';
import { Link, navigate } from '../lib/router';
import { api } from '../lib/api';
import './Pages.css';

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [state, setState] = useState({
    loading: false,
    error: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (e) => {
    e.preventDefault();

    setState({
      loading: true,
      error: '',
    });

    try {
      const user = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      if (!user || user.role !== 'ADMIN') {
        throw new Error(
          'This account is not an administrator account.'
        );
      }

      onLogin(user);

      navigate('/admin');
    } catch (err) {
      setState({
        loading: false,
        error:
          err.message ||
          'Invalid administrator email or password.',
      });
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-intro">

        <div className="auth-logo">
          <strong>SM</strong>
          <span>EventAura</span>
        </div>

        <span className="eyebrow">
          ✦ ADMINISTRATION ✦
        </span>

        <h1>
          Welcome
          <br />
          Administrator
        </h1>

        <p>
          Access the SM EventAura management portal to manage
          bookings, customers, gallery, rentals and consultations.
        </p>

      </div>

      <div className="auth-card">

        <form
          className="auth-form"
          onSubmit={submit}
        >

          <div className="admin-badge">
            🔐 Administrator Access
          </div>

          <h2>Admin Sign In</h2>

          <p className="form-note">
            Sign in with your authorized administrator account.
          </p>

          <label>
            Administrator Email

            <input
              type="email"
              name="email"
              placeholder="admin@smeventaura.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Enter administrator password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          {state.error && (
            <div className="alert">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={state.loading}
          >
            {state.loading
              ? 'Signing In…'
              : 'Admin Sign In ✦'}
          </button>

          <div className="admin-security-note">
            🔒 This area is restricted to authorized
            administrators.
          </div>

          <p className="switch-auth">
            Don't have an administrator account?{' '}
            <Link to="/admin-signup">
              Create Admin Account
            </Link>
          </p>

          <p className="switch-auth">
            Are you a customer?{' '}
            <Link to="/login">
              Customer Login
            </Link>
          </p>

        </form>

      </div>

    </main>
  );
}