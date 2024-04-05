export const EndPoints = {
  V1: "/api/v1",
  User: {
    Path: "user",
    Get: {
      Logout: "logout",
      Profile: "me",
    },
    Post: {
      Register: "register",
      Login: "login",
      ForgotPassword: "forgot-password",
      ResetPassword: "reset-password",
      ChangePassword: "change-password",
      UpdateProfile: "update-me",
    },
  },
  Category:{
    Path: 'category',
    Get: {

    },
    Post: {
        
    }
  }
};
