const express = require("express");
const app = express();

app.get("/", (req,res) => {
    res.send("Hi, I am root!");
})

// Index - user
app.get("/users", (req,res) => {
    res.send("GET for users");
});

// Show - user
app.get("/users/:id", (req,res) => {
    res.send("GET for user id");
});

// Post - user
app.post("/users", (req,res) => {
    res.send("POST for users");
});

// Delete - user
app.delete("/users/:id", (req,res) => {
    res.send("DELETE for user id");
});

// Posts
// Index
app.get("/posts", (req,res) => {
    res.send("GET for posts");
});

// Show
app.get("/posts/:id", (req,res) => {
    res.send("GET for post id");
});

// Post
app.post("/posts", (req,res) => {
    res.send("POST for posts");
});

// Delete
app.delete("/posts/:id", (req,res) => {
    res.send("DELETE for post id");
});

app.listen(3000, () => {
    console.log("server is listing to port 3000");
});

