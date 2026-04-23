export function Sidebar({ setPage }) {

  return (

    <div className="fixed w-64 h-screen bg-gray-900 text-white p-5">

      <h2 className="text-2xl mb-6">
        RecruitHub
      </h2>

      <p
        className="cursor-pointer mb-3"
        onClick={() => setPage("dashboard")}
      >
        Dashboard
      </p>

      <p
        className="cursor-pointer mb-3"
        onClick={() => setPage("jobs")}
      >
        Jobs
      </p>

      <p className="mb-3">
        Candidates
      </p>

      <p>
        Reports
      </p>

    </div>

  );
}