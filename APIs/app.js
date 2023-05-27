import dotenv from "dotenv";
import express, { urlencoded } from "express";
import cors from "cors";
import { dbConnect } from "./config/dbConnect.js";
import userRoutes from "./routes/user.routes.js";
import electionRoutes from "./routes/election.routes.js";
import bodyParser from "body-parser";

dotenv.config();

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
