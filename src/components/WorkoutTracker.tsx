'use client';

import { useState, useCallback } from 'react';
import type { Workout } from '@/data/workouts';
import ExerciseCard from './ExerciseCard';
import WorkoutSection from './WorkoutSection';
import ProgressBar from './ProgressBar';
import Link from 'next/link';

type Props = {
  workouts: Workout[];
};

export default function WorkoutTracker({ workouts }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const toggle = useCallback((key: string) => {
    setCheckedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getProgress = (workout: Workout) => {
    let total = 0;
    let done = 0;

    if (workout.type === 'flat' && workout.exercises) {
      workout.exercises.forEach((_, i) => {
        const key = `${workout.id}-0-${i}`;
        total++;
        if (checkedMap[key]) done++;
      });
    } else if (workout.type === 'sectioned' && workout.sections) {
      workout.sections.forEach((sec, si) => {
        sec.exercises.forEach((_, i) => {
          const key = `${workout.id}-${si}-${i}`;
          total++;
          if (checkedMap[key]) done++;
        });
      });
    }

    return { total, done };
  };

  const resetWorkout = (workout: Workout) => {
    setCheckedMap((prev) => {
      const next = { ...prev };
      if (workout.type === 'flat' && workout.exercises) {
        workout.exercises.forEach((_, i) => delete next[`${workout.id}-0-${i}`]);
      } else if (workout.type === 'sectioned' && workout.sections) {
        workout.sections.forEach((sec, si) => {
          sec.exercises.forEach((_, i) => delete next[`${workout.id}-${si}-${i}`]);
        });
      }
      return next;
    });
  };

  const currentWorkout = workouts[activeTab];
  const { total, done } = getProgress(currentWorkout);

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Header */}
      <div className="bg-linear-to-r from-[#1a1a2e] to-[#16213e] border-b-2 border-[#e94560] px-4 py-5 text-center">
        <h1 className="text-xl font-bold tracking-wide">💪 My Workout Plans</h1>
        <p className="text-xs text-gray-400 mt-1">Tap each exercise to mark it done</p>

        <Link
          href="/admin"
          className="inline-block mt-2 text-[11px] text-[#e94560] border border-[#e94560] px-3 py-1 rounded-lg hover:bg-[#e94560] hover:text-white transition"
        >
          ⚙️ Admin
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-[#16213e] border-b border-[#2a2a3e] px-3 gap-1">
        {workouts.map((w, i) => (
          <button
            key={w.id}
            onClick={() => setActiveTab(i)}
            className={`py-3 px-3 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap border-b-2 transition-all ${
              activeTab === i
                ? 'text-[#e94560] border-[#e94560]'
                : 'text-gray-500 border-transparent hover:text-[#e94560]'
            }`}
          >
            {w.title.replace(' Training —', '')}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-4">
        <ProgressBar done={done} total={total} />

        {/* Flat workout */}
        {currentWorkout.type === 'flat' && currentWorkout.exercises && (
          <div className="flex flex-col gap-2">
            {currentWorkout.exercises.map((ex, i) => {
              const key = `${currentWorkout.id}-0-${i}`;
              return (
                <ExerciseCard
                  key={key}
                  index={i}
                  name={ex.name}
                  sets={ex.sets}
                  note={ex.note}
                  isWarmup={ex.isWarmup}
                  isDone={!!checkedMap[key]}
                  onToggle={() => toggle(key)}
                />
              );
            })}
          </div>
        )}

        {/* Sectioned workout */}
        {currentWorkout.type === 'sectioned' && currentWorkout.sections && (
          <div>
            {currentWorkout.sections.map((sec, si) => (
              <WorkoutSection
                key={si}
                section={sec}
                sectionIndex={si}
                checkedMap={checkedMap}
                onToggle={toggle}
                workoutId={currentWorkout.id}
              />
            ))}
          </div>
        )}

        {/* Reset button */}
        <button
          onClick={() => resetWorkout(currentWorkout)}
          className="w-full mt-6 py-3 border border-[#e94560] text-[#e94560] rounded-xl text-sm font-semibold hover:bg-[#e94560] hover:text-white transition-all"
        >
          🔄 Reset This Workout
        </button>
      </div>
    </div>
  );
}
