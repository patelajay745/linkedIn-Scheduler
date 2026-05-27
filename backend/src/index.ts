import "dotenv/config";
import express from "express";
import authRouter from "@/auth/auth.route";
import uploadRouter from "@/upload/upload.route";
import postRouter from "@/post/post.route";
import { RedisStore } from "connect-redis";
import session from "express-session";
import { createClient } from "redis";
import { errorHandler } from "@/shared/utils/errorHandler";
import helmet from "helmet";

const app = express();

app.use(helmet());

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: process.env.APP_NAME + ":",
});

app.use(
  session({
    store: redisStore,
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_SECRET!,
    cookie: {
      maxAge: 60 * 24 * 60 * 60 * 1000, //60 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    },
  })
);

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.send("Up and Running");
});

app.use("/v1/auth", authRouter);
app.use("/v1/upload", uploadRouter);
app.use("/v1/posts", postRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
