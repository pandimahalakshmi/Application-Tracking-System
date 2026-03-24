export function RecentCandidatesTable() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Recent Candidates
      </h2>

      <table className="w-full text-left">

        <thead>
          <tr className="border-b text-gray-500">

            <th className="pb-2">Name</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Status</th>

          </tr>
        </thead>

        <tbody className="text-gray-700">

          <tr className="border-b">

            <td className="py-3">Ravi</td>
            <td>Developer</td>
            <td className="text-green-600">Selected</td>

          </tr>

          <tr>

            <td className="py-3">Anita</td>
            <td>Designer</td>
            <td className="text-yellow-600">Pending</td>

          </tr>

        </tbody>

      </table>

    </div>
  );
}