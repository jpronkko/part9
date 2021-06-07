import express from 'express';
import diagnoseService from '../services/diagnoseService';
import { toNewDiagnoseEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const entries = diagnoseService.getEntries();
  res.json(entries);
});

router.post('/', (req, res) => {
  try {
    const entry = toNewDiagnoseEntry(req.body);
    const entries = diagnoseService.addEntry(entry);
    res.json(entries);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;