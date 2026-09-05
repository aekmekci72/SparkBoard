import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";

import {
    auth,
    googleProvider,
} from "../services/firebase";

function Login() {
    const navigate = useNavigate();

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
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            navigate("/home", {
                replace: true,
            });
        } catch (err) {
            console.error(err);

            setError(
                "We couldn't sign you in. Check your email and password and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
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
                "Google sign-in failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = () => {
        navigate("/signup");
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
                        Personal workspace
                    </div>

                    <h1>
                        Turn your ideas
                        into action.
                    </h1>

                    <p>
                        Organize projects, manage tasks,
                        and keep your work moving forward
                        from one focused workspace.
                    </p>

                </div>

            </div>

            <div className="auth-form-panel">

                <div className="auth-card">

                    <div className="auth-card-header">

                        <h2>
                            Welcome back
                        </h2>

                        <p>
                            Sign in to continue to your
                            workspace.
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <button
                            className="button button-primary auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>

                    <div className="auth-divider">
                        or
                    </div>

                    <button
                        className="google-button"
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                    >
                        <span className="google-icon">
                            G
                        </span>

                        Continue with Google
                    </button>

                    <p className="auth-switch">
                        Don't have an account?{" "}

                        <button
                            type="button"
                            onClick={handleCreateAccount}
                        >
                            Create one
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

export default Login;
