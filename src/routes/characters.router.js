import express from "express";
import { prisma_User } from "../utils/prisma/index.js";
import auth from "../middlewares/auth.middleware.js";
import authhorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/create-character", auth, async (req, res, next) => {
  const { id } = req.user;
  const { name } = req.body;
  const health = 500,
    power = 100,
    money = 10000;

  const check = await prisma_User.Characters.findFirst({
    where: { name },
  });

  if (check) {
    return res.status(409).json({ message: "이미 존재하는 닉네임입니다." });
  }

  const character = await prisma_User.Characters.create({
    data: {
      userId: id,
      name,
      health,
      power,
      money,
    },
  });

  return res.status(201).json({ data: character });
});

router.delete("/delete-character", auth, async (req, res, next) => {
  const { id } = req.user;
  const { name } = req.body;

  const check = await prisma_User.Characters.findFirst({
    where: {
      userId: id,
      name,
    },
  });

  if (!check) {
    return res.status(404).json({ message: "존재하지 않는 캐릭터입니다." });
  }

  await prisma_User.Characters.delete({ where: { name } });

  return res.status(200).json({ message: "캐릭터가 삭제되었습니다." });
});

router.get("/inven/:characterName", authhorize, async (req, res, next) => {
  const { characterName } = req.params;
  const findCharacter = await prisma_User.Characters.findFirst({
    where: {
      name: characterName,
    },
    select: {
      userId: true,
      name: true,
      health: true,
      power: true,
      money: true,
    },
  });

  if (!findCharacter)
    return res.status(404).json({ message: "존재하지 않는 캐릭터입니다." });

  const { userId, name, health, power, money } = findCharacter;

  console.log(userId);
  console.log(req.userId);

  if (req.userId && userId == req.user.id) {
    return res.status(200).json({ name, health, power, money });
  } else if (!req.userId) return res.status(201).json({ name, health, power });
});

export default router;
