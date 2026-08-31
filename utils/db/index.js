import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const getMongoUri = () => {
  return process.env.MONGO_URI_RECRUITMENT || process.env.MONGO_URI;
};

const connectCluster = async () => {
  const uri = getMongoUri();

  if (!uri) {
    throw new Error("MongoDB connection URI is missing. Set MONGO_URI in environment variables.");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

/**
 * DBInstance: Primary GCSRM database (events, teams, etc.)
 */
const DBInstance = async () => {
  const conn = await connectCluster();
  const dbName = process.env.DB_NAME || "GCSRM";
  const db = conn.useDb(dbName, { useCache: true });
  return { db: db.db || db };
};

/**
 * DBRecruitment: Recruitment database (recruitment26, tasks26)
 */
const DBRecruitment = async () => {
  const conn = await connectCluster();
  const dbName = process.env.DB_NAME_RECRUITMENT || "Recruitment";
  const db = conn.useDb(dbName, { useCache: true });
  return { db: db.db || db };
};

export default { DBInstance, DBRecruitment };
