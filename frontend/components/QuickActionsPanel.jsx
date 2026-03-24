export function QuickActionsPanel({ onUploadClick }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-3">
        Quick Actions
      </h2>

      <button
        onClick={onUploadClick}
        className="bg-purple-600 text-white px-4 py-2 rounded"
      >
        Upload Resume
      </button>

    </div>
  );
}