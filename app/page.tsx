import Link from 'next/link'

export const metadata = {
  title: 'Goal Tracker — Master Your Goals with Science',
  description:
    'Psychology-driven goal tracking with energy-emotion insights, SMART frameworks, and gamification to supercharge your productivity.',
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm">
              GT
            </div>
            <span className="text-xl font-bold text-gray-900">Goal Tracker</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">How It Works</a>
            <a href="#stats" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Results</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/60 blur-3xl" />
          <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-purple-100/40 to-pink-100/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
            </span>
            Psychology-Powered Productivity
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
            Goals that actually
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> get done</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
            Stop setting goals that fade away. Our science-backed system uses energy-emotion tracking,
            SMART frameworks, and gamification to turn your ambitions into achievements.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              Start Tracking Free
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">No credit card required · Free forever for individuals</p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Features</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
              Everything you need to <span className="text-blue-600">succeed</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Built on proven psychological principles to help you form better habits and achieve more.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl shadow-lg shadow-orange-500/20">
                ⚡
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Energy & Emotion Tracking</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Map your energy and mood patterns throughout the day. Schedule tasks when you&apos;re at peak performance for maximum output.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl shadow-lg shadow-blue-500/20">
                🎯
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">SMART Goal Framework</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Break down big ambitions into Specific, Measurable, Achievable, Relevant, and Time-bound milestones that drive real progress.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-2xl shadow-lg shadow-emerald-500/20">
                🏆
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Gamification & Rewards</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Earn points, unlock achievements, and climb leaderboards. Scientifically designed rewards that reinforce positive habits.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl shadow-lg shadow-purple-500/20">
                🧠
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Psychology Insights</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Get personalized insights into your productivity patterns, procrastination triggers, and optimal work windows.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 text-white text-2xl shadow-lg shadow-rose-500/20">
                📊
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Rich Analytics</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Visualize your progress with beautiful charts. Track completion rates, streak patterns, and mood correlations over time.
              </p>
            </div>

            <div className="group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-2xl shadow-lg shadow-cyan-500/20">
                🔥
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Streak Building</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">
                Build momentum with daily streaks. Our algorithm adapts difficulty to keep you in the flow state — not too easy, not too hard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">How it works</p>
            <h2 className="mt-3 text-4xl font-bold text-gray-900 md:text-5xl">
              Three steps to <span className="text-blue-600">better habits</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/20">
                1
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Set Your Goals</h3>
              <p className="mt-3 text-gray-600">
                Define long-term visions and break them into actionable short-term goals using our SMART framework wizard.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-indigo-500/20">
                2
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Track Daily</h3>
              <p className="mt-3 text-gray-600">
                Complete daily tasks, log your mood and energy, and watch your streaks grow. The app learns your optimal schedule.
              </p>
            </div>

            <div className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white shadow-xl shadow-purple-500/20">
                3
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">Level Up</h3>
              <p className="mt-3 text-gray-600">
                Earn rewards, unlock achievements, and see your productivity soar with data-driven insights and personalized coaching.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold md:text-5xl">
              Built for <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">results</span>
            </h2>
            <p className="mt-4 text-lg text-blue-200/70">
              The science of habit formation, powered by technology.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">73%</p>
              <p className="mt-2 text-sm text-blue-200/60">Higher completion rate</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">2.4x</p>
              <p className="mt-2 text-sm text-blue-200/60">Faster goal achievement</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">89%</p>
              <p className="mt-2 text-sm text-blue-200/60">Users maintain streaks</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent">47d</p>
              <p className="mt-2 text-sm text-blue-200/60">Average streak length</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 md:text-5xl">
            Ready to achieve <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">your goals</span>?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Join thousands of high achievers who use Goal Tracker to build better habits, track their progress, and unlock their potential.
          </p>
          <div className="mt-10">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300"
            >
              Get Started — It&apos;s Free
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
                GT
              </div>
              <span className="text-lg font-bold text-gray-900">Goal Tracker</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Goal Tracker. Psychology-powered productivity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
