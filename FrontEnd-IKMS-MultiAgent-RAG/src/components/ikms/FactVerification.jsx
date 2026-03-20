export const FactVerification = ({ data }) => (
  <div className="my-2 p-3 bg-green-50 border border-green-200 rounded text-xs flex items-center gap-2">
    <span className="text-green-600 font-bold">✅ Hallucination Guard:</span>
    <span className="text-green-700">{data}</span>
  </div>
);