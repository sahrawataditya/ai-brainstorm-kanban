"use client";
import { axiosInstance } from "@/lib/axiosInstance";
import {
  Download,
  FileText,
  LayoutGrid,
  Loader2,
  LogOut,
  Sparkles,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Sidebar({ boardId, onCluster, onSummarize }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleCluster = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/ai/cluster", { boardId });
      onCluster(response.data.clusters);
      toast.success("Cards clustered successfully!", { icon: "🎯" });
    } catch (error) {
      toast.error("Failed to cluster cards");
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/ai/summarize", { boardId });
      onSummarize(response.data);
      toast.success("Board summarized!", { icon: "📝" });
    } catch (error) {
      toast.error("Failed to summarize board");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/export", {
        boardId,
        format,
      });

      // Create download link
      const blob = new Blob([response.data.content], {
        type: format === "pdf" ? "application/pdf" : "text/markdown",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `board-export.${format}`;
      a.click();

      toast.success(`Exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error("Failed to export board");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutGrid className="text-blue-500" />
          BrainBoard
        </h1>
      </div>

      <div className="flex-1 space-y-2">
        <button
          onClick={handleCluster}
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 flex items-center gap-3 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} />
          )}
          Cluster Ideas
        </button>

        <button
          onClick={handleSummarize}
          disabled={loading}
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-3 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <FileText size={18} />
          )}
          Summarize Board
        </button>

        <div className="pt-4">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-6 space-y-2">
          <button
            onClick={() => handleExport("markdown")}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Export as Markdown
          </button>

          <button
            onClick={() => handleExport("pdf")}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Export as PDF
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 space-y-2">
        <button className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors">
          <User size={18} />
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-left hover:bg-gray-50 rounded-lg flex items-center gap-3 transition-colors text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
