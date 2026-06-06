import mongoose from "mongoose";

const DBconnection = async () => {
  try {
    
    await mongoose.connect(process.env.ATLAS_URI);
    console.log("MongoDB connected ");
    
  } catch (error) {
    console.log("DB Error", error);
    process.exit(1); // important
  }
};

export default DBconnection