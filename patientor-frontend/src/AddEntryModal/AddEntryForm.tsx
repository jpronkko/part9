import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { TextField } from "../AddPatientModal/FormField";
import { SelectHealthRatingField, DiagnosisSelection, HealthCheckOption, DischargeEntry, OccupHCarePrmEntry } from "./FormEntries";
import { Diagnosis, HealthCheckRating, Entry, UnionOmit, HospitalEntry, OccupationalHealthcareEntry, Sickleave } from "../types";

// Define Entry without the 'id' property
export type EntryFormValues = UnionOmit<Entry, 'id'>;

interface Props {
  initialValues: EntryFormValues;
  diagnosis: Diagnosis[];
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

const healthRatingOptions: HealthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "Low Risk" },
  { value: HealthCheckRating.HighRisk, label: "Hight Risk", },
  { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" },
];

type Dictionary = {
  [x: string]: string | Dictionary | undefined;
};

export const AddEntryForm: React.FC<Props> = ({ initialValues, diagnosis, onSubmit, onCancel }) => {

  const checkDate = (date: string): string => {
    if (!/\d{4}-\d{1,2}-\d{1,2}/.test(date)) {
      return "Invalid date format, go for YYYY-MM-DD.";
    } else if (!Date.parse(date)) {
      return "Invalid date, go for YYYY-MM-DD.";
    }
    return "";
  };

  const checkSickleave = (sickLeave: Sickleave): Dictionary => {
    let sickLeaveErrors = {};
    if (!sickLeave.startDate && !sickLeave.endDate) {
      return sickLeaveErrors;
    }

    if (!sickLeave.startDate && sickLeave.endDate) {
      sickLeaveErrors = { "startDate": "Needs this if sick leave." };
    } else if (sickLeave.startDate) {
      const malformedError = checkDate(sickLeave.startDate);
      if (malformedError)
        sickLeaveErrors = { "startDate": malformedError };
    }

    if (!sickLeave.endDate && sickLeave.startDate) {
      sickLeaveErrors = { ...sickLeaveErrors, "endDate": "Needs this if sick leave." };
    } else if (sickLeave.endDate) {
      const malformedError = checkDate(sickLeave.endDate);
      if (malformedError)
        sickLeaveErrors = { ...sickLeaveErrors, "endDate": malformedError };
    }

    return sickLeaveErrors;
  };

  return (
    <Formik
      initialValues={initialValues}

      onSubmit={onSubmit}
      validate={values => {
        //console.log("Validating values: ", values);

        const requiredError = "Field is required";
        const errors: Dictionary = {};

        if (!values.description) {
          errors.description = requiredError;
        }

        if (!values.date) {
          errors.date = requiredError;
        } else {
          const malformedError = checkDate(values.date);
          if (malformedError)
            errors.date = malformedError;
        }

        if (!values.specialist) {
          errors.specialist = requiredError;
        }

        if (values.diagnosisCodes) {
          const diagnosisCodes = diagnosis.map(d => d.code);
          const codeErrors: string[] = [];
          values.diagnosisCodes.forEach(
            item => {
              if (!diagnosisCodes.includes(item)) {
                codeErrors.push(item);
              }
            });
          if (codeErrors.length > 0) {
            errors.diagnosisCodes = "The following code/codes are invalid:" + codeErrors.join();
          }
        }

        if (initialValues.type === "Hospital") {
          const hEntry = values as HospitalEntry;

          if (!hEntry.discharge) {
            errors.discharge = requiredError;
          } else if (!hEntry.discharge.date) {
            errors.discharge = { "date": "Invalid discharge, no date" };
          } else {
            const malformedError = checkDate(hEntry.discharge.date);
            if (malformedError)
              errors.discharge = { "date": malformedError };
          }
        }

        if (initialValues.type === "OccupationalHealthcare") {
          const oEntry = values as OccupationalHealthcareEntry;

          if (!oEntry.employerName) {
            errors.employerName = requiredError;
          }

          if (oEntry.sickLeave) {
            const sickLeaveErrors = checkSickleave(oEntry.sickLeave);

            if (Object.keys(sickLeaveErrors).length !== 0) {
              errors.sickLeave = sickLeaveErrors;
            }
          }
        }

        ///console.log("Validation Errors ", errors);
        return errors;
      }}
    >
      {({ isValid, dirty }) => {
        //console.log("Valid: ", isValid, " dirty ", dirty);
        return (
          <Form className="form ui">
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />

            <DiagnosisSelection
              diagnoses={diagnosis}
            />

            {initialValues.type === "HealthCheck" && <SelectHealthRatingField
              label="Health rating"
              name="healthCheckRating"
              options={healthRatingOptions}
            />}

            {initialValues.type === "Hospital" &&
              <DischargeEntry />
            }

            {initialValues.type === "OccupationalHealthcare" &&
              <OccupHCarePrmEntry />
            }

            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
