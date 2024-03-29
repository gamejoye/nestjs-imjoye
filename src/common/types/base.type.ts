export type IDatabaseConfig = {
  host: string;
  port: number;
  type: 'mysql';
  username: string;
  password: string;
  database: string;
};

export type IJwtConfig = {
  secret: string;
};
