import { WorkoutsData } from '@/data/workouts';
import WorkoutTracker from '@/components/WorkoutTracker';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function getWorkouts(): Promise<WorkoutsData> {
  const filePath = path.join(process.cwd(), 'src/data/workouts.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export default async function Home() {
  const data = await getWorkouts();
  return <WorkoutTracker workouts={data.workouts} />;
}
