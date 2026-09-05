import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "../services/firebase";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      await updateProfile(
        result.user,
        {
          displayName: name,
        }
      );

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      if (
        err.code ===
        "auth/email-already-in-use"
      ) {
        setError(
          "An account with this email already exists."
        );
      } else if (
        err.code ===
        "auth/weak-password"
      ) {
        setError(
          "Your password should be at least 6 characters."
        );
      } else {
        setError(
          "We couldn't create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithPopup(
        auth,
        googleProvider
      );

      navigate("/home", {
        replace: true,
      });
    } catch (err) {
      console.error(err);

      setError(
        "Google sign-up failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="auth-page">

      <div className="auth-brand-panel">

        <div className="auth-brand">

          <div className="auth-brand-mark">
            ✦
          </div>

          <span className="auth-brand-name">
            SparkBoard
          </span>

        </div>

        <div className="auth-hero">

          <div className="auth-eyebrow">
            <span>✦</span>
            Start building
          </div>

          <h1>
            Your work,
            organized.
          </h1>

          <p>
            Create projects, break down
            your goals, and stay focused on
            what matters next.
          </p>

        </div>

      </div>

      <div className="auth-form-panel">

        <div className="auth-card">

          <div className="auth-card-header">

            <h2>
              Create your account
            </h2>

            <p>
              Set up your workspace in
              less than a minute.
            </p>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-field">

              <label className="form-label">
                Name
              </label>

              <input
                className="form-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-field">

              <label className="form-label">
                Email
              </label>

              <input
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-field">

              <label className="form-label">
                Password
              </label>

              <input
                className="form-input"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                minLength={6}
                required
              />

            </div>

            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          <div className="auth-divider">
            or
          </div>

          <button
            className="google-button"
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
          >
            <span className="google-icon">
              G
            </span>

            Continue with Google
          </button>

          <p className="auth-switch">
            Already have an account?{" "}

            <button
              type="button"
              onClick={handleSignIn}
            >
              Sign in
            </button>
          </p>

          <p className="auth-footer">
            SparkBoard · Penn Spark Developer
            Technical Assessment
          </p>

        </div>

      </div>

    </div>
  );
}

export default Signup;
