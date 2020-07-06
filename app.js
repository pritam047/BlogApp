var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var methodOverRide=require("method-override");
var expressSanitizer=require("express-sanitizer");

mongoose.connect("mongodb://localhost/blogapp",{useUnifiedTopology:true,useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverRide("_method"));
var port=process.env.port || 3000;

var blogSchema =new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
})
var Blog=mongoose.model("Blog",blogSchema);
// Blog.create({
//     title: "Hot Coffee",
//     image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
//     body : "Cheers to Soothing cup of coffee"
// })
app.get("/",function(req,res){
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err)
        {console.log(err);}
        else{
            res.render("index",{blogs : blogs});
        }
    })
})
app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else
        {
            res.render("show",{blog : foundBlog});
        }
    })
})
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }
        else
        {
            res.render("edit",{blog : foundBlog});
        }
    })
})
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updateBlog){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.render("/blogs/"+req.params.id);
        }
    })
})
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
})
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err)
        {console.log(err);}
        else
        {
            res.redirect("/blogs");
        }
    })
})
app.listen(port,function(){
    console.log("Server running on port " +port);
})