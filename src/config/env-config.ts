import dotenv from "dotenv";

dotenv.config();

interface ENV {
  nodeEnv?: string;
  port?: string;
  mongoUri?: string;
  frontendUrl?: string;
  jwtSecret?: string;
  jwtExpiry?: string;
}

const _envConfig: ENV = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  frontendUrl: process.env.FRONTEND_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY,
  nodeEnv: process.env.NODE_ENV,
};

export const getConfig = (key: string) => {
  const value = _envConfig[key as keyof ENV];
  
  if (!value) {
    console.log(`Not able to find ${key} in environments`);
    process.exit();
  }
  return value;
};
