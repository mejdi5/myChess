const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const bodyparser = require('body-parser');
const cors = require('cors')
const morgan = require("morgan");
const colors = require("colors");

app.use(cors())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}))
app.use(express.json());
app.use(morgan("dev"));


app.use('/public', express.static('public'));

app.use("/api/users", require('./backend/routes/userRoute'));
app.use("/api/pictures", require('./backend/routes/pictureRoute'));
app.use("/api/games", require('./backend/routes/gameRoute'));
app.use("/api/invitations", require('./backend/routes/invitationRoute'));

//deploy
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
    });
}

//connect database
dotenv.config({ path: './backend/.env'});
try {
    mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });
    console.log(`Database is connected...`.white.bold);
} catch (error) {
    console.log(`Database is not connected...`.red.bold);
}

const port = process.env.PORT || 5000

const server = app.listen(port, () => 
    console.log(`server is running on port ${port}`.blue.bold) 
)

//socket
const io = require("socket.io")(server, {
    cors: {
        origin: "*", 
    },
});

let Users = [];

const addUser = (userId, socketId) => {
    !Users.some((user) => user.userId === userId) &&
    Users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    Users = Users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket) => {

    //when connect
    console.log('onlineUsers', Users)
    //set user as online and get online users
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", Users);
        });
        
        //move pieces
        socket.on("move", ({move, opponentId}) => {
        const user = Users?.find(u => u.userId === opponentId);
        io.to(user?.socketId).emit("getMove", {move} )
        });

        //resign
        socket.on("resign", ({_id, opponentId}) => {
        const user = Users?.find(u => u.userId === opponentId);
        io.to(user?.socketId).emit("getResignedGame", {_id})
        })

        //send and get invitation
        socket.on("sendInvitation", (newInvitation) => {
        const user = Users?.find(u => u.userId === newInvitation.receiverId);  
        io.to(user?.socketId).emit("getInvitation", newInvitation)
        })

        //accept and get accepted invitation
        socket.on("acceptInvitation", (newGame) => {
            const user = Users?.find(u => u.userId === newGame?.whitePlayerId);  
            io.to(user?.socketId).emit("getAcceptedInvitation", newGame)
        })

    //disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", Users);
        });
})
