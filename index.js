const express = require("express");
const app = express();
// middleware
app.use(express.json());
// all notes
let notes = [
    {
        id: 1,
        title: "notes one",
        description: "this  is node description"
    },
    {
        id: 2,
        title: "notes two",
        description: "this  is node description"
    },
    {
        id: 3,
        title: "notes three",
        description: "this  is node description"
    },
]
// get route
app.get("/", (req, res) => {
    res.send("welcome to our node js");
})

// app.get("/hello/:id", (req, res) => {
//     res.send(`hello page working ${req.params.id}`);
// })
// get all notes
app.get("/notes", (req, res) => {
    if (notes.length == 0) {
        res.send("no notes found");
    }
    res.status(200).send(notes);
});

// get single notes
app.get("/notes/:id", (req, res) => {
    const noteId = parseInt(req.params.id);
    const note = notes.find(note => note.id === noteId);
    if (note) return res.send(note);
    res.status(404).send("notes not found");

});

// post request or add notes
app.post("/notes", (req, res) => {
    const note = req.body;
    notes = [...notes, note];
    res.send(notes);
});

// update notes
app.put("/notes/:id", (req, res) => {
    const noteInput = req.body;
    const gotNoteInput = Object.keys(noteInput);
    const noteId = parseInt(req.params.id);
    // allow update note input field
    const allowUpdates = ['title', 'description'];

    try {
        const isAlowed = gotNoteInput.every(update => allowUpdates.includes(update));
        if (!isAlowed) {
            return res.status(400).send("invalid operation");
        }
        // success update
        const note = notes.find(note => note.id === noteId);
        if (note) {
            notes = notes.map(note => {
                if (note.id === noteId) {
                    return {
                        ...note,
                        ...noteInput
                    };
                } else {
                    return note;
                }
            })
            res.send(notes);
        }
        else {
            // Deal with note that not found
            return res.status(404).send("note not found")
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

//  delete notes
app.delete("/notes/:id", (req, res) => {
    // get note id
    const noteId = parseInt(req.params.id);

    try {
        // find the notes
        const note = notes.find(note => note.id === noteId);
        // delete note
        if (note) {
            notes = notes.filter(note => note.id !== noteId);
            res.send(notes)
        } else {
            // note not found
            res.status(404).send("note not found or unable to update");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }

});

//  not found page
app.get("*", (req, res) => {
    res.send("404 page not found");
})
// create a server
app.listen(3000, () => {
    console.log("server running port 3000");
})