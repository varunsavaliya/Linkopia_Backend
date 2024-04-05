import express from "express";
import {
  deleteStack,
  getStacksByCategoryId,
  getAllStacks,
  stackById,
  upsertStack,
} from "../controllers";

export const stackRouter = express.Router();

stackRouter.route("/").get(getAllStacks).post(upsertStack);
stackRouter.get("/:categoryId", getStacksByCategoryId);
stackRouter.route("/:id").get(stackById).delete(deleteStack);
