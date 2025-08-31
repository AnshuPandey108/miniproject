import Task from "../models/Task.js";
import Project from "../models/Project.js";

// Create a task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, projectId } = req.body;

    // Ensure project belongs to logged-in user
    const project = await Project.findOne({ _id: projectId, userId: req.user.id });
    if (!project) return res.status(403).json({ msg: "Not authorized for this project" });

    const task = new Task({ title, description, status, dueDate, projectId });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get tasks (with filtering + sorting)
export const getTasks = async (req, res) => {
  try {
    const { projectId, status, sortBy } = req.query;

    let filter = {};
    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;

    let query = Task.find(filter);

    // Sorting by dueDate
    if (sortBy === "dueDate") {
      query = query.sort({ dueDate: 1 }); // ascending
    }

    const tasks = await query;
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("projectId");

    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Ensure logged-in user owns the project
    if (task.projectId.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("projectId");
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (task.projectId.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ msg: "Task deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
