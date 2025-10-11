"use client";

import { useState } from "react";
import {
  X,
  Edit2,
  Check,
  Sparkles,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

export default function Card({
  card,
  onDelete,
  onUpdate,
  onAddSuggestion,
  clusterColor,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSave = () => {
    if (editContent.trim() && editContent !== card.content) {
      onUpdate(editContent);
    }
    setIsEditing(false);
  };

  const getMoodIcon = () => {
    switch (card.mood) {
      case "positive":
        return <TrendingUp size={16} className="text-green-500" />;
      case "negative":
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  const getMoodBorder = () => {
    switch (card.mood) {
      case "positive":
        return "border-l-4 border-l-green-500";
      case "negative":
        return "border-l-4 border-l-red-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  return (
    <div className="mb-3">
      <div
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${getMoodBorder()}`}
        style={{
          borderLeftColor: card.clusterId ? clusterColor : undefined,
        }}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {getMoodIcon()}
            {card.clusterId && (
              <span
                className="px-2 py-1 rounded-full text-xs text-white"
                style={{ backgroundColor: clusterColor }}
              >
                {card.clusterId}
              </span>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isEditing ? (
                <Check
                  size={16}
                  className="text-green-600"
                  onClick={handleSave}
                />
              ) : (
                <Edit2 size={16} className="text-gray-500" />
              )}
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X size={16} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>
        </div>

        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            className="w-full p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            autoFocus
          />
        ) : (
          <p className="text-gray-800 mb-3">{card.content}</p>
        )}

        {card.suggestions && card.suggestions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-2"
            >
              <Sparkles size={14} />
              {showSuggestions ? "Hide" : "Show"} AI Suggestions (
              {card.suggestions.length})
            </button>

            {showSuggestions && (
              <div className="space-y-2 mt-2">
                {card.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm"
                  >
                    <p className="flex-1 text-gray-700">{suggestion}</p>
                    <button
                      onClick={() => onAddSuggestion(suggestion)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                      title="Add as new card"
                    >
                      <Plus size={14} className="text-blue-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
