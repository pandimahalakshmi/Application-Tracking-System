export function RecentJobsTable() {
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-3">
        Recent Jobs
      </h2>

      <table className="w-full border">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Job Name</th>
            <th className="p-2 border">Location</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>

        <tbody>

          <tr>
            <td className="p-2 border">Frontend Developer</td>
            <td className="p-2 border">Chennai</td>
            <td className="p-2 border">Open</td>
          </tr>

          <tr>
            <td className="p-2 border">Backend Developer</td>
            <td className="p-2 border">Bangalore</td>
            <td className="p-2 border">Closed</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}