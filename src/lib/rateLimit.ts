// Fixed-window rate limiter stored in MongoDB, so it works across serverless instances.
// Old windows are removed automatically by a TTL index.
import mongoose, { Schema } from "mongoose";
import { connectDB } from "./db";

const RateLimitSchema = new Schema({
  _id: String, // `${bucket}:${ip}:${windowStart}`
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, index: { expires: 0 } },
});

const RateLimit =
  (mongoose.models.RateLimit as mongoose.Model<{ _id: string; count: number; expiresAt: Date }>) ||
  mongoose.model("RateLimit", RateLimitSchema);

export function clientIp(req: Request) {
  const h = req.headers;
  return (
    h.get("x-nf-client-connection-ip") ||
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

/** Returns true when the request is allowed. Fails open if the DB check itself errors. */
export async function rateLimit(req: Request, bucket: string, limit: number, windowSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSeconds);
  const id = `${bucket}:${clientIp(req)}:${windowStart}`;
  try {
    await connectDB();
    const doc = await RateLimit.findOneAndUpdate(
      { _id: id },
      { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((windowStart + windowSeconds) * 1000) } },
      { upsert: true, new: true },
    ).lean();
    return (doc?.count ?? 0) <= limit;
  } catch (err) {
    console.error("rateLimit error:", err);
    return true;
  }
}

export function tooMany(message = "Too many requests. Please try again in a little while.") {
  return Response.json({ error: message }, { status: 429 });
}
