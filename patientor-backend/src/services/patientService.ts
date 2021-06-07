import patientData from '../../data/test_patients2';
import { 
  Patient, 
  NewPatient, 
  NoSensitivePatient, 
  NewHealthCheckEntry,
  NewHospitalEntry,
  NewOccupationalHealthcareEntry,
  HealthCheckEntry,
  HospitalEntry,
  OccupationalHealthcareEntry
} from '../types';

import * as uuid from 'uuid';

const getNonSensitivePatients = (): NoSensitivePatient[] => {
  return patientData.map(({ id, name, occupation, gender, dateOfBirth, entries }) => ({
    id,
    name, 
    occupation,
    gender,
    dateOfBirth,
    entries
  }));
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid.v4(),
    ...patient
  };
  patientData.push(newPatient);
  return newPatient;
};

const addHealthCareEntry = (id: string, entry: NewHealthCheckEntry): HealthCheckEntry => {
  const patient = patientData.find(p => p.id === id);
  if(!patient) {
    throw new Error(`Patient not found with id:${id}`);
  }

  const newEntry: HealthCheckEntry = {
    id: uuid.v4(),
    ...entry
  };
  patient.entries.push(newEntry);
  return newEntry;
}; 

const addOccupHCareEntry = (id: string, entry: NewOccupationalHealthcareEntry): OccupationalHealthcareEntry => {
  const patient: Patient = getPatient(id);

  const newEntry: OccupationalHealthcareEntry = {
    id: uuid.v4(),
    ...entry
  };
  patient.entries.push(newEntry);
  return newEntry;
}; 

const addHospitalEntry = (id: string, entry: NewHospitalEntry): HospitalEntry => {
  const patient: Patient = getPatient(id);

  const newEntry: HospitalEntry = {
    id: uuid.v4(),
    ...entry
  };
  patient.entries.push(newEntry);
  return newEntry;
}; 

const getPatient = (id: string) : Patient => {
  const patient = patientData.find(p => p.id === id);
  if(!patient) {
    throw new Error(`Patient not found with id:${id}`);
  }
  return patient;
};

export default {
  addPatient,
  getPatient,
  getNonSensitivePatients,
  addHealthCareEntry,
  addOccupHCareEntry,
  addHospitalEntry
};