
const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// Convert MongoDB documents into the shape expected by React.
function formatNote(note) {
    return {
        id: note._id.toString(),
        title: note.title,
        description: note.description,
        date: note.createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }),
        category: note.category,
        important: note.important,
        deleted: note.deleted
    };
}

// GET /api/notes — get only the logged-in user's notes.
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId })
            .sort({ createdAt: -1 });

        res.json(notes.map(formatNote));
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch notes" });
    }
});

// POST /api/notes — create a note.
router.post("/", async (req, res) => {
    try {
        const { title, description, category } = req.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            title.trim().length > 100 ||
            typeof description !== "string" ||
            !description.trim()
        ) {
            return res.status(400).json({
                message: "A valid title and description are required"
            });
        }

        const note = await Note.create({
            title: title.trim(),
            description: description.trim(),
            category: category || "Study",
            user: req.user.userId
        });

        res.status(201).json(formatNote(note));
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Failed to create note" });
    }
});

// PUT /api/notes/:id — update a note owned by the logged-in user.
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const updates = {};
        const { title, description, category, important, deleted } = req.body;

        if (title !== undefined) {
            if (
                typeof title !== "string" ||
                !title.trim() ||
                title.trim().length > 100
            ) {
                return res.status(400).json({ message: "Invalid title" });
            }
            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== "string" || !description.trim()) {
                return res.status(400).json({ message: "Invalid description" });
            }
            updates.description = description.trim();
        }

        if (category !== undefined) updates.category = category;
        if (important !== undefined) updates.important = important;
        if (deleted !== undefined) updates.deleted = deleted;

        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json(formatNote(note));
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: "Failed to update note" });
    }
});

// DELETE /api/notes/:id — permanently delete an owned note.
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note permanently deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete note" });
    }
});

module.exports = router;
