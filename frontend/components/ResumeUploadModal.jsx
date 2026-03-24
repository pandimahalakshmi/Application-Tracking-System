export function ResumeUploadModal({
  open,
  onOpenChange
}) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl">

        <h2 className="text-xl font-bold mb-4">
          Upload Resume
        </h2>

        <input type="file" />

        <div className="mt-4">

          <button
            onClick={() => onOpenChange(false)}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}