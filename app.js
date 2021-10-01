const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const route=express.Router();
//TODO
mongoose.connect("mongodb://localhost:27017/wordDB",{useNewUrlParser:true});
const wordSchema={
    word:String,
    count:Number
  };
const Word=mongoose.model("Word",wordSchema);


route.get("/word/:name", async (req, res) => {
  try{
    const word = await Word.findOne({ word: req.params.name })
    res.send(""+word.count)
  }catch{
    res.send("0");

  }
})
// put request for entering name
route.put("/word/:name", async (req, res) => {
	try {
		const word = await Word.findOne({ word: req.params.name })
        word.count = word.count + 1
		await word.save()
		res.send(word)
	} catch {// if name does'nt exist in database then create count as 1
        const word = new Word({
            word: req.params.name,
            count: 1,
        })
        await word.save()
        res.send(word)
	}
});
app.use(route);
app.listen(3000, function() {
  console.log("Server  3000");
});
