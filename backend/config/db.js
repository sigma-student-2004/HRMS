import mongoose from "mongoose";

const DBconnection = async () => {
  try {
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ");
    
  } catch (error) {
    console.log("DB Error", error);
    process.exit(1); // important
  }
};

export default DBconnection