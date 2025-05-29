import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { BASE_URL } from "./constants";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* Routes import */
import healthcheckRouter from "./routes/healthcheck.routes";
import userRouter from "./routes/user.routes";
import bookRouter from "./routes/book.routes";
import reviewRouter from "./routes/review.routes";
import searchRouter from "./routes/search.routes";

/* Routes declaration */
app.use(`${BASE_URL}/healthcheck`, healthcheckRouter);
app.use(`${BASE_URL}/users`, userRouter);
app.use(`${BASE_URL}/books`, bookRouter);
app.use(`${BASE_URL}/reviews`, reviewRouter);
app.use(`${BASE_URL}/search`, searchRouter);

export default app;
