export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col justify-between">
        <div>
          <div className="p-6 text-xl font-bold text-purple-600">
            StudyTantra
          </div>

          <nav className="px-4 space-y-2">
            {["Dashboard", "Documents", "Flashcards", "Quizzes", "Favorites"].map(
              (item, i) => (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-lg cursor-pointer text-sm font-medium ${
                    i === 0
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item}
                </div>
              )
            )}
          </nav>
        </div>

        {/* Account */}
        <div className="p-4 border-t">
          <div className="text-xs text-gray-400 mb-2">ACCOUNT</div>
          <div className="text-sm text-gray-600">Profile</div>
          <div className="text-sm text-gray-600 mb-4">Settings</div>

          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-purple-300" />
            <div>
              <div className="text-sm font-semibold">Alex Johnson</div>
              <div className="text-xs text-gray-500">Free Plan</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          <input
            className="px-4 py-2 rounded-xl border text-sm"
            placeholder="Search your library..."
          />
        </div>

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 rounded-2xl flex justify-between items-center shadow">
          <div>
            <div className="text-sm opacity-80">WELCOME BACK</div>
            <div className="text-2xl font-bold">Hello, Alex! 👋</div>
          </div>
          <button className="bg-white text-purple-600 px-5 py-2 rounded-xl font-medium shadow">
            Upload Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {["Total Documents", "Flashcards", "Quizzes Taken"].map((card, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border">
              <div className="text-xs text-gray-400 mb-2 uppercase">
                {card}
              </div>
              <div className="text-2xl font-bold">0</div>
            </div>
          ))}
        </div>

        {/* Bottom Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Recent Activity</h2>
              <span className="text-sm text-purple-600 cursor-pointer">
                View All
              </span>
            </div>
            <div className="text-gray-400 text-sm text-center py-10">
              No recent activity yet.
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Goals */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border">
              <h3 className="font-semibold mb-4">Learning Goals</h3>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Daily Flashcards</span>
                  <span>0</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Course Completion</span>
                  <span>0%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full" />
              </div>
            </div>

            {/* Pro Card */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-5 rounded-2xl shadow">
              <div className="font-semibold mb-2">✨ Pro Plan</div>
              <p className="text-sm opacity-90 mb-4">
                Unlock unlimited AI document summaries and personalized quizzes.
              </p>
              <button className="bg-white text-purple-700 px-4 py-2 rounded-xl text-sm font-medium">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}