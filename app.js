//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin:admin123@cluster0.dcbd3yg.mongodb.net/todolistDB", { useNewUrlParser: true });
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
const itemschema = {
  name: String
}
const Item = mongoose.model("Item", itemschema);
const item1 = new Item({ name: "Eat" });
const item2 = new Item({ name: "sleep" });
const listschema={
  name:String,
  itemset:[itemschema]
}
const List=mongoose.model("List",listschema);
app.get("/", function (req, res) {
  const day = date.getDate();
  Item.find().then(function (Items) {
    if (Items.length == 0) {
      Item.insertMany([item1, item2]).then()
      {
        console.log("successfully inserted!!!");
      };
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: "Today", newListItems: Items });
    }
  })
});

app.post("/", function (req, res) {
  const title=req.body.list;
  const itemname = req.body.newItem;
  const item=new Item({
    name:itemname
  })
  if(title=="Today")
  {
    item.save();
    res.redirect("/");
  }
  else{
  List.findOne({name:title}).then(function(foundlist)
  {
    foundlist.itemset.push(item);
    foundlist.save();
    res.redirect("/"+title);
  }) 
  }
  
});
app.post("/delete",function(req,res)
{
  const curr=req.body.checkbox;
  const title=req.body.listname;
  if(title=="Today")
  {
    Item.deleteOne({_id:curr}).then();
    res.redirect("/");
  }
  else{
  List.findOneAndUpdate({name:title},{$pull:{itemset:{_id:curr}}}).then();
  res.redirect("/"+title);
  }
})
// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/:custom",function(req,res)
{
  const topic=req.params.custom;
  
  List.findOne({name:topic}).then(function(foundlist)
  {
    if(!foundlist)
    {
      const list=new List({name:topic,itemset:[item1,item2]});
      list.save();
      res.redirect("/"+topic);
    }
    else
    {
      res.render("list",{listTitle:topic,newListItems:foundlist.itemset})
      console.log("found");
    }
   
    
  })
  // res.render("list",{listTitle:req.params.custom,newListItems:workItems});
})
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
