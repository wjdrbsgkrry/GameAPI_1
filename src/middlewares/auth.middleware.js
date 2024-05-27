import jwt from "jsonwebtoken";
import { prisma_User } from "../utils/prisma/index.js";

export default async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 일치하지 않습니다.");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    const id = decodedToken.userId;

    const user = await prisma_User.Users.findFirst({
      where: { id: id },
    });
    if (!user) {
      res.clearCookies("authorization");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }
    console.log(user);
    req.user = user;

    next();
  } catch (error) {
    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });
      default:
        return res.status(401).json({ message: error.message });
    }
  }
};
