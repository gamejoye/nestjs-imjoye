export type Config = {
  environment: string;
  port: number;
  jwt: {
    secret: string;
  };
  avatar: {
    url: string;
    dir: string;
  };
  database: {
    type: 'mysql';
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
};

const configuration = (): Config => {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    avatar: {
      url: process.env.AVATAR_URL,
      dir: process.env.AVATAR_DIR,
    },
    database: {
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
    },
  };
};

export default configuration;
