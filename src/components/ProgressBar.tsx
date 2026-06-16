type Props = {
  done: number;
  total: number;
};

export default function ProgressBar({ done, total }: Props) {
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-xl p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-400">
          {done} / {total} exercises done
        </span>
        <span className="text-sm font-bold text-[#e94560]">{pct}%</span>
      </div>
      <div className="h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #e94560, #f97316)',
          }}
        />
      </div>
    </div>
  );
}
