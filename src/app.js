import express from "express";
import cookieParser from "cookie-parser";
import UsersRouter from "./routes/users.router.js";
import characterRouter from "./routes/characters.router.js";
import logMiddleware from "./middlewares/log.middleware.js";
import errorMiddleware from "./middlewares/error-handling.middleware.js";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3018;

app.use(logMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/api", [UsersRouter, characterRouter]);
app.use(errorMiddleware);

// app.post("/token", async (req, res) => {
//   const { userCode, userPw } = req.body;
//   const user = prisma.Users.findFirst({
//     where: { userCode, userPw },
//   });

// if(!user)

//   const accessToken = jwt.sign({ userId: userId });

//   const token = jwt.sign(
//     {
//       userId: user.userId,
//     },
//     "customIdKey",
//     {
//       expiresIn: "60s",
//     }
//   );
// });

app.listen(PORT, () => {
  console.log(PORT, "서버에 연결되었습니다!");
});
