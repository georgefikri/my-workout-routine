'use client';

type Props = {
  index: number;
  name: string;
  sets?: string;
  note?: string;
  isWarmup?: boolean;
  isDone: boolean;
  onToggle: () => void;
  color?: string;
};

export default function ExerciseCard({
  index,
  name,
  sets,
  note,
  isWarmup,
  isDone,
  onToggle,
  color = '#e94560',
}: Props) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
        isDone
          ? 'bg-green-950 border-green-800 opacity-70'
          : 'bg-[#1a1a2e] border-[#2a2a3e] hover:border-opacity-80'
      }`}
      style={!isDone ? { borderColor: '#2a2a3e' } : {}}
    >
      {/* Step number */}
      <div
        className="min-w-[32px] h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{ backgroundColor: isDone ? '#2d6a4f' : color }}
      >
        {index + 1}
      </div>

      {/* Info */}
      <div className="flex-1">
        <div
          className={`font-semibold text-[15px] ${isDone ? 'line-through text-gray-500' : 'text-white'}`}
        >
          {name}
          {isWarmup && (
            <span className="ml-2 text-[10px] font-bold bg-green-900 text-green-400 px-2 py-0.5 rounded align-middle">
              WARM-UP
            </span>
          )}
        </div>
        {sets && (
          <div className="text-xs font-semibold mt-1" style={{ color }}>
            {sets}
          </div>
        )}
        {note && <div className="text-xs text-gray-400 mt-1 italic">{note}</div>}
      </div>

      {/* Checkbox */}
      <div className="text-xl shrink-0">{isDone ? '✅' : '⬜'}</div>
    </button>
  );
}
