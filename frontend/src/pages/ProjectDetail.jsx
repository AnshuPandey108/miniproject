import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchTasks, createTask, updateTask, deleteTask } from "../features/taskSlice";

export default function ProjectDetail() {
  const { id: projectId } = useParams();
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.tasks);

  const [form, setForm] = useState({ title: "", description: "", status: "todo", dueDate: "" });
  const [filters, setFilters] = useState({ status: "", sortBy: "" });

  useEffect(() => {
    dispatch(fetchTasks({ projectId }));
  }, [dispatch, projectId]);

  const create = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await dispatch(createTask({ ...form, projectId, dueDate: form.dueDate || null }));
    setForm({ title: "", description: "", status: "todo", dueDate: "" });
  };

  const filtered = useMemo(() => {
    let items = [...list];
    if (filters.status) items = items.filter(i => i.status === filters.status);
    if (filters.sortBy === "dueDate") items.sort((a,b)=>(new Date(a.dueDate||0) - new Date(b.dueDate||0)));
    return items;
  }, [list, filters]);

  return (
    <div className="container">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">← Back</Link>
        <h2>Project Tasks</h2>
      </div>

      {/* Add Task Form */}
      <form className="card form" onSubmit={create}>
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(e)=>setForm({...form, title:e.target.value})}
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e)=>setForm({...form, description:e.target.value})}
        />
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <select value={form.status} onChange={(e)=>setForm({...form, status:e.target.value})}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e)=>setForm({...form, dueDate:e.target.value})}
          />
          <button className="btn">Add Task</button>
        </div>
      </form>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, margin:'12px 0' }}>
        <select value={filters.status} onChange={(e)=>setFilters({...filters, status:e.target.value})}>
          <option value="">All</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={filters.sortBy} onChange={(e)=>setFilters({...filters, sortBy:e.target.value})}>
          <option value="">No sort</option>
          <option value="dueDate">Sort by Due Date</option>
        </select>
        <button
          className="btn small"
          onClick={()=>dispatch(fetchTasks({ projectId, ...filters }))}
        >
          Apply
        </button>
      </div>

      {/* Tasks */}
      {loading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid">
        {filtered.map(t => (
          <div className="card" key={t._id}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h4 style={{ margin:0 }}>{t.title}</h4>
              <small className="muted">{t.status}</small>
            </div>
            {t.description && <p className="muted">{t.description}</p>}
            {t.dueDate && <p className="muted">Due: {new Date(t.dueDate).toLocaleDateString()}</p>}

            <div style={{ marginTop:8, display:'flex', gap:8 }}>
              {/* Instead of Toggle, allow explicit selection */}
              <select
                value={t.status}
                onChange={(e) =>
                  dispatch(updateTask({ id: t._id, data: { status: e.target.value } }))
                }
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <button className="btn small" onClick={()=>dispatch(deleteTask(t._id))}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
