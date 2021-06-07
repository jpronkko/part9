import diaryData from '../../data/test_diagnoses';
import { NewDiagnoseEntry, DiagnoseEntry } from '../types';
import * as uuid from 'uuid';

const getDiagnoseEntries = (): Array<DiagnoseEntry> => {
  return diaryData;
};

const addDiagnoseEntry = (entry: NewDiagnoseEntry): DiagnoseEntry => {
  const newEntry = {
    id: uuid.v4(),
    ...entry
  };
  
  diaryData.push(newEntry);
  return newEntry;
};

export default {
  getEntries: getDiagnoseEntries,
  addEntry: addDiagnoseEntry
};