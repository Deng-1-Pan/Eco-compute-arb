// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GridService } from './data/MockGrid';
import { JobQueue } from './data/MockJobs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const jobQueue = new JobQueue(); // Initialize our mock jobs

app.use(cors());
app.use(express.json());

// TEST ENDPOINT: See grid status for a specific hour
app.get('/grid-status/:hour', (req, res) => {
  const hour = parseInt(req.params.hour);
  const data = GridService.getGridState(hour);
  res.json(data);
});

// TEST ENDPOINT: See current jobs
app.get('/jobs', (req, res) => {
  res.json(jobQueue.getJobs());
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
