const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      userId: req.user.id,
      title,
      content,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { search } = req.query;

    let query = { userId: req.user.id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const notes = await Note.find()
      .populate("userId", "username")
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or access denied" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!note) {
      return res
        .status(404)
        .json({ message: "Note not found or access denied" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/admin/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/admin/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const note = await Note.findOneAndDelete({ _id: req.params.id });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
