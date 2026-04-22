import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    const task = await Task.create({
        ...req.body,
        userId: req.user.id
    });
    res.json(task);
};

export const getTasks = async (req, res) => {
    let tasks;

    if (req.user.role === "admin") {
        tasks = await Task.find();
    } else {
        tasks = await Task.find({ userId: req.user.id });
    }

    res.json(tasks);
};

export const deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted" });
};