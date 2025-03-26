import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const { MONGO_URI, DB_TEST_NAME } = process.env;

const DBInstance = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_TEST_NAME,
    });

    // console.log(`✅ Connected to MongoDB: ${NEXT_PUBLIC_DB_NAME}`);
  } catch (err) {
    // console.error("❌ Could not connect to MongoDB\n", err.message);
    throw err;
  }
};

export default DBInstance;
