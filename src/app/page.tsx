import { workouts } from '@/data/workouts';
import WorkoutTracker from '@/components/WorkoutTracker';

export default function Home() {
  return <WorkoutTracker workouts={workouts} />;
}
