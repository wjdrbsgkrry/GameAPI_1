import express from "express";
import { prisma_Item } from "../utils/prisma/index2.js";

const router = express.Router();

router.post("/create-item", async (req, res, next) => {
  const { item_name, item_health, item_power, item_type, item_price } =
    req.body;

  const isExistItem = await prisma_Item.GameItem.findFirst({
    where: { item_name },
  });

  if (isExistItem)
    return res.status(409).json({ message: "이미 존재하는 아이템입니다." });

  const item = await prisma_Item.GameItem.create({
    data: {
      item_name,
      item_health,
      item_power,
      item_type,
      item_price,
    },
  });

  return res.status(201).json("생성완료");
});

router.patch("/put-item/:item_name", async (req, res, next) => {
  const beforeName = req.params.item_name;
  const { item_name, item_health, item_power } = req.body;

  const isExistItemName = await prisma_Item.GameItem.findFirst({
    where: { item_name },
  });

  if (isExistItemName)
    return res
      .status(409)
      .json({ message: "해당 아이템 이름이 이미 존재합니다." });

  try {
    const update = await prisma_Item.GameItem.update({
      where: { item_name: beforeName },
      data: { item_name, item_health, item_power },
    });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "변경하고자 하는 아이템이 존재하지 않습니다." });
  }

  return res.status(200).json({ message: "아이템 변경을 완료하였습니다." });
});

router.get("/all-item", async (req, res, next) => {
  const itemList = await prisma_Item.GameItem.findMany({
    select: {
      item_code: true,
      item_name: true,
      item_price: true,
    },
    orderBy: {
      item_code: "asc",
    },
  });

  return res.status(200).json({ data: itemList });
});

router.get("/item/:item_code", async (req, res, next) => {
  const { item_code } = req.params;
  const code = parseInt(item_code, 10);
  const item = await prisma_Item.GameItem.findFirst({
    where: { item_code: code },
    select: {
      item_code: true,
      item_name: true,
      item_health: true,
      item_power: true,
      item_type: true,
      item_price: true,
    },
  });

  if (!item) {
    return res.status(404).json({ message: "해당 데이터를 찾을 수 없습니다." });
  }

  return res.status(200).json({ data: item });
});

export default router;
