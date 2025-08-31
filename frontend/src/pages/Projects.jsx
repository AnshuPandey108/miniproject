import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, createProject, deleteProject } from "../features/projectSlice";
import { Link } from "react-router-dom";

export default function Projects() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.projects);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await dispatch(createProject({ title, description }));
    setTitle("");
    setDescription("");
  };

  return (
    <div className="container">
      <h2>Your Projects</h2>
      <form className="card form" onSubmit={onCreate}>
        <input placeholder="Project title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <textarea placeholder="Description (optional)" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <button className="btn">Add Project</button>
      </form>

      {loading && <p>Loading projects...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {items.map(p => (
          <div className="card" key={p._id}>
            <h3>{p.title}</h3>
            {p.description && <p className="muted">{p.description}</p>}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Link to={`/projects/${p._id}`} className="btn small">Open</Link>
              <button className="btn small" onClick={()=>dispatch(deleteProject(p._id))}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
