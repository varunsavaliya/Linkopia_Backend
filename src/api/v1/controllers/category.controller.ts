import { NextFunction, Request, Response } from "express";
import { Messages } from "../constants";
import { AppError } from "../helpers";
import { Category } from "../models";

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      message: Messages.Category.Success.AllCategories,
      data: categories,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const categoryById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category)
      return next(new AppError(Messages.Category.Error.NotFound, 404));
    res.status(200).json({
      success: true,
      message: Messages.Category.Success.CategoryById,
      data: category,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const upsertCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name } = req.body;
  try {
    const category = id
      ? await Category.findById(id)
      : await Category.create({ name });
    if (!category)
      return next(
        new AppError(
          id
            ? Messages.Category.Error.UpdateCategory
            : Messages.Category.Error.CreateCategory,
          500
        )
      );
    if (id) await Category.findByIdAndUpdate(id, { name });
    res.status(200).json({
      success: true,
      message: id
        ? Messages.Category.Success.UpdateCategory
        : Messages.Category.Success.CreateCategory,
      data: category,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category)
      return next(new AppError(Messages.Category.Error.DeleteCategory, 500));
    category.isActive = false;
    await category.save();
    res.status(200).json({
      success: true,
      message: Messages.Category.Success.DeleteCategory,
      data: category,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};
