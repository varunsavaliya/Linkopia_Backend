import { NextFunction, Request, Response } from "express";
import { Messages } from "../constants";
import { AppError } from "../helpers";
import { Stack } from "../models";

export const getAllStacks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stacks = await Stack.find();
    res.status(200).json({
      success: true,
      message: Messages.Stack.Success.AllStacks,
      data: stacks,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const getStacksByCategoryId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { categoryId } = req.params;
  try {
    const stacks = await Stack.find({ categoryId: categoryId });
    res.status(200).json({
      success: true,
      message: Messages.Stack.Success.AllStacks,
      data: stacks,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const stackById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const category = await Stack.findById(id);
    if (!category)
      return next(new AppError(Messages.Stack.Error.NotFound, 404));
    res.status(200).json({
      success: true,
      message: Messages.Stack.Success.StackById,
      data: category,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const upsertStack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, name, description, categoryId } = req.body;
  try {
    if (!name || !description || !categoryId)
      return next(new AppError(Messages.AllFieldsRequired, 400));
    const stack = id
      ? await Stack.findByIdAndUpdate(id, { name, description, categoryId })
      : await Stack.create({ name, description, categoryId });
    if (!stack)
      return next(
        new AppError(
          id
            ? Messages.Stack.Error.UpdateStack
            : Messages.Stack.Error.CreateStack,
          500
        )
      );
    res.status(200).json({
      success: true,
      message: id
        ? Messages.Stack.Success.UpdateStack
        : Messages.Stack.Success.CreateStack,
      data: stack,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};

export const deleteStack = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const stack = await Stack.findById(id);
    if (!stack)
      return next(new AppError(Messages.Stack.Error.DeleteStack, 500));
    stack.isActive = false;
    await stack.save();
    res.status(200).json({
      success: true,
      message: Messages.Stack.Success.DeleteStack,
      data: stack,
    });
  } catch (error: any) {
    return next(new AppError(error.message, 500));
  }
};
