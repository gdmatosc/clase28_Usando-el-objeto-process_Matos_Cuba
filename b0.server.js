/* #region. 1.Parámetros y recursos generales*/

/* #region. Plantilla*/

/* #endregion */ 

const express=require('express');
const session=require('express-session')
const app=express();

const MongoStore=require('connect-mongo')
const mongoose=require('mongoose')

const apiRouterClientes=require('./b1.routes/apiRouterClientes');
const apiRouterMant=require('./b1.routes/apiRouterOperaciones');
const apiRouterAuth=require('./b1.routes/apiRouterAuth')
const { Server }=require("socket.io");

const http=require('http');
const server=http.createServer(app)
const io=new Server(server);

//const session=require('express-session')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy

const path = require('path')

const UsersModel=require('./b3.models/user.model')

const PORT=8081;
/* #endregion */

/* #region. 2.Recursos de web socket*/
const mensajesDBTest=[
    {id:1,nombre:"User 1",correo:"u1@company.com",edad:20,textoIngresado:"Iniciamos!"},
    {id:2,nombre:"User 2",correo:"u2@company.com",edad:21,textoIngresado:"Primero!"},
    {id:3,nombre:"User 3",correo:"u3@company.com",edad:22,textoIngresado:"Que empiece!"}
]

let messages=[]

let GetComentarios=()=>{
    const options = {
        host : 'localhost',
        port : 8081,
        path: '/apiClientes/comentarios',
        method: 'GET'
    };
    // Sending the request
    const req = http.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => {
        data += chunk;
    });
    // Ending the response 
    res.on('end', () => {
        messages = JSON.parse(data);
        //console.log("mensajes",data)
        //console.log('mensajesJson:', JSON.parse(data))
    });
       
    }).on("error", (err) => {
    console.log("Error: ", err)
    }).end()
            
} 

io.on('connection',(socket)=>{
    GetComentarios()
    socket.emit('messages',messages)
    console.log('User conectado Get, id:'+socket.id);
    let mensajesDBTemporal=messages
    console.log('Usuario conectado socket inicial')
    socket.on('new-message',data=>{
        GetComentarios()
        console.log("Recibido new-message")
        dataJson=JSON.parse(data)
        console.log("DataSinId: ", dataJson)
        dataJson["id"]="1";
        console.log("DataConId: ", dataJson)
        mensajesDBTemporal.push(dataJson)
        //messagesTemp.push(data)
        io.sockets.emit('messages',mensajesDBTemporal);
        console.log('mensajesDBTemporal.new-message-fin.socketOn.inOn.Server',mensajesDBTemporal)
    });
    socket.on('new-message-delete',data=>{
        GetComentarios()
        mensajesDBTemporal=[]
        //messagesTemp.push(data)
        io.sockets.emit('messages',mensajesDBTemporal);
        console.log('mensajesDBTemporal.new-message-delete-fin.socketOn.inOn.Server',mensajesDBTemporal)
    });
    
})
/* #endregion */ 

/* #region. 3.Uso de objetos de librería express*/

//3.1.Uso de objetos en otros JS
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(express.static(__dirname+'/public'))
/*
app.use(session({
    store:new MongoStore({
        mongoUrl: 'mongodb://localhost:27017/sessions'
    }),
    secret:'conrat',
    resave:false,
    saveUninitialized:false
}))
*/
app.use('/apiClientes',apiRouterClientes);
app.use('/apiMantenimiento',apiRouterMant);
app.set('views','./f1.views')
app.set('view engine','ejs')

//3.3.Envío de datos a URLs
/*
app.get('/login',(req,res)=>{
    if(req.session.username) return res.redirect('/home')
    res.sendFile('login.html',{root: __dirname+'/public'})
})

app.post('/login',(req,res)=>{
    req.session.username=req.body.username
    return res.redirect('/home')
})

app.get('/home',(req,res)=>{
    console.log(req.session);
    let username=req.session.username
    console.log("reqSessionUsername.appGet",username)
    if(!username) return res.redirect('/login')
    return res.render('home',{username})
})

app.get('/logout',(req,res)=>{
    let username=req.session.username
    req.session.destroy()
    return res.render('logout',{username})

})

app.get('/chat',(req,res)=>{
    console.log(req.session);
    let username=req.session.username
    console.log("reqSessionUsername.appGet",username)
    return res.render('chat.ejs',{username})
})

app.get('/productos',(req,res)=>{
    console.log(req.session);
    let username=req.session.username
    console.log("reqSessionUsername.appGet",username)
    return res.render('productos.ejs',{username})
})
*/
/* #endregion */ 

/* #region. 4.Passport con enrutamiento*/
//4.1.Configuración de passport
passport.use('login',new LocalStrategy(
    (username,password,done)=>{
        UsersModel.findOne({username},(err,user)=>{
            if(err) return done(err)
            if(!user){console.log('User not found')}

            return done(null,user)
        })
    }
))

passport.use('signup',new LocalStrategy(
    {passReqToCallback: true},
    (req,username,password,done)=>{
        console.log('signup...')
        
        UsersModel.findOne({username},(err,user)=>{
            if(err) return done(err)
            if(user){
                console.log('User already exists')
                return done(null,user)
            }

            const newUser={username,password,name:req.body.name}
            UsersModel.create(newUser,(err,userWithID)=>{
                if(err) return done(err)

                console.log(userWithID)
                return done(null,userWithID)
            })
            
        })
        
    }
))

passport.serializeUser((user,done)=>{
    done(null,user._id)
})

passport.deserializeUser((id,done)=>{
    UsersModel.findById(id,done)
})

app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false,
    rolling:true,
    cookie:{
        maxAge:60000,
        secure:false,
        httpOnly:true
    }
}))

app.use(passport.initialize())
app.use(passport.session())
//mongoose.connect
/*
function connectDB(url,cb){
    mongoose.connect(
        url,
        {
            useNewUrlParser:true,
            useUnifiedTopology:true

        },
        err=>{
            if(!err) console.log('Connected DB para passport')
            if(cb!=null) cb(err)
        }
    )
}

connectDB('mongodb://localhost:27017/dbCoderTest',err=>{
    if(err) return console.log('Error connecting DB',err)   
})
*/

//4.2.Rutas de autenticación
app.get('/',apiRouterAuth.getRoot)
app.get('/login',apiRouterAuth.getLogin)

app.post(
    '/login',
    passport.authenticate('login'),
    apiRouterAuth.postLogin
    
)
app.get('/signup',apiRouterAuth.getSignup)
app.post(
    '/signup',
    passport.authenticate('signup',{failureRedirect: '/failsignup'}),
    apiRouterAuth.postSignup
)

app.get('/user_data', apiRouterAuth.getUserData);

app.get('/logout',checkAuthentication,(req,res)=>{
    let username=req.user.username
    req.session.destroy()
    return res.render('logout',{username})

})

app.get('/failsignup',apiRouterAuth.getFailSignup)

function checkAuthentication(req,res,next){
    if(req.isAuthenticated()) next()
    else res.redirect('/login')
}
app.get('/private',checkAuthentication,(req,res)=>{
    const {user}=req
    res.send('<h1>Solo pudiste entrar porque está logueado</h1>')
})

//4.3.Rutas de autorización
app.get('/homeGeneral',checkAuthentication,(req,res)=>{
    console.log(req.session);
    let username=req.user.username
    console.log("username.get.homeGeneral.b0ServerJS",username)
    if(!username) return res.redirect('/login')
    return res.render('homeGeneral',{username})
})

app.get('/chatGeneral',checkAuthentication,(req,res)=>{
    console.log(req.session);
    let username=req.user.username
    console.log("username.get.chat.b0ServerJS",username)
    return res.render('chatGeneral.ejs',{username})
})

app.get('/productosClientes',checkAuthentication,(req,res)=>{
    console.log(req.session);
    let username=req.session.username
    console.log("reqSessionUsername.appGet",username)
    return res.render('productosClientes.ejs',{username})
    //return res.sendFile(path.resolve(__dirname, '../Clase28.desafio/f1.views')+'/productosClientes.html')
})

app.get('/carritoClientes',checkAuthentication,(req,res)=>{
    console.log(req.session);
    let username=req.session.username
    console.log("reqSessionUsername.appGet",username)
    return res.render('carritoClientes.ejs',{username})
})

app.get('/homeAdmin',checkAuthentication,(req,res)=>{
    console.log(req.session);
    let username=req.user.username
    console.log("username.get.homeAdmin.b0ServerJS",username)
    return res.render('homeAdmin',{username})
})

app.get('/productosMantenimiento',checkAuthentication,(req,res)=>{
    console.log(req.session);
    let username=req.session.username
    console.log("reqSessionUsername.appGet",username)
    return res.render('productosMantenimiento.ejs',{username})
})




/* #endregion */ 

/* #region. 5.Iniciando servidor general*/
server.listen(PORT,()=>{
    console.log('Listening on port: '+PORT);
})
/* #endregion */ 

/*
app.post('/login',passport.authenticate('login'),(req,res)=>{
    console.log("req.user.postLogin.b0ServerJS",req.user)
    let username=req.session.username
    res.render('home',{username})
})
*/
