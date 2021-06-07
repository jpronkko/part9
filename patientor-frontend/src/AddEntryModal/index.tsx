import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import AddEntryForm, { EntryFormValues } from './AddEntryForm';

import { Diagnosis, HealthCheckRating } from '../types';

interface Props {
  title: string;
  type: string;
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnosis: Diagnosis[];
  error?: string;
}

const healthcareValues: EntryFormValues = {
  type: "HealthCheck",
  description: "",
  date: "",
  specialist: "",
  diagnosisCodes: [],
  healthCheckRating: HealthCheckRating.Healthy
};

const hospitalValues: EntryFormValues = {
  type: "Hospital",
  description: "",
  date: "",
  specialist: "",
  diagnosisCodes: [],
  discharge: { date: "", criteria: ""}
};

const occupHealthcareValues: EntryFormValues = {
  type: "OccupationalHealthcare",
  description: "",
  date: "",
  specialist: "",
  diagnosisCodes: [],
  employerName: "",
  sickLeave: { startDate: "", endDate: ""}
};

const AddEntryModal = ({ title, type, modalOpen, onClose, onSubmit, diagnosis, error }: Props) => {
  const getInitalValues = (type: string): EntryFormValues => {
    switch(type) {
      case "HealthCheck":
        return healthcareValues;
      case "Hospital":
        return hospitalValues;
      case "OccupationalHealthcare":
        return occupHealthcareValues;
    }
    throw new Error(`Error in form initial value types, no such type: ${type}.`);
  };

  return (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>{title}</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      <AddEntryForm initialValues={getInitalValues(type)} diagnosis={diagnosis} onSubmit={onSubmit} onCancel={onClose} />
    </Modal.Content>
  </Modal>
  );
  };

export default AddEntryModal;
