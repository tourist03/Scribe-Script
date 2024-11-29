const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

//Route 1 : Fetch all Notes using : GET "/api/notes/fetchallnotes" . Login Required

router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occured");
  }
});

//Route 2 : Add a new Notes using : POST "/api/notes/addnote" . Login Required

router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter a valid title").isLength({ min: 5 }),
    body("description", "Enter a valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    // if there are errors then return bad request
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    try {
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNotes = await note.save();

      res.json(savedNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error Occured");
    }
  }
);

module.exports = router;