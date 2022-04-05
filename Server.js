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

//Listen to chosen portNumber
app.listen(port, '0.0.0.0', () =>{
        console.info('Listening for requests on port ' + port);
    }
);

//init session !!!before setting up routers
app.use(session({
  secret: "ssssshhhh",
  resave: true,
  saveUninitialized: true
}));

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
    res.render('dashboard');
    }
)

//-----------setting up database-------------
var mysql = require('mysql');

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
