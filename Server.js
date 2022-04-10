//import requirements
const express = require("express");
const session = require("express-session");
const introRouter = require("./routes/introRouter");
const appleRouter = require("./routes/appleRouter");
const taskRouter = require("./routes/taskRouter");


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
  console.log("Server listening on port 3030");
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

//use routers
app.use('/intro', introRouter);
app.use("/apple", appleRouter);
app.use("/tasks", taskRouter);

//selectedPerson
app.get('/logIn/:group/:person', (req, res) => {
  var sess = req.session;
  sess.group = req.params["group"];
  sess.person = req.params["person"];
  console.log(sess);
  res.redirect('/intro');
  }
)

//HomePage
app.get('/', (req, res) => {
    res.redirect('/intro');
    }
)


//starting task 1
app.get('/test', (req, res) => {
    res.render('selectRole');
    }
)
var person1Sockets = new Array;
var person2Sockets = new Array;
var dashboardSockets = new Array;


//SocketIO
io.on('connection', (socket)=>{
  //Initialize the socket based on the type: p1, p2 or dashboard
  socket.on('init', (type)=>{
    console.log("New "+ type + " Just connected");
    switch (type) {
      case "person1":
        person1Sockets.push(socket.id);
        break;

      case "person2":
        person1Sockets.push(socket.id);
        break;

      case "dashboard":
        person1Sockets.push(socket.id);
        break;
          
      default:
        break;
    }
  });



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
