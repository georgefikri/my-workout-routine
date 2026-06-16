import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { promises as fs } from 'fs';
import path from 'path';
import type { WorkoutsData } from '@/data/workouts';

const redis = Redis.fromEnv();
const KV_KEY = 'workouts';

async function getLocalData(): Promise<WorkoutsData> {
  const filePath = path.join(process.cwd(), 'src/data/workouts.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

export async function GET() {
  try {
    let data = await redis.get<WorkoutsData>(KV_KEY);

    if (!data) {
      data = await getLocalData();
      await redis.set(KV_KEY, data);
    }

    return NextResponse.json(data);
  } catch {
    try {
      const data = await getLocalData();
      return NextResponse.json(data);
    } catch {
      return NextResponse.json({ error: 'Failed to read workouts' }, { status: 500 });
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await redis.set(KV_KEY, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save workouts' }, { status: 500 });
  }
}
