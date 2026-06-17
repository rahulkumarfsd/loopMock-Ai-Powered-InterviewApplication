import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, LogIn } from "lucide-react";

import useAuthStore from "../store/authStore";

const T = {
  canvas: "#FCFCFC",
  surface: "#FFFFFF",
  muted: "#F4F4F5",
  ink: "#262626",
  inkMuted: "#737373",
  brand: "#1E2433",
  brandFg: "#FCFCFC",
  border: "rgba(0,0,0,0.08)",
  danger: "#EF4444",
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    loading(true);

    const ok = await register(form);

    setLoading(false);

    if (ok) navigate("/dashboard");
    else {
      setError("Could not create account. Email may already be registered.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const inputStyle = {
    width: "100%",
    padding: "13px 14px 13px 42px",
    borderRadius: 12,
    border: `1px solid ${T.border}`,
    background: T.surface,
    fontSize: 14,
    color: T.ink,
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.canvas,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <nav
        style={{
          padding: "14px 18px",
          minHeight: 64,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 20,
            color: T.ink,
            letterSpacing: "-0.5px",
          }}
        >
          LoopMock
        </Link>

        <span
          style={{
            fontSize: 14,
            color: T.inkMuted,
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: T.brand,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </span>
      </nav>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px 16px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
          }}
        >
          <div style={{ marginBottom: 30 }}>
            <h1
              style={{
                fontSize: "clamp(30px, 5vw, 38px)",
                fontWeight: 700,
                letterSpacing: "-1.5px",
                color: T.ink,
                margin: "0 0 10px",
                lineHeight: 1.1,
              }}
            >
              Start practicing for free
            </h1>

            <p
              style={{
                fontSize: 15,
                color: T.inkMuted,
                margin: 0,
                lineHeight: 1.7,
              }}
            >
              Create your account and start your first mock interview in
              minutes.
            </p>
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              background: T.surface,
              border: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              fontSize: 14,
              fontWeight: 600,
              color: T.ink,
              cursor: "pointer",
              marginBottom: 22,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.muted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.surface;
            }}
          >
            <LogIn size={18} />
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 22,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background: T.border,
              }}
            />

            <span
              style={{
                fontSize: 12,
                color: T.inkMuted,
              }}
            >
              or continue with email
            </span>

            <div
              style={{
                flex: 1,
                height: 1,
                background: T.border,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 12,
                padding: "12px 14px",
                marginBottom: 18,
                fontSize: 14,
                color: T.danger,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 7,
                }}
              >
                Full name
              </label>

              <div style={{ position: "relative" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.inkMuted,
                  }}
                />

                <input
                  type="text"
                  required
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = T.brand;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = T.border;
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 7,
                }}
              >
                Email
              </label>

              <div style={{ position: "relative" }}>
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.inkMuted,
                  }}
                />

                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = T.brand;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = T.border;
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 7,
                }}
              >
                Password
              </label>

              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: T.inkMuted,
                  }}
                />

                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = T.brand;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = T.border;
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 12,
                background: loading ? "#9CA3AF" : T.brand,
                color: T.brandFg,
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity = "0.9";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  Create free account
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 13,
              color: T.inkMuted,
              lineHeight: 1.7,
            }}
          >
            By signing up you agree to our Terms of Service.
            <br />
            No credit card required.
          </p>

          <p
            style={{
              textAlign: "center",
              marginTop: 14,
              fontSize: 14,
              color: T.inkMuted,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: T.brand,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
