const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// To Require Express session
const session = require("express-session");

// EXPRESS SESSION
app.use(session({ secret: "mysupersecretstring" }));

app.get("/test", (req, res) => {
    res.send("test seccessful!");
}) 

// To Require cookie-parser
// const cookieParser = require("cookie-parser");

// // To use cookie-parser
// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies", (req,res) => {
//     res.cookie("made-in","India", {signed: true});
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req,res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// })

// app.get("/getcookies", (req,res) => {
//     res.cookie("greet","hello");
//     res.cookie("madeIn","India");
//     res.send("send you some cookies");
// });

// app.get("/greet", (req,res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`Hi,${name}`);
// });

// app.get("/", (req,res) => {
//     console.log(req.cookies);
//     res.send("Hi, I am root!");
// });

// app.use("/users", users);
// app.use("/posts", posts);


app.listen(3000, () => {
    console.log("server is listing to port 3000");
});

