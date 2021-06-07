import React from "react";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { Dropdown, DropdownProps, Form } from "semantic-ui-react";
import { Diagnosis, HealthCheckRating } from "../types";
import { TextField } from "../AddPatientModal/FormField";

export type HealthCheckOption = {
  value: HealthCheckRating;
  label: string;
};

// props for select field component
type SelectHealthProps = {
  name: string;
  label: string;
  options: HealthCheckOption[];
};

// {option.label || option.value}
export const SelectHealthRatingField: React.FC<SelectHealthProps> = ({
  name,
  label,
  options
}: SelectHealthProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map((option: { value: HealthCheckRating; label: string }) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Field>
  </Form.Field>
);

export const DischargeEntry = () => {
  return (
    <>
      <h3>Discharge</h3>
      <Field
        label="Date"
        placeholder="YYYY-MM-DD"
        name="discharge.date"
        component={TextField}
      />
      <Field
        label="Criteria"
        placeholder="Criteria for discharge"
        name="discharge.criteria"
        component={TextField}
      />
    </>)
}

export const OccupHCarePrmEntry = () => {
  return (
    <>
      <Field
        label="Employer"
        placeholder="Employer name"
        name="employerName"
        component={TextField}
      />
      <Field
        label="Sickleave start"
        placeholder="YYYY-MM-DD"
        name="sickLeave.startDate"
        component={TextField}
      />
      <Field
        label="Sickleave end"
        placeholder="YYYY-MM-DD"
        name="sickLeave.endDate"
        component={TextField}
      />
    </>
  )
}

interface DiagnosisCodes {
  diagnosisCodes: string[];
}

export const DiagnosisSelection = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const field = "diagnosisCodes";

  const fmikProps = useFormikContext<DiagnosisCodes>();

  const onChange = (
    _event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    fmikProps.setFieldValue(field, data.value);
  };

  const stateOptions = diagnoses.map(diagnosis => ({
    key: diagnosis.code,
    text: `${diagnosis.name} (${diagnosis.code})`,
    value: diagnosis.code
  }));

  return (
    <Form.Field>
      <label>Diagnoses</label>
      <Dropdown
        key={"diag dropdown"}
        fluid
        multiple
        search
        selection
        options={stateOptions}
        onChange={onChange}
      />
      <ErrorMessage name={field} />
    </Form.Field>
  );
};

