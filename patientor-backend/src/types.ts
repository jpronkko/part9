
export interface DiagnoseEntry {
  id: string;
  code: string;
  name: string;
  latin?: string;
}

export type NewDiagnoseEntry = Omit<DiagnoseEntry, 'id'>;

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3
}

export interface Discharge {
  date: string;
  criteria: string;
}

export interface Sickleave {
  startDate: string;
  endDate: string;
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<DiagnoseEntry['code']>;
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: Sickleave;
}

export type VisitType = "HealthCheck" | "Hospital" | "OccupationalHealthcare";

export type VisitEntry =
  | HealthCheckEntry
  | HospitalEntry
  | OccupationalHealthcareEntry;


export type NewVisitEntry = Omit<VisitEntry, 'id'>;
export type NewHealthCheckEntry = Omit<HealthCheckEntry, 'id'>;
export type NewHospitalEntry = Omit<HospitalEntry, 'id'>;
export type NewOccupationalHealthcareEntry = Omit<OccupationalHealthcareEntry, 'id'>;


export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: VisitEntry[];
}

export type NewPatient = Omit<Patient, 'id'>;

export type NoSensitivePatient = Omit<Patient, 'ssn'>;

// Define special omit for unions
//type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;
// Define Entry without the 'id' property
//type NewVisitEntry = UnionOmit<VisitEntry, 'id'>;