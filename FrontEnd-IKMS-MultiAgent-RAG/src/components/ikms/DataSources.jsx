export const DataSources = ({ sources }) => (
  <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-200">
    <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Retrieved Context</h4>
    <div className="text-[10px] text-slate-600 line-clamp-2 italic">
      {sources}
    </div>
  </div>
);