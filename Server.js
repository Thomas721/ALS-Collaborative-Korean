//import requirements
const express = require("express");
const session = require("express-session");
const router = require("./routes/router");


//create new port and choose port
const app = express();
const port = 3000;


//set the view engine and locate static files
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/css', express.static('public/css'));
app.use('/js', express.static('public/js'));
app.use('/audio', express.static('public/audio'));
app.use('/images', express.static('public/images'));
app.use('/node_modules', express.static('./node_modules'));


//create and connect socket
const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);


//Listen to chosen portNumber
server.listen(3000, ()=>{
  console.log("Server listening on port 3000");
});

// 
// app.listen(port, '0.0.0.0', () =>{
//         console.info('Listening for requests on port ' + port);
//     }
// );

//init session !!!before setting up routers
var sessionMiddleWare = session({
  secret: "ssssshhhh",
  resave: true,
  saveUninitialized: true,
  user: 'personx'
});
app.use(sessionMiddleWare);


// Make io accessible to router
app.use(function(req,res, next){
  req.io = io;
  next();
});

//use routers
app.use('/', router);

//starting task 1
app.get('/test', (req, res) => {
    res.render('selectRole');
    }
)


//SocketIO
io.on('connection', (socket)=>{
  //Initialize the socket based on the type: p1, p2 or dashboard
  socket.on('init', (type)=>{
    console.log("New "+ type + " Just connected");
    switch (type) {
      case "person1":
        socket.join("person1");
        break;

      case "person2":
        socket.join("person2");
        break;

      case "dashboard":
        socket.join("dashboard");
        break;
          
      default:
        break;
    }
  });
});

//send info to dashBoard
io.on("completedExercise", ({score, total, task, exercise, weight})=> {
  req.io.to("dashboard").emit("completedExercise", {score, total, task, exercise, weight});
});



//-----------setting up database-------------
// var mysql = require('mysql');

//create connection
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: ""
// });

// //connect
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to database!");
//   });

//DATABASE NAME alscollab
//DATABASE tables: tasks_task1,...
//tasks_task1:  tasknb
