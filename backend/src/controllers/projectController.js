import Project from "../models/Project.js";

// Create new project
export const createProject = async (req, res) => {
  try {
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      userId: req.user.id, // from JWT
    });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all projects of logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!project) return res.status(404).json({ msg: "Project not found" });
    res.json({ msg: "Project deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
