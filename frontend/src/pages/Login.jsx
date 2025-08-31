import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import { Navigate, Link } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((s) => s.auth);

    if (user) return <Navigate to="/" replace />;

    const submit = async (e) => {
        e.preventDefault();
        await dispatch(loginUser({ email, password }));
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form className="card form" onSubmit={submit}>
                <input required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
                {error && <p className="error">{error}</p>}
                <p style={{ marginTop: 8 }}>No account? <Link to="/signup">Sign up</Link></p>
            </form>
        </div>
    );
}
