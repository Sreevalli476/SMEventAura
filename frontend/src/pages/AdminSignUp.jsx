import { useState } from 'react';
import { Link, navigate } from '../lib/router';
import { api } from '../lib/api';
import './Pages.css';

export default function AdminSignUp({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });

  const [state, setState] = useState({
    loading: false,
    error: '',
    success: '',
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
      loading: false,
      error: '',
      success: '',
    });

    if (form.password.length < 8) {
      setState({
        loading: false,
        error: 'Password must contain at least 8 characters.',
        success: '',
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setState({
        loading: false,
        error: 'Passwords do not match.',
        success: '',
      });
      return;
    }

    if (!form.adminCode.trim()) {
      setState({
        loading: false,
        error: 'Admin registration code is required.',
        success: '',
      });
      return;
    }

    setState({
      loading: true,
      error: '',
      success: '',
    });

    try {
      const user = await api('/auth/admin/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          adminCode: form.adminCode,
        }),
      });

      setState({
        loading: false,
        error: '',
        success: 'Administrator account created successfully.',
      });

      if (user) {
        onLogin(user);
        navigate('/admin');
      } else {
        setTimeout(() => {
          navigate('/admin-login');
        }, 1500);
      }
    } catch (err) {
      setState({
        loading: false,
        error:
          err.message ||
          'Unable to create administrator account.',
        success: '',
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
          Create
          <br />
          Admin Account
        </h1>

        <p>
          Create an authorized administrator account to manage
          SM EventAura bookings, customers, gallery content,
          rentals, consultations and business operations.
        </p>

      </div>

      <div className="auth-card">

        <form
          className="auth-form"
          onSubmit={submit}
        >

          <div className="admin-badge">
            🔐 Administrator Registration
          </div>

          <h2>Admin Sign Up</h2>

          <p className="form-note">
            Create a secure administrator account.
          </p>

          <label>
            Full Name

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email Address

            <input
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Phone Number

            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password

            <input
              type="password"
              name="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>

          <label>
            Confirm Password

            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </label>

          <label>
            Admin Registration Code

            <input
              type="password"
              name="adminCode"
              placeholder="Enter authorized admin code"
              value={form.adminCode}
              onChange={handleChange}
              required
            />
          </label>

          {state.error && (
            <div className="alert">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="success-alert">
              {state.success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={state.loading}
          >
            {state.loading
              ? 'Creating Account…'
              : 'Create Admin Account ✦'}
          </button>

          <div className="admin-security-note">
            🔒 Only authorized administrators should create
            administrator accounts.
          </div>

          <p className="switch-auth">
            Already an administrator?{' '}
            <Link to="/admin-login">
              Admin Sign In
            </Link>
          </p>

          <p className="switch-auth">
            Are you a customer?{' '}
            <Link to="/signup">
              Customer Sign Up
            </Link>
          </p>

        </form>

      </div>

    </main>
  );
}