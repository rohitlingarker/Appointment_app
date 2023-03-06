const express = require('express');
const app = express();
const {Appointment} =require("./models")
const session = require("express-session");
const flash = require("connect-flash");
const {Op} = require("sequelize")



// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.use(
    session({
      secret: "my-super-secret-key-12323432345678324",
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );
// Serve static files from the public directory
app.use(express.static('public'));
app.use(flash());
app.use(function (request, response, next) {
    response.locals.messages = request.flash();
    next();
  });


// Set up your routes here
app.get('/', async (req, res) => {
    try{
        const appointments = await  Appointment.getAppointments();
        console.log(appointments);
        if(req.accepts("html")){
            res.render("index",{appointments})
        }
        else{
            res.json({
                appointments
            })
        }
    }catch(error){
        console.log(error);
    }
});



app.post("/new-appointment",async (req,res)=>{
    try{
        const newAppointment = await Appointment.newAppointment(req.body);
        if(req.accepts("html")){
            if(!newAppointment){
                req.flash("success","Start Time should be less than End Time!")
            }
            res.redirect("/")
        }else{
            res.json(newAppointment)
        }
    }catch(error){
        overlapping_appointments = JSON.parse(error.message);
        overlappingIds= overlapping_appointments.map(apmt => {return apmt.id})
        console.log(overlappingIds);
        for(let i=0;i<overlappingIds.length;i++){
            req.flash("error", overlappingIds[i]);
        }
        res.redirect("/")
    }
})

app.delete("/md",async (req,res)=>{
    list=req.body.overlappingIds
    console.log(list);
    try{
        const deletedResponse =await Appointment.destroy({where:{
            id:{[Op.in]:list}
        }})
        res.json(deletedResponse===1)
    }catch(error){
        console.log(error);
    }
})

app.delete("/:id",async (req,res)=>{
    try{
        const deletedResponse =await Appointment.destroy({where:{
            id:req.params.id
        }})
        res.json(deletedResponse===1)
    }catch(error){
        console.log(error);
    }
})

app.put("/:id",async (req,res)=>{
    try{
        const updatedAppointment = await Appointment.update({
            eventName:req.body.eventName,
            description:req.body.description
        },{
            where:{
                id:req.params.id
            }
        })
        res.json(updatedAppointment)
    }catch(error){
        console.log(error);
    }
})














// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
