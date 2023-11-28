

const express = require("express")
const bodyParser = require("body-parser")
const app = express();
const ejs = require("ejs")
const date = require(__dirname + "/date.js")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}))

let items = ["Buy", "Foods",
    "go gym",
   " study",
   " do stuff"];
let workItems = [];

app.get("/", function(req, res){

    let day = date;

    res.render("list", {ListTitle: day, newListItem : items})

});

app.post("/", function(req, res){
     var item = req.body.newItem;
     if(req.body.list === "work"){
        workItems.push(item)
        res.redirect("/work")
     }else{
         items.push(item)
         res.redirect("/")
     }
     
    })

app.get("/work", function(req, res){
    res.render("list", {ListTitle:"work List", newListItem: workItems })
}) 

app.post("/work", function(req, res){
    let item = req.body.newItem;
     items.push(item)
    
    res.redirect("/work")
   })

   app.get("/about", function(req, res){
    
    res.render("about")
   })



app.listen(3000, function(){
    console.log("server is listening on port 3000....")
})