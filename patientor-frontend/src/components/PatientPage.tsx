import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button, Container, Grid, GridColumn, Icon } from 'semantic-ui-react';

import { apiBaseUrl } from '../constants';
import { addEntry, setPatient, useStateValue } from "../state";
import { Entry, Gender, HealthCheckRating, Patient } from "../types";
import HealthRatingBar from './HealthRatingBar';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';
import AddEntryModal from '../AddEntryModal';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryBlock: React.FC<{ entry: Entry; iconName: string }> = ({ entry, iconName, children }) => {
  return (
    <div className="ui placehoder segment" key={entry.id}>
      <h4>{entry.date} <i className={iconName} /> </h4>
      <p><i>{entry.description}</i></p>
        {entry.diagnosisCodes ? <DiagnosisText codes={entry.diagnosisCodes}/> : null}
      {children}
    </div>
  );
};

const DiagnosisText: React.FC<{codes: string[]}> = ({ codes }) => {
  const [{ diagnosis },] = useStateValue();
  if(!codes) {
    return null;
  }
  const item = (code: string) => {
    if(diagnosis[code]) {
      return (
        <li key={"code" + code}>{code} {diagnosis[code].name}</li>
      );
    }
    return null;
  };

  return(
    <>
    <ul>
      {codes.map(code => item(code))}
    </ul>
    </>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  
  const getRating = (rating: HealthCheckRating): number => {
    //console.log("Rating number:", Number(rating));
    return rating;
  };

  switch (entry.type) {
    case "Hospital":
      return <EntryBlock key={entry.id} entry={entry} iconName="ambulance icon">
              Discharge: {entry.discharge.date}, criteria: {entry.discharge.criteria}
             </EntryBlock>;
    
      case "HealthCheck":
      return <EntryBlock key={entry.id} entry={entry} iconName="user md icon">
              <HealthRatingBar rating={getRating(entry.healthCheckRating)} showText={true}/>
            </EntryBlock>;

    case "OccupationalHealthcare":
      return <EntryBlock key={entry.id} entry={entry} iconName="hospital icon">
              Employer: {entry.employerName}
              <br/>{entry.sickLeave && 
                  `Sickleave from ${entry.sickLeave.startDate} to ${entry.sickLeave.endDate}.`}
            </EntryBlock>;
    
    default:
      return assertNever(entry);
  }
};

const PatientPage: React.FC = () => {
  const [{ patients, diagnosis }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();
  const currentPatient = patients[id];
  
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [modalType, setModalType] = React.useState<string>("HealthCheck");
  const [dialogTile, setDialogTitle] = React.useState<string>("Add Health Check Entry");
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (title: string, type: string): void => {
    setModalType(type);
    setModalOpen(true);
    setDialogTitle(title);
  };

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  React.useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data: patient } = await axios.get<Patient>(
          `${apiBaseUrl}/patients/${id}`
        );
        dispatch(setPatient(patient));
      } catch (e) {
        console.error(e);
        setError(e.response.data.error);
      }
    };
    if(!patients[id]) {
      fetchPatient();
    }
    //console.log("Patient: ", patients[id]);
    //console.log("Diagnosis: ", diagnosis);
  }, [dispatch, id, patients, diagnosis]);
  
  const genderIcon = (gender: Gender) => {
    switch(gender) {
      case Gender.Female:
        return <Icon name="venus" size="large"/>;
      case Gender.Male:
        return <Icon name="mars" size="large"/>;
      case Gender.Other:
        return <Icon name="venus mars" size="large"/>;
      default:
        return <Icon name="genderless" size="large"/>;
    }  
  }; 
  
  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entry`,
        values
      );

      dispatch(addEntry(id, newEntry));
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  if(currentPatient) {
    return (
      <div className="patient">
        <div>
          <h1>{currentPatient.name} {genderIcon(currentPatient.gender)}</h1>
          <p>ssn: {currentPatient.ssn ? currentPatient.ssn : "not known"}
            <br/>date of birth: {currentPatient.dateOfBirth ? currentPatient.dateOfBirth : "not known"}
            <br/>occupation: {currentPatient.occupation}
          </p>
          <div>
            <h2>Entries</h2>
            {currentPatient.entries.length === 0 && "No entries"}
            {currentPatient.entries.map(entry => EntryDetails({entry}))}
          </div>
        
        </div>
        <div>
          <AddEntryModal 
            title={dialogTile}
            type={modalType}
            modalOpen={modalOpen}
            onSubmit={submitNewEntry}
            error={error}
            onClose={closeModal}
            diagnosis={Object.values(diagnosis)}
            />
            <br/>

            <h2>Add New Entry</h2>
            <Container>
             
            <Grid columns={3}>
              <GridColumn  width={3}>
                <Button onClick={() => openModal("Add Health Check Entry", "HealthCheck")}>Add Health Check Entry</Button>
              </GridColumn>
              <GridColumn  width={3}>
                <Button onClick={() => openModal("Add Hospital Entry", "Hospital")}>Add Hospital Entry</Button>
              </GridColumn>
              <GridColumn  width={4}>
                <Button onClick={() => openModal("Add Occupational Health Care Entry", "OccupationalHealthcare")}>Add Occupational Health Care Entry</Button>
              </GridColumn>
          </Grid>
          
          </Container>
        </div>
      </div>
    );
  }
  return (
    <div>
      No such patient found!
    </div>
  );
};

export default PatientPage;
