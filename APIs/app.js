import dotenv from "dotenv";
import express, { urlencoded } from "express";
import cors from "cors";
import { dbConnect } from "./config/dbConnect.js";
import userRoutes from "./routes/user.routes.js";
import electionRoutes from "./routes/election.routes.js";
import bodyParser from "body-parser";
import { Server } from "socket.io";

dotenv.config();

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });

  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });

  socket.on("sendText", ({ senderName, receiverName, text }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getText", {
      senderName,
      text,
    });
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

const app = express();
const port = process.env.PORT;
const DATABASE_URL = process.env.DB_URL;
app.use(cors()); //CORS Policy

app.use(bodyParser.json({ limit: "10mb" }));
dbConnect(DATABASE_URL); //DATABASE CONNECTON

app.use(express.json());
app.use(urlencoded({ extended: false }));

app.use("/api/user", userRoutes);
app.use("/api/election", electionRoutes);

app.use((req, res, next) => {
  next({ status: 404, message: "Not Found or Undefined Route" });
});

app.use((err, req, res, next) => {
  let message = err.message || "Server Error";
  let status = err.status || 500;
  res.status(status).json({
    message: message,
  });
});

app.listen(port, "localhost", (done, err) => {
  if (err) {
    console.log("Something went wrong.");
  } else {
    console.log(`Server listening at http://localhost:${port}`);
  }
});
