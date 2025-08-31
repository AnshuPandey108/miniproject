import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, loginUser } from "../features/authSlice";
import { Navigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const r = await dispatch(signupUser({ email, password }));
    if (r.meta.requestStatus === "fulfilled") {
      await dispatch(loginUser({ email, password })); // auto-login
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form className="card form" onSubmit={submit}>
        <input required placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="btn" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        {error && <p className="error">{error}</p>}
        <p style={{ marginTop: 8 }}>Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}
