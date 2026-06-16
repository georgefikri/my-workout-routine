'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Workout, Exercise, Section } from '@/data/workouts';

const ADMIN_PASSWORD = 'gym123';

type ModalState = {
  workoutId: string;
  sectionIndex: number;
  exerciseIndex: number | null; // null = adding new
  current: Exercise;
} | null;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

  // Load workouts
  useEffect(() => {
    if (!authed) return;
    fetch('/api/workouts')
      .then((r) => r.json())
      .then((d) => {
        setWorkouts(d.workouts);
        setActiveId(d.workouts[0]?.id ?? '');
      });
  }, [authed]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const save = useCallback(async (updated: Workout[]) => {
    setSaving(true);
    try {
      await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workouts: updated }),
      });
      showToast('✅ Saved!');
    } catch {
      showToast('❌ Save failed');
    } finally {
      setSaving(false);
    }
  }, []);

  // Delete exercise
  const deleteExercise = (workoutId: string, sectionIndex: number, exIndex: number) => {
    if (!confirm('Delete this exercise?')) return;
    const updated = workouts.map((w) => {
      if (w.id !== workoutId) return w;
      if (w.type === 'flat' && w.exercises) {
        return { ...w, exercises: w.exercises.filter((_, i) => i !== exIndex) };
      }
      if (w.type === 'sectioned' && w.sections) {
        return {
          ...w,
          sections: w.sections.map((sec, si) =>
            si !== sectionIndex
              ? sec
              : { ...sec, exercises: sec.exercises.filter((_, i) => i !== exIndex) },
          ),
        };
      }
      return w;
    });
    setWorkouts(updated);
    save(updated);
  };

  // Move exercise up/down
  const moveExercise = (
    workoutId: string,
    sectionIndex: number,
    exIndex: number,
    dir: -1 | 1,
  ) => {
    const updated = workouts.map((w) => {
      if (w.id !== workoutId) return w;
      const swapInArray = (arr: Exercise[]) => {
        const newArr = [...arr];
        const target = exIndex + dir;
        if (target < 0 || target >= newArr.length) return newArr;
        [newArr[exIndex], newArr[target]] = [newArr[target], newArr[exIndex]];
        return newArr;
      };
      if (w.type === 'flat' && w.exercises) {
        return { ...w, exercises: swapInArray(w.exercises) };
      }
      if (w.type === 'sectioned' && w.sections) {
        return {
          ...w,
          sections: w.sections.map((sec, si) =>
            si !== sectionIndex ? sec : { ...sec, exercises: swapInArray(sec.exercises) },
          ),
        };
      }
      return w;
    });
    setWorkouts(updated);
    save(updated);
  };

  // Open modal for add or edit
  const openModal = (
    workoutId: string,
    sectionIndex: number,
    ex: Exercise | null,
    exIndex: number | null,
  ) => {
    setModal({
      workoutId,
      sectionIndex,
      exerciseIndex: exIndex,
      current: ex ?? { name: '', sets: '', note: '', isWarmup: false },
    });
  };

  // Save from modal
  const saveModal = () => {
    if (!modal || !modal.current.name.trim()) return;
    const updated = workouts.map((w) => {
      if (w.id !== modal.workoutId) return w;
      const upsert = (arr: Exercise[]) => {
        if (modal.exerciseIndex === null) return [...arr, modal.current];
        return arr.map((ex, i) => (i === modal.exerciseIndex ? modal.current : ex));
      };
      if (w.type === 'flat' && w.exercises) {
        return { ...w, exercises: upsert(w.exercises) };
      }
      if (w.type === 'sectioned' && w.sections) {
        return {
          ...w,
          sections: w.sections.map((sec, si) =>
            si !== modal.sectionIndex
              ? sec
              : { ...sec, exercises: upsert(sec.exercises) },
          ),
        };
      }
      return w;
    });
    setWorkouts(updated);
    save(updated);
    setModal(null);
  };

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex items-center justify-center px-4">
        <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-white text-xl font-bold mb-6">Admin Panel</h1>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && password === ADMIN_PASSWORD && setAuthed(true)
            }
            className="w-full bg-[#0f0f13] border border-[#2a2a3e] rounded-xl px-4 py-3 text-white text-sm mb-4 outline-none focus:border-[#e94560]"
          />
          <button
            onClick={() =>
              password === ADMIN_PASSWORD
                ? setAuthed(true)
                : showToast('❌ Wrong password')
            }
            className="w-full bg-[#e94560] text-white rounded-xl py-3 font-semibold text-sm hover:opacity-90 transition"
          >
            Enter
          </button>
          {toast && <div className="mt-4 text-sm text-red-400">{toast}</div>}
        </div>
      </div>
    );
  }

  const activeWorkout = workouts.find((w) => w.id === activeId);

  const renderExercises = (
    exercises: Exercise[],
    workoutId: string,
    sectionIndex: number,
    color = '#e94560',
  ) =>
    exercises.map((ex, i) => (
      <div
        key={i}
        className="bg-[#0f0f13] border border-[#2a2a3e] rounded-xl p-3 flex items-start gap-3"
      >
        <div className="flex-1">
          <div className="text-white text-sm font-semibold">{ex.name}</div>
          {ex.sets && (
            <div className="text-xs mt-0.5" style={{ color }}>
              {ex.sets}
            </div>
          )}
          {ex.note && (
            <div className="text-xs text-gray-500 italic mt-0.5">{ex.note}</div>
          )}
          {ex.isWarmup && (
            <span className="text-[10px] bg-green-900 text-green-400 px-2 py-0.5 rounded mt-1 inline-block">
              WARM-UP
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => moveExercise(workoutId, sectionIndex, i, -1)}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-[#1a1a2e]"
          >
            ↑
          </button>
          <button
            onClick={() => moveExercise(workoutId, sectionIndex, i, 1)}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-[#1a1a2e]"
          >
            ↓
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => openModal(workoutId, sectionIndex, ex, i)}
            className="text-xs px-2 py-1 rounded bg-blue-900 text-blue-300 hover:bg-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => deleteExercise(workoutId, sectionIndex, i)}
            className="text-xs px-2 py-1 rounded bg-red-900 text-red-300 hover:bg-red-800"
          >
            Del
          </button>
        </div>
      </div>
    ));

  const renderSection = (sec: Section, si: number, workoutId: string) => (
    <div key={si} className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <div
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: sec.color ?? '#e94560' }}
        >
          {sec.label}
        </div>
        <button
          onClick={() => openModal(workoutId, si, null, null)}
          className="text-xs px-3 py-1 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-green-400 hover:border-green-500"
        >
          + Add
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {renderExercises(sec.exercises, workoutId, si, sec.color)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] border-b-2 border-[#e94560] px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">⚙️ Admin Panel</h1>
          <p className="text-xs text-gray-400">Manage your workout plans</p>
        </div>
        <a
          href="/"
          className="text-xs text-[#e94560] border border-[#e94560] px-3 py-1.5 rounded-lg hover:bg-[#e94560] hover:text-white transition"
        >
          ← Tracker
        </a>
      </div>

      {/* Workout Tabs */}
      <div className="flex overflow-x-auto bg-[#16213e] border-b border-[#2a2a3e] px-3 gap-1">
        {workouts.map((w) => (
          <button
            key={w.id}
            onClick={() => setActiveId(w.id)}
            className={`py-3 px-3 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap border-b-2 transition-all ${
              activeId === w.id
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
        {saving && (
          <div className="text-xs text-center text-yellow-400 mb-3 animate-pulse">
            Saving...
          </div>
        )}

        {activeWorkout?.type === 'flat' && activeWorkout.exercises && (
          <>
            <div className="flex justify-end mb-3">
              <button
                onClick={() => openModal(activeWorkout.id, 0, null, null)}
                className="text-xs px-3 py-1.5 rounded-lg bg-[#1a1a2e] border border-[#2a2a3e] text-green-400 hover:border-green-500"
              >
                + Add Exercise
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {renderExercises(activeWorkout.exercises, activeWorkout.id, 0)}
            </div>
          </>
        )}

        {activeWorkout?.type === 'sectioned' && activeWorkout.sections && (
          <div>
            {activeWorkout.sections.map((sec, si) =>
              renderSection(sec, si, activeWorkout.id),
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border border-[#2a2a3e] text-white text-sm px-5 py-3 rounded-xl shadow-xl z-50">
          {toast}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white font-bold text-base mb-4">
              {modal.exerciseIndex === null ? 'Add Exercise' : 'Edit Exercise'}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name *</label>
                <input
                  className="w-full bg-[#0f0f13] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#e94560]"
                  placeholder="e.g. Bicep Curl"
                  value={modal.current.name}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      current: { ...modal.current, name: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Sets / Reps / Duration
                </label>
                <input
                  className="w-full bg-[#0f0f13] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#e94560]"
                  placeholder="e.g. 3 sets × 12 reps"
                  value={modal.current.sets ?? ''}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      current: { ...modal.current, sets: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Note</label>
                <input
                  className="w-full bg-[#0f0f13] border border-[#2a2a3e] rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-[#e94560]"
                  placeholder="e.g. 8 kg dumbbells"
                  value={modal.current.note ?? ''}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      current: { ...modal.current, note: e.target.value },
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="warmup"
                  checked={!!modal.current.isWarmup}
                  onChange={(e) =>
                    setModal({
                      ...modal,
                      current: { ...modal.current, isWarmup: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-[#e94560]"
                />
                <label htmlFor="warmup" className="text-sm text-gray-300">
                  Mark as Warm-Up
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#2a2a3e] text-gray-400 text-sm hover:border-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={saveModal}
                disabled={!modal.current.name.trim()}
                className="flex-1 py-2.5 rounded-xl bg-[#e94560] text-white text-sm font-semibold hover:opacity-90 disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
