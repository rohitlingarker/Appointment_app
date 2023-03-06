const express = require('express');
const app = express();
const {Appointment} =require("./models")

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

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

app.get("/new-appointment",(req,res)=>{
    res.render("new-Appointment")
})

app.post("/new-appointment",async (req,res)=>{
    const newAppointment = await Appointment.newAppointment(req.body);

    res.json(newAppointment)
})















// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
