import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import heroImage from "../assets/hero.png";

export default function Login() {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isRegister = mode === "register";

    const submitAuth = async (event) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            if (isRegister) {
                await API.post("/auth/register", { name, email, password });
            }

            const res = await API.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setMessage(err.response?.data?.msg || "We could not complete that request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <section className="auth-hero" aria-label="PrimeTrade workspace preview">
                <div className="brand-mark">PT</div>
                <div className="hero-copy">
                    <p className="eyebrow">PrimeTrade task desk</p>
                    <h1>Keep every trade task visible and moving.</h1>
                    <p>
                        A focused workspace for tracking operational tasks with a clean,
                        low-friction flow.
                    </p>
                </div>
                <img src={heroImage} alt="" className="hero-art" />
                <div className="hero-metrics" aria-label="Workspace highlights">
                    <span>
                        <strong>Fast</strong>
                        task capture
                    </span>
                    <span>
                        <strong>Private</strong>
                        account access
                    </span>
                    <span>
                        <strong>Clear</strong>
                        priority view
                    </span>
                </div>
            </section>

            <main className="auth-panel">
                <div className="auth-card">
                    <div className="auth-header">
                        <p className="eyebrow">Welcome</p>
                        <h2>{isRegister ? "Create your account" : "Sign in to PrimeTrade"}</h2>
                        <p>
                            {isRegister
                                ? "Set up access and jump straight into your dashboard."
                                : "Use your account details to continue to your dashboard."}
                        </p>
                    </div>

                    <div className="segmented" role="tablist" aria-label="Authentication mode">
                        <button
                            type="button"
                            className={mode === "login" ? "active" : ""}
                            onClick={() => setMode("login")}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            className={mode === "register" ? "active" : ""}
                            onClick={() => setMode("register")}
                        >
                            Register
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={submitAuth}>
                        {isRegister && (
                            <label>
                                Name
                                <input
                                    value={name}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </label>
                        )}

                        <label>
                            Email
                            <input
                                value={email}
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Password
                            <input
                                value={password}
                                type="password"
                                placeholder="Enter your password"
                                autoComplete={isRegister ? "new-password" : "current-password"}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </label>

                        {message && <p className="form-message">{message}</p>}

                        <button className="primary-button" type="submit" disabled={loading}>
                            {loading ? "Working..." : isRegister ? "Create account" : "Sign in"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
