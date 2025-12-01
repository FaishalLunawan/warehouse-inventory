export const config = {
  port: process.env.PORT || 5000,
  database: {
    file: process.env.DB_FILE || 'database.sqlite'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
  }
};