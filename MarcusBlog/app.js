const express = require('express'),
	  mongoose = require('mongoose'),
	  passport = require('passport'),
	  localView = require('passport-local'),
	  bodyParser = require('body-parser'),
	  methodOverride = require('method-override'),
	  localView2 = require('passport-local-mongoose'),
	  app = express(),
	  port = 3000;
	  

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

const blogSchema = new mongoose.Schema({
	title: String,
	img: String,
	content: String
});

const Post = mongoose.model("Post", blogSchema);

// Post.create({
// 	title:"Nietzsche's Revenge",
// 	img: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fthisiscommonsense.com%2Fwp-content%2Fuploads%2F2015%2F11%2Fimage11.jpg&f=1&nofb=1",
// 	content: "Something something something"
// });

app.get("/", function(req, res){
	res.redirect("/posts");
});

app.get("/about", function(req, res){
	res.render("about.ejs");
});

app.get("/posts", function(req, res){
	Post.find({}, function(err, posts){
		if(err){
			console.log(err);
		}
		else {
			res.render("home.ejs", {posts: posts});
		}
	});
});

app.get("/posts/new", function(req, res){
	res.render("new.ejs");
});

app.get("/posts/:id/edit", function(req, res){
	Post.findById(req.params.id, function(err, editBlog){
		if(err) {
			console.log(err);
		}
		else {
			res.render("edit.ejs", {posts: editBlog});
		}
	});
});

app.put("/posts/:id", function(req, res){
	Post.findByIdAndUpdate(req.params.id, req.body.post, {new: true}, function(err, editedBlog){
		if(err){
			console.log(err);
		}
		else {
			console.log(req.body.post);
			res.redirect("/posts/" + req.params.id);
		}
	});
});

app.post("/posts", function(req, res){
	Post.create(req.body.posts, function(err, newBlog){
		if(err) {
			console.log(err);
		}
		else {
			console.log(req.body.posts);
			res.redirect("/posts");
		}
	});
});

app.get("/posts/:id", function(req, res){
	Post.findById(req.params.id, function(err, foundBlog){
		if(err) {
			console.log(err);
		}
		else {
			res.render("show.ejs", {post: foundBlog});
		}
	});
});

app.delete("/posts/:id", function(req, res){
	Post.findByIdAndRemove(req.params.id, function(err, removed){
		if(err) {
			console.log(err);
		}
		else {
			res.redirect("/posts");
		}
	});
});


app.listen(port, () => console.log('example app listening at http://localhost:${3000}'))