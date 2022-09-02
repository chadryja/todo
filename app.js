const express= require("express");
const bodyparser= require("body-parser");
const ejs=require("ejs");
const  mongoose=require("mongoose");
const _=require("lodash")

mongoose.connect("mongodb+srv://jawad:jojololo565@cluster0.ullmspa.mongodb.net/todolistdb") 
const itemscma=mongoose.Schema({
    name:String
})
const item=mongoose.model("items",itemscma);
const item1=new item({
    name:"Buy Products"
})
const item2=new item({
    name:"Office Work"
});const inserted=[item1,item2];
const listscma=mongoose.Schema({
    name:String,
    list:[itemscma]

})
const listea =mongoose.model("listea",listscma);

let works=[];
let app =express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.get("/:listname",function(rq,rs){
    const listname=_.capitalize(rq.params.listname);
    listea.findOne({name:listname},function(err,rest){
        if(!err){
      if(!rest){  const list1= new listea({
        name:listname,
        list:inserted
    }); list1.save();  rs.redirect("/"+listname)  }
        else{rs.render("list",{kd:rest.name,ad:rest.list})}}
    })


    // list1.save();  

});

app.get("/",function(req,res){
item.find({},function(err,things){
    if(things.length===0){
item.insertMany(inserted,function(err){
    if(err){
        console.log(err);
    }
})
    }else{
    res.render("list",{kd:"Today",ad:things});}
})
   


})

    
    

app.post("/",function(rq,rs){

const inp=rq.body.more;
const now = rq.body.liste;
const newitem=new item({
    name:inp
})

if (now==="Today"){
    newitem.save();
    rs.redirect("/");
}else{
    listea.findOne({name:now},function(err,found){
        found.list.push(newitem);
        found.save()
            rs.redirect("/"+now);
        
    })
}

})
// app.get("/work",function(req,res){
//     res.render("list",{kd:"Work List",ad:works});


// })
app.post("/delete",function(req,res){
     var del=req.body.delet;
     const listname=req.body.listname;
     if(listname==="Today"){
    item.findByIdAndRemove({_id:del},function(err){
        if (!err){
            console.log("ok");
            res.redirect("/");
        }  ;
    });}else{
        listea.findOneAndUpdate({name:listname},{$pull:{list:{_id:del}}},function(err,ret){
            if(!err){
res.redirect('/'+listname);              
            }
        })
    }
})
app.get("/about",function(rq,rs){
    rs.render("about");
})
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(){
    console.log("start");
})