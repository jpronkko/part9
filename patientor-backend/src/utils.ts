import { 
  VisitType, 
  NewVisitEntry, 
  NewHealthCheckEntry, 
  NewHospitalEntry, 
  NewOccupationalHealthcareEntry, 
  Gender, 
  NewPatient, 
  NewDiagnoseEntry, 
  HealthCheckRating, 
  Discharge, 
  Sickleave 
} from './types';

type NewDiagnoseFields = { code: unknown, name: unknown, latin: unknown };

type NewPatientFields = { 
  name: unknown, 
  occupation: unknown, 
  gender: unknown, 
  ssn: unknown, 
  dateOfBirth: unknown, 
  entries: unknown 
};

interface TypeCheckEntry {
  type: unknown;
}

interface NewVisitEntryFields extends TypeCheckEntry { 
  description: unknown; 
  date: unknown;
  specialist: unknown; 
  diagnosisCodes: unknown; 
}

interface NewHealthCheckEntryFields { 
  healthCheckRating: unknown;
}

interface NewHospitalEntryFields { 
  discharge: unknown;
}

interface OccupationalHCareEntryFields { 
  employerName: unknown;
  sickLeave: unknown;
}

interface DischargeFields  {
  date: unknown;
  criteria: unknown;
} 

interface SickleaveFields  {
  startDate: unknown;
  endDate: unknown;
} 

const toNewPatient = ({ name, occupation, gender, ssn, dateOfBirth } : NewPatientFields): NewPatient => {
  const newPatient: NewPatient = {
    name: parseString(name, 'name'),
    occupation: parseString(occupation, 'occupation'),
    gender: parseGender(gender),
    ssn: ssn ? parseString(ssn, 'ssn') : undefined,
    dateOfBirth: dateOfBirth ? parseDate(dateOfBirth) : undefined,
    entries: []
  };

  return newPatient;
};

const toNewDiagnoseEntry = ({ code, name, latin } : NewDiagnoseFields): NewDiagnoseEntry => {
  const newEntry: NewDiagnoseEntry = {
    code: parseString(code, 'code'),
    name: parseString(name, 'name'),
    latin: latin ? parseString(latin, 'latin') : undefined,
  };

  return newEntry;
};

const toNewVisitEntry = ({ 
  type, 
  description, 
  date, 
  specialist, 
  diagnosisCodes,
}: NewVisitEntryFields): NewVisitEntry => {
  
  const newEntry: NewVisitEntry = {
    type: parseVisitType(type),
    description: parseString(description, 'description'),
    date: parseDate(date),
    specialist: parseString(specialist, 'specialist'),
    diagnosisCodes: parseDiagCodes(diagnosisCodes),
  };

  return newEntry;
};

const toNewHealthCareEntry = (
  { healthCheckRating }: NewHealthCheckEntryFields, 
  visitEntry: NewVisitEntry
  ): NewHealthCheckEntry => {
  
  const newHCareEntry: NewHealthCheckEntry = {
    healthCheckRating: parseHealthCheckRating(healthCheckRating),
    type: "HealthCheck",
    description: visitEntry.description,
    date: visitEntry.date,
    specialist: visitEntry.specialist,
    diagnosisCodes: visitEntry.diagnosisCodes
  };

  return newHCareEntry;
};

const toNewHospitalEntry = (
  { discharge }: NewHospitalEntryFields, 
  visitEntry: NewVisitEntry
  ): NewHospitalEntry => {

  const newHCareEntry: NewHospitalEntry = {
    discharge: parseDischarge(discharge as DischargeFields),
    type: "Hospital",
    description: visitEntry.description,
    date: visitEntry.date,
    specialist: visitEntry.specialist,
    diagnosisCodes: visitEntry.diagnosisCodes
  };

  return newHCareEntry;
};

const toNewOccupHCareEntry = ({ employerName, sickLeave }: OccupationalHCareEntryFields, visitEntry: NewVisitEntry): NewOccupationalHealthcareEntry => {
  const newHCareEntry: NewOccupationalHealthcareEntry = {
    employerName: parseString(employerName, 'employerName'),
    type: "OccupationalHealthcare",
    description: visitEntry.description,
    date: visitEntry.date,
    specialist: visitEntry.specialist,
    diagnosisCodes: visitEntry.diagnosisCodes
  };

  if(sickLeave) {
    const parsedSickleave = parseSickleave(sickLeave as SickleaveFields);
    if(parsedSickleave) {
      newHCareEntry.sickLeave = parsedSickleave;
    }
  }

  return newHCareEntry;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating === undefined || !isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing rating: ' + rating);
  }
  return rating;
};

const parseDischarge = ({date, criteria}: DischargeFields) : Discharge => {  
  const newDischarge : Discharge = {
    date: parseDate(date),
    criteria: parseString(criteria, 'criteria')
  };

  return newDischarge;
};

const parseSickleave = ({startDate, endDate}: SickleaveFields) : Sickleave|undefined => {     
  if(startDate === '' && endDate === '') {
    return undefined;
  }
 
  const newSickleave : Sickleave = {
    startDate: parseDate(startDate),
    endDate: parseDate(endDate)
  };

  return newSickleave;
};

const parseDiagCodes = (codes: unknown) : string[] => {
  
  if(!codes)
    return [];

  if(!isStringArray(codes)) {
    throw Error("Diagnosis codes malformed!");
  }

  return codes;
}; 

const parseString = (stringPrm: unknown, prmName: string): string => {
  if(!stringPrm || !isString(stringPrm)) {
    throw new Error('Incorrect or missing ' + prmName + ': ' + stringPrm);
  }
  return stringPrm;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseVisitType = (type: unknown): VisitType => {
  if(!type)
    throw new Error('Incorrect or missing visit type: ' + type);
  
  switch(type) {
    case "HealthCheck":
      return "HealthCheck";
    case "Hospital":
      return "Hospital";
    case "OccupationalHealthcare":
      return "OccupationalHealthcare";
    default:
      throw new Error('Incorrect or missing visit type: ' + type);
  }
};

const isStringArray = (value: unknown): value is string[] => {
  if (value instanceof Array) {
    for(const item of value){
      if (typeof item !== 'string') {
        return false;
      }
    }
    return true;
  }
  return false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
}; 

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.keys(HealthCheckRating).includes(param) || Object.values(HealthCheckRating).includes(param);
};


export {
  toNewPatient,
  toNewDiagnoseEntry,
  toNewVisitEntry,
  toNewHealthCareEntry,
  toNewHospitalEntry,
  toNewOccupHCareEntry
};
