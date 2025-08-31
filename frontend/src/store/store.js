import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import projectsReducer from "../features/projectSlice";
import tasksReducer from "../features/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
  },
});
