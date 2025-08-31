import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axiosInstance";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (params, { rejectWithValue }) => {
  try {
    const res = await API.get("/tasks", { params });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || "Failed to fetch tasks");
  }
});

export const createTask = createAsyncThunk("tasks/createTask", async (payload, { rejectWithValue }) => {
  try {
    const res = await API.post("/tasks", payload);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || "Create task failed");
  }
});

export const updateTask = createAsyncThunk("tasks/updateTask", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || "Update task failed");
  }
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.msg || "Delete task failed");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b
      .addCase(fetchTasks.pending, (s) => { s.loading = true; })
      .addCase(fetchTasks.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchTasks.rejected, (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(createTask.fulfilled, (s, a) => { s.list.push(a.payload); })
      .addCase(updateTask.fulfilled, (s, a) => {
        const i = s.list.findIndex(t => t._id === a.payload._id);
        if (i !== -1) s.list[i] = a.payload;
      })
      .addCase(deleteTask.fulfilled, (s, a) => {
        s.list = s.list.filter(t => t._id !== a.payload);
      });
  }
});

export default taskSlice.reducer;
