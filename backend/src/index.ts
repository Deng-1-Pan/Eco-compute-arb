// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Allows frontend to talk to backend
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Eco-Compute Arbitrageur Backend is Running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
