
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const _ = require("lodash")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// mongodb+srv://<username>:<password>@cluster0.uqt5lhi.mongodb.net/?retryWrites=true&w=majority

// "mongodb+srv://cluster0.eyqzftt.mongodb.net/" --apiVersion 1 --username abdiahma3176
// abdiahma3176:passwordhn@cluster0.eyqzftt.mongodb.net/yedatabsehn_sm
async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb+srv://abudiahmed2007:abudiahmed@cluster0.uqt5lhi.mongodb.net/todolistDB');
    console.log('Connected to MongoDB successfully');
    
    // Rest of the code inside connectToMongoDB function

    const itemsSchema = {
        name: String,
        unique: Boolean
    }

    const Item = mongoose.model("Item", itemsSchema);

    const Item1 = new Item({

        name: "welcome to your todolist"
    })

    const Item3 = new Item({
        name: "hit the + button to aff a new item."
    })

    const Item2 = new Item({
        name: "<-- hit this to delete an item."
    })
    const defaultItems = [Item1, Item2, Item3]
          
    const listSchema = {
        name: String, 
        items: [itemsSchema]
    }

    const List = mongoose.model("List", listSchema);
    
    
    app.get("/", function(req, res){
        
       Item.find().then(foundItem => {

            if(foundItem.length === 0){

                Item.insertMany(defaultItems).then(result => {
                console.log("succesfully inserted")
               }).catch(err => {
                console.log(err)
               })
               res.redirect("/");
         }else{
            //  console.log(foundItem)
             res.render("list", {ListTitle: "Today", newListItem : foundItem})
         }
         });
        
// let day = date;
 

});


app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
  
      List.findOne({ name: customListName }).then(foundList => {
      if (!foundList) {
        // Handle the case where the list doesn't exist, e.g., render an error page or redirect
        const list = new List({
            name: customListName,
            items: defaultItems
        });
        list.save();
      
        res.redirect("/" + customListName);
      } else {
        res.render("list", {ListTitle: foundList.name, newListItem : foundList.items})
        // Handle the case where the list exists, e.g., render the list or perform other operations
      }
    })

  });


app.post("/", function(req, res){
 const itemName = req.body.newItem;
 const listName = req.body.list
    
     const item = new Item({
        name: itemName
     })

     if(listName=== "Today"){      
       item.save();
       res.redirect("/");
     }else{
      List.findOne({name: listName}).then(foundList => {
          foundList.items.push(item)
          foundList.save();
          res.redirect("/" + listName);
      })
     }

 
})

app.post("/delete", function(req, res){
   const checkedItemId = req.body.checkedbox;
   const listName = req.body.listName;

   if(listName === "today"){
     Item.findByIdAndDelete(checkedItemId).then(result => {
      console.log("succesfully deleted")
     }).catch(err => {
      console.log(err)
     })
     res.redirect("/");
   }else{
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}} ).then(found => {
      if(found){
        res.redirect("/" + listName)
      }
    })
   }

   })

// app.get("/work", function(req, res){
// res.render("list", {ListTitle:"work List", newListItem: workItems })
// }) 


app.post("/work", function(req, res){
let item = req.body.newItem;
 items.push(item)

res.redirect("/work")
})

app.get("/about", function(req, res){
 
 res.render("about")
})

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToMongoDB();

// Rest of the code

app.listen(process.env.PORT || 3000, function () {
  console.log("server is listening on port 3000....");
});





// app.listen(3000, function(){
//     console.log("server is listening on port 3000....")
// })