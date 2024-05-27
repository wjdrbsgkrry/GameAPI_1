import jwt from "jsonwebtoken";
import { prisma_User } from "../utils/prisma/index.js";

export default async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(" ");
    if (tokenType !== "Bearer") {
      req.userId = false;
      next();
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    const id = decodedToken.userId;

    const user = await prisma_User.Users.findFirst({
      where: { id: { equels: id } },
    });
    if (!user) {
      res.clearCookies("authorization");
      req.userId = false;
    }

    req.user = user;
    req.userId = true;
    next();
  } catch (error) {
    req.userId = false;
    next();
  }
};
