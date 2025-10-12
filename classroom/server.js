const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// To Require Express session
const session = require("express-session");
// To Require connect-flash
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views" , path.join(__dirname,"views"));


const sessionOptions = { 
    secret: "mysupersecretstring",
    resave: false, 
    saveUninitialized: true 
}
// EXPRESS SESSION
app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req, res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error", "user not registered !");
    }else{
        req.flash("success", "user registered successfully !");
        
    }

    res.redirect("/hello"); 
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", {name : req.session.name});
});

// app.use("/reqcount", (req,res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1
//     }
//     res.send(`You send request ${req.session.count} time`);
// });

// app.get("/test", (req, res) => {
//     res.send("test seccessful!");
// }); 

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

