import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_DB || "mongodb://127.0.0.1:27017" , {
      dbName: "FULL_STACK_BLOGGING_APP",
    })
    .then(() => console.log("Database Connected SuccesFully"))
    .catch((err) => console.log("error In DB", err));
};
