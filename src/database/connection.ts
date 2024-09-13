import * as mongoose from 'mongoose';

export const connect = async() => {
  try {
    mongoose.connect(process.env.MONGODB_URL ?? "");
    console.log("Connected to db");
  } catch(err) {
    throw new Error("Error connecting to db");
  }
}
