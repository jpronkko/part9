import express from 'express';
import * as bmi from './calculateBmi';
import * as exeCalc from './exerciseCalculator';


const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  //console.log("height: ", height, " weight ", weight, " req ", req.query);
  if (isNaN(height) || isNaN(weight)) {
    res.json({ error: "malformatted parameters" });
  } else {
    const result = bmi.calculateBmi({ height, weight });
    res.json({ weight, height, bmi: result });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  
  if(!daily_exercises || !target) {
    res.json({ error: "parameters missing"});
    return;
  }

  const targetValue = Number(target);
  if(isNaN(targetValue)) {
    res.json({ error: "malformatted parameters"});
    return;
  } 

  try {
    //console.log("Data:", daily_exercises);
    const result = exeCalc.calculateExercises(daily_exercises, targetValue);
    res.json(result);
  } catch(e) {
    console.log("Error: ", (e as Error).message);
    res.json({ error: "malformatted parameters"});
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});