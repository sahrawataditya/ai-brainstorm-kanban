'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import AIPanel from '@/components/AIPanel';
import dynamic from 'next/dynamic';
const Board = dynamic(() => import("@/components/Board"), { ssr: false });
export default function BoardPage({ initialBoard, initialCards }) {
  const [board, setBoard] = useState(initialBoard);
  const [cards, setCards] = useState(initialCards);
  const [summary, setSummary] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [clusters, setClusters] = useState([]);

  const handleCluster = (clustersData) => {
    setClusters(clustersData.clusters || []);
    
    if (clustersData.clusters) {
      const updatedCards = cards.map(card => {
        const cluster = clustersData.clusters.find(c => 
          c.cardIds.includes(card._id)
        );
        if (cluster) {
          return { ...card, clusterId: cluster.name, color: cluster.color };
        }
        return card;
      });
      setCards(updatedCards);
    }
  };

  const handleSummarize = (summaryData) => {
    setSummary(summaryData);
    setShowAIPanel(true);
  };

  const handleBoardUpdate = (newBoard) => {
    setBoard(newBoard);
  };

  const handleCardsUpdate = (newCards) => {
    setCards(newCards);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <Sidebar
        boardId={board._id}
        onCluster={handleCluster}
        onSummarize={handleSummarize}
      />
      
      <Board
        initialBoard={board}
        initialCards={cards}
        clusters={clusters}
        onBoardUpdate={handleBoardUpdate}
        onCardsUpdate={handleCardsUpdate}
      />
      
      <AIPanel
        summary={summary}
        isOpen={showAIPanel}
        onClose={() => setShowAIPanel(false)}
      />
    </div>
  );
}