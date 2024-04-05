export const Messages = {
  AllFieldsRequired: "All fields are required",
  User: {
    Success: {
      Registration: "User registered successfully",
      Login: "User logged in successfully",
      LogOut: "User logged out successfully",
      UserDetails: "User details fetched successfully",
      ResetPassword: "Reset password link has been sent to ",
      ChangePassword: "Password changed successfully",
    },
    Error: {
      EmailRequired: "Email is required",
      NotRegistered: "Email is not registered",
      UserExists: "User already exists",
      Registration: "User registration failed!, try again",
      Login: "Email or password does not match",
      UserDetails: "Failed to fetch user detail",
      Token: "Token is invalid or expired, try again",
      UserNotExists: "User does not exists",
      OldPassIncorrect: "Old password is incorrect",
      SamePass: "New password is same as old password",
    },
    Update: {
      UserDetails: "User details updated successfully",
    },
  },
  Category: {
    Success: {
      AllCategories: "Categories fetched successfully",
      CategoryById: "Category fetched successfully",
      CreateCategory: "Category created successfully",
      UpdateCategory: "Category updated successfully",
      DeleteCategory: "Category deleted successfully",
    },
    Error: {
      NotFound: "Category does not exists",
      CreateCategory: "Faced issue while created category",
      UpdateCategory: "Faced issue while updated category",
      DeleteCategory: "Faced issue while deleted category, try again",
    },
  },
  Stack: {
    Success: {
      AllStacks: "Stacks fetched successfully",
      StackById: "Stack fetched successfully",
      CreateStack: "Stack created successfully",
      UpdateStack: "Stack updated successfully",
      DeleteStack: "Stack deleted successfully",
    },
    Error: {
      NotFound: "Stack does not exists",
      CreateStack: "Faced issue while created stack",
      UpdateStack: "Faced issue while updated stack",
      DeleteStack: "Faced issue while deleted stack, try again",
    },
  },
};
