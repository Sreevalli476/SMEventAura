import { useState } from "react";
import { Link, navigate } from "../lib/router";
import { api } from "../lib/api";
import "./Pages.css";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [state, setState] = useState({
    loading: false,
    error: "",
  });

  const submit = async (e) => {
    e.preventDefault();

    setState({
      loading: true,
      error: "",
    });

    try {
      const user = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      // Only CUSTOMER accounts can use this login page
      if (user.role !== "CUSTOMER") {
        await api("/auth/logout", {
          method: "POST",
        }).catch(() => {});

        setState({
          loading: false,
          error: "This login is only for customers. Please use Admin Login.",
        });

        return;
      }

      onLogin(user);
      navigate("/dashboard");
    } catch (err) {
      setState({
        loading: false,
        error: err.message || "Invalid email or password.",
      });
    }
  };

  return (
    <AuthShell
      label="CUSTOMER LOGIN"
      title={
        <>
          Welcome
          <br />
          Back
        </>
      }
      description="Sign in to manage your celebrations, consultations, and decoration bookings."
    >
      <form className="auth-form" onSubmit={submit}>
        <h2>Customer Sign In</h2>

        <p className="form-note">
          Sign in to your SM EventAura customer account.
        </p>

        <label>
          Email Address
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            autoComplete="email"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            autoComplete="current-password"
          />
        </label>

        {state.error && <div className="alert">{state.error}</div>}

        <button
          className="btn btn-primary auth-submit"
          type="submit"
          disabled={state.loading}
        >
          {state.loading ? "Signing In…" : "Customer Sign In ✦"}
        </button>

        <p className="switch-auth">
          Don't have a customer account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>

        <p className="switch-auth">
          Are you an administrator?{" "}
          <Link to="/admin-login">Admin Login</Link>
        </p>
      </form>
    </AuthShell>
  );
}

function AuthShell({ label, title, description, children }) {
  return (
    <main className="auth-page">
      <div className="auth-intro">
        <div className="auth-logo">
          SM <span>EventAura</span>
        </div>

        <span className="eyebrow">✦ {label} ✦</span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      <div className="auth-card">{children}</div>
    </main>
  );
}

export { AuthShell };