import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();
const PORT = process.env.FRONTEND_PORT || 3001;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Frontend servido en http://localhost:${PORT}`);
});
