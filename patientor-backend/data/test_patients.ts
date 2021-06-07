import { Gender, Patient } from '../src/types';

const patientEntries: Array<Patient> = [
  {
    "id": "abc",
    "name": "Ilkka Tannenbaum",
    "occupation": "Consultant",
    "gender": Gender.Male,
    "ssn": "176-671",
    "dateOfBirth": "10-10-1992",
    "entries": []
  }
];

export default patientEntries;

/*export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
}*/

