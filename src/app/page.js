import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import {
  Brain,
  Sparkles,
  Users,
  Download,
  ChevronRight,
  Star,
  Zap,
  Target,
} from "lucide-react";

export default async function HomePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token");

  if (token && verifyToken(token.value)) {
    redirect("/board");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Brain size={32} className="text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">BrainBoard</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-medium"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Brainstorm Smarter with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              AI Power
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transform your ideas into actionable insights with our AI-powered
            brainstorming board. Organize, cluster, and enhance your creativity
            like never before.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all font-semibold text-lg flex items-center gap-2"
            >
              Start Brainstorming
              <ChevronRight size={20} />
            </Link>
            <button className="px-8 py-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-all font-semibold text-lg">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Sparkles className="text-purple-500" size={32} />}
            title="AI Suggestions"
            description="Get intelligent idea suggestions powered by Gemini AI for every card you create."
          />
          <FeatureCard
            icon={<Target className="text-blue-500" size={32} />}
            title="Smart Clustering"
            description="Automatically group related ideas together using advanced AI embeddings."
          />
          <FeatureCard
            icon={<Zap className="text-yellow-500" size={32} />}
            title="Board Summaries"
            description="Generate comprehensive summaries with key themes and actionable next steps."
          />
          <FeatureCard
            icon={<Users className="text-green-500" size={32} />}
            title="Collaborative"
            description="Share boards and brainstorm together in real-time with your team."
          />
          <FeatureCard
            icon={<Download className="text-red-500" size={32} />}
            title="Export Options"
            description="Export your boards as Markdown or PDF with AI-generated summaries."
          />
          <FeatureCard
            icon={<Star className="text-indigo-500" size={32} />}
            title="Mood Analysis"
            description="Understand the sentiment of your ideas with automatic mood detection."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Supercharge Your Brainstorming?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who are already using AI to enhance their
            creativity.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all font-semibold text-lg"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
