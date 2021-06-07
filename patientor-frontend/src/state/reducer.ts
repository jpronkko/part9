import { State } from "./state";
import { Diagnosis, EntryToAdd, Entry, Patient } from "../types";

export const setDiagnosisList = (diagnosisList: Diagnosis[]): Action => {
  return { type: "SET_DIAGNOSIS_LIST", payload: diagnosisList};
};

export const setPatientList = (patientList: Patient[]): Action => {
  return { type: "SET_PATIENT_LIST", payload: patientList};
};

export const addPatient = (patient: Patient): Action => {
  return { type: "ADD_PATIENT", payload: patient};
};

export const setPatient = (patient: Patient): Action => {
  return { type: "SET_PATIENT", payload: patient};
};

export const addEntry = (patientId: string, entry: Entry): Action => {
  return { type: "ADD_ENTRY", payload: { patientId, entry } };
};

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: Patient[];
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
    type: "SET_PATIENT";
    payload: Patient;
  }
  | {
    type: "SET_DIAGNOSIS_LIST";
    payload: Diagnosis[];
  } 
  | {
    type: "ADD_ENTRY";
    payload: EntryToAdd;
  };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnosis: {
          ...action.payload.reduce(
            (foo, diag) => ({ ...foo, [diag.code]: diag}),
            {}
          ),
        }
      };
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_PATIENT":
      const patientId = action.payload.id;
      const newPatients = state.patients;

      if(newPatients[patientId]) {
        newPatients[patientId] = action.payload;
        return {
          ...state,
          patients: newPatients 
        };
      }
      return state;
    case "ADD_ENTRY":
      const patId = action.payload.patientId;
      const newPatiens = state.patients;
      let newPatient = newPatiens[patId];
      
      if(newPatient) {
        newPatient = { ...newPatient, entries: [...newPatient.entries, action.payload.entry ]};
        newPatiens[patId] = newPatient;
        const newState = {
          ...state,
          patients: newPatiens
        };
        return newState;
      } 

      return state; 
    default:
      return state;
  }
};
