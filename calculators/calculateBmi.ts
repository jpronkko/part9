interface bmiParam {
  height: number,
  weight: number,
}

export const calculateBmi = (bmiParam: bmiParam): string => {
  const { height, weight } = { ...bmiParam };

  const bmi = weight / Math.pow(height / 100, 2);
  if (bmi > 30) {
    return 'Obese (not healthy)';
  }
  if (bmi > 25) {
    return 'Overweight (not healthy)';
  }
  if (bmi < 18.5) {
    return 'Underweight (not healthy)';
  }
  return 'Normal weight (healthy)';
};


/*export const parseBMIArguments = (args: Array<string>): bmiParam => {
  console.log("Args:", args);

  if (args.length != 4) {
    throw new Error('Wrong args: need height (cm) and weight (kg)');
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);
  if (isNaN(height) || isNaN(weight)) {
    throw new Error(`Both arguments need to be numbers!`);
  }

  return { height, weight };
};

//console.log(calculateBmi({ height: 180, weight: 88 }))
try {
  const bmiArgs = parseBMIArguments(process.argv);
  console.log(calculateBmi(bmiArgs));
} catch (e) {
  console.error('Something went wrong:', (e as Error).message);
}
*/