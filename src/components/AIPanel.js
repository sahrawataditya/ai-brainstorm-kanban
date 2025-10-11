"use client";

import { Brain, Target, Lightbulb, ChevronRight, X } from "lucide-react";

export default function AIPanel({ summary, isOpen, onClose }) {
  if (!isOpen || !summary) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl border-l border-gray-200 transform transition-transform z-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="text-blue-500" />
            AI Summary
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {summary.generatedAt && (
          <p className="text-sm text-gray-500 mb-4">
            Generated {new Date(summary.generatedAt).toLocaleString()}
          </p>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Target size={18} className="text-purple-500" />
              Key Themes
            </h3>
            <div className="space-y-2">
              {summary.themes?.map((theme, index) => (
                <div key={index} className="flex items-start gap-2">
                  <ChevronRight size={16} className="text-gray-400 mt-0.5" />
                  <p className="text-gray-600 text-sm">{theme}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Lightbulb size={18} className="text-yellow-500" />
              Top Ideas
            </h3>
            <div className="space-y-3">
              {summary.topIdeas?.map((idea, index) => (
                <div
                  key={index}
                  className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">
                      #{index + 1}
                    </span>
                    <p className="text-gray-700 text-sm">{idea}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ChevronRight size={18} className="text-green-500" />
              Suggested Next Steps
            </h3>
            <div className="space-y-2">
              {summary.nextSteps?.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1 rounded text-green-500 focus:ring-green-500"
                  />
                  <label className="text-gray-600 text-sm">{step}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
