import mongoose from 'mongoose';

declare global {
  var mongooseGlobal: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseGlobal;

if (!cached) {
  cached = global.mongooseGlobal = { conn: null, promise: null };
}

export async function connect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL!).then((mongooseInstance) => {
      console.log('MongoDB connected');
      return mongooseInstance;
    }).catch((err) => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
