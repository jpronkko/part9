interface Result {
  periodLength: number,
  trainingDays: number,
  targetReached: boolean,
  target: number,
  rating: number,
  ratingDescription: string,
  average: number,
}

const calculateRating = (differenceToTaget: number) => {

  const descriptions = [
    'could be better', 'ok', 'good',
  ];

  const minGrade = 1;
  const maxGrade = 3;
  const gradeRange = maxGrade - minGrade;
  const center = gradeRange / 2;

  const rating = Math.ceil(Math.max(minGrade, Math.min(maxGrade, center + differenceToTaget)));
  const descrIndex = Math.floor((descriptions.length - 1) * (rating - minGrade) / gradeRange);
  console.log('d', descrIndex);
  const ratingDescription = descriptions[descrIndex];

  return { rating, ratingDescription };
};

export const calculateExercises = (exerciseHours: Array<number>, target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.reduce(
    (total, current) => current > 0 ? total + 1 : total, 0
  );
  const total = exerciseHours.reduce((total, current) => total + current, 0);
  const average = total / periodLength;

  const diff = average - target;
  const targetReached = diff >= 0;

  const rated = calculateRating(diff);

  return {
    periodLength,
    trainingDays,
    targetReached,
    target,
    rating: rated.rating,
    ratingDescription: rated.ratingDescription,
    average,
  };
};

// console.log(calculateExericeses([3, 0, 2, 4.5, 0, 3, 1], 7))
/*
const parseExeArguments = (args: Array<string>): Array<number> => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const values = args.slice(2);
  const results = values.map(item => {
    const number = Number(item);
    if (isNaN(number)) {
      throw new Error(`Provided item ${item} is not a number.`);
    }
    return number;
  });

  return results;
};


try {
  const numbers = parseExeArguments(process.argv);
  const conclusion = calculateExercises(numbers, 2);
  console.log(conclusion);
} catch (e) {
  console.error('Something went wrong:', (e as Error).message);
}*/