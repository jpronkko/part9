import express from 'express';

import patientService from '../services/patientService';
import { 
  toNewVisitEntry, 
  toNewPatient, 
  toNewHealthCareEntry,
  toNewHospitalEntry,
  toNewOccupHCareEntry
} from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getNonSensitivePatients();
  res.json(patients);
});

router.get('/:id', (req, res) => {
  try {
    const patient = patientService.getPatient(req.params.id);
    res.json(patient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/', (req, res) => {
  console.group("Got patient: ", req.body);
  try {
    const entry = toNewPatient(req.body);
    const entries = patientService.addPatient(entry);
    res.json(entries);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/:id/entry', (req, res) => {
  console.log("Got entry: ", req.body);
  try {
    const patientId: string = req.params.id;
    
    const newEntry = toNewVisitEntry(req.body);
    switch(newEntry.type) {
      case "HealthCheck":
        const healthCareEntry = toNewHealthCareEntry(req.body, newEntry);
        const heEntry = patientService.addHealthCareEntry(patientId, healthCareEntry);
        res.json(heEntry);
        break;
      case "Hospital":
        const hospitalEntry = toNewHospitalEntry(req.body, newEntry);
        const hoEntry = patientService.addHospitalEntry(patientId, hospitalEntry);
        res.json(hoEntry);
        break;
      case "OccupationalHealthcare":
        const occupHCareEntry = toNewOccupHCareEntry(req.body, newEntry);
        const ohEntry = patientService.addOccupHCareEntry(patientId, occupHCareEntry);
        res.json(ohEntry);
        break;
      default:
        res.status(400).send("No such entry type!");
    }
    
  } catch (e) {
    res.status(400).send(e.message);
  }
});

export default router;