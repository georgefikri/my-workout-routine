export type Exercise = {
  name: string;
  sets?: string;
  note?: string;
  isWarmup?: boolean;
};

export type Section = {
  label: string;
  color?: string;
  exercises: Exercise[];
};

export type Workout = {
  id: string;
  title: string;
  type: 'flat' | 'sectioned';
  exercises?: Exercise[];
  sections?: Section[];
};

export type WorkoutsData = {
  workouts: Workout[];
};
