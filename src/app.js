import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";
import characterRouter from "./routes/characters.router.js";
import itemRouter from "./routes/items.router.js";
import logMiddleware from "./middlewares/log.middleware.js";
import errorMiddleware from "./middlewares/error-handling.middleware.js";
//import expressSession from "express-session";
import jwt from "jsonwebtoken";
const app = express();
const PORT = 3018;

app.use(logMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, characterRouter, itemRouter]);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "서버에 연결되었습니다!");
});
