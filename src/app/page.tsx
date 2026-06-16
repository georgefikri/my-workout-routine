import { WorkoutsData } from '@/data/workouts';
import WorkoutTracker from '@/components/WorkoutTracker';
import { Redis } from '@upstash/redis';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

async function getWorkouts(): Promise<WorkoutsData> {
  try {
    const data = await redis.get<WorkoutsData>('workouts');

    if (!data) {
      const filePath = path.join(process.cwd(), 'src/data/workouts.json');
      const raw = await fs.readFile(filePath, 'utf-8');
      const localData: WorkoutsData = JSON.parse(raw);
      await redis.set('workouts', localData);
      return localData;
    }

    return data;
  } catch {
    const filePath = path.join(process.cwd(), 'src/data/workouts.json');
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  }
}

export default async function Home() {
  const data = await getWorkouts();
  return <WorkoutTracker workouts={data.workouts} />;
}
