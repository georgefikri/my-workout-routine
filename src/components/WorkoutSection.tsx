'use client';

import ExerciseCard from './ExerciseCard';
import type { Section } from '@/data/workouts';

type Props = {
  section: Section;
  sectionIndex: number;
  checkedMap: Record<string, boolean>;
  onToggle: (key: string) => void;
  workoutId: string;
};

export default function WorkoutSection({
  section,
  sectionIndex,
  checkedMap,
  onToggle,
  workoutId,
}: Props) {
  const color = section.color ?? '#e94560';

  return (
    <div className="mb-4">
      {/* Section label */}
      <div
        className="text-[11px] font-bold uppercase tracking-widest mb-2 mt-5"
        style={{ color }}
      >
        {section.label}
      </div>

      <div
        className="rounded-xl border p-3 flex flex-col gap-2"
        style={{ borderColor: `${color}33`, backgroundColor: '#1e1b2e' }}
      >
        {section.exercises.map((ex, i) => {
          const key = `${workoutId}-${sectionIndex}-${i}`;
          return (
            <ExerciseCard
              key={key}
              index={i}
              name={ex.name}
              sets={ex.sets}
              note={ex.note}
              isWarmup={ex.isWarmup}
              isDone={!!checkedMap[key]}
              onToggle={() => onToggle(key)}
              color={color}
            />
          );
        })}
      </div>
    </div>
  );
}
