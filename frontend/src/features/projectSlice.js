import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/projects");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Failed to fetch projects");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post("/projects", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Create project failed");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/projects/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Delete failed");
    }
  }
);

const projectSlice = createSlice({
  name: "projects",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchProjects.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProjects.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchProjects.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createProject.fulfilled, (s, a) => { s.items.push(a.payload); })
      .addCase(createProject.rejected, (s, a) => { s.error = a.payload; })

      .addCase(deleteProject.fulfilled, (s, a) => { s.items = s.items.filter(p => p._id !== a.payload); })
      .addCase(deleteProject.rejected, (s, a) => { s.error = a.payload; });
  },
});

export default projectSlice.reducer;
