import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

<<<<<<< HEAD
const { MONGO_URI, DB_NAME, MONGO_URI_RECRUITMENT, DB_NAME_RECRUITMENT } = process.env;
=======
const { MONGO_URI, DB_TEST_NAME } = process.env;
>>>>>>> staging

const DBInstance = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_TEST_NAME,
    });

    // console.log(`✅ Connected to MongoDB: ${NEXT_PUBLIC_DB_NAME}`);

    // Return the database instance
    return { db: mongoose.connection.db };
  } catch (err) {
    // console.error("❌ Could not connect to MongoDB\n", err.message);
    throw err;
  }
};

const DBRecruitment = async () => {
  try {
    await mongoose.connect(MONGO_URI_RECRUITMENT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: DB_NAME_RECRUITMENT,
    });

    // console.log(`✅ Connected to MongoDB: ${NEXT_PUBLIC_DB_NAME}`);

    // Return the database instance
    return { db: mongoose.connection.db };
  } catch (err) {
    // console.error("❌ Could not connect to MongoDB\n", err.message);
    throw err;
  }
};

export default { DBInstance, DBRecruitment };