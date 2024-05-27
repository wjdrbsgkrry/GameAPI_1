import express from "express";
import bcrypt from "bcrypt";
import { prisma_User } from "../utils/prisma/index.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  try {
    const { name, code, password, PwCheck } = req.body;
    const isExistUser = await prisma_User.Users.findFirst({
      where: { code },
    });

    const regexId = /^[a-z0-9]{6,10}$/;
    const regexPw = /^\S{6,}$/;

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 아이디 입니다." });
    }

    if (!regexId.test(code)) {
      return res.status(400).json({
        message:
          "아이디는 영어 소문자와 숫자로만 6자 이상 10자 이하만 가능합니다.",
      });
    }

    if (!regexPw.test(password)) {
      return res
        .status(400)
        .json({ message: "비밀번호는 최소 6자 이상만 가능합니다." });
    }

    if (password !== PwCheck) {
      return res
        .status(400)
        .json({ message: "확인 비밀번호가 일치하지 않습니다!" });
    }

    const hashedPw = await bcrypt.hash(password, 10);

    const user = await prisma_User.Users.create({
      data: {
        name,
        code,
        password: hashedPw,
      },
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    next(error);
  }
});

router.get("/sign-in", async (req, res, next) => {
  res.clearCookie("authorization");
  const { code, password } = req.body;

  const user = await prisma_User.Users.findFirst({
    where: { code },
  });
  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 아이디 입니다." });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  //토큰 발급
  const token = jwt.sign(
    {
      userId: user.userId,
    },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "20s",
    }
  );

  res.cookie("authorization", `Bearer ${token}`);
  return res.status(200).json({ message: "로그인 성공." });
});

export default router;
