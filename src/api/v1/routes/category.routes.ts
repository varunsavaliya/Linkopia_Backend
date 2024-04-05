import express from "express";
import {
  categoryById,
  deleteCategory,
  getAllCategories,
  upsertCategory,
} from "../controllers";

export const categoryRouter = express.Router();

categoryRouter.route("/").get(getAllCategories).post(upsertCategory);
categoryRouter.route("/:id").get(categoryById).delete(deleteCategory);
