import mongoose from "mongoose";

export const dbConnect = async (DB_URL) => {
  try {
    const DB_OPTION = {
      dbName: "voting",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(DB_URL, DB_OPTION);
    console.log("Database Connected Sucessfully");
  } catch (error) {
    console.log(error);
  }
};
