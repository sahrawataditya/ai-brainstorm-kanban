"use client";

import { axiosInstance } from "@/lib/axiosInstance";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import toast from "react-hot-toast";
import Card from "./Card";

export default function Board({ initialBoard, initialCards }) {
  const [board, setBoard] = useState(initialBoard);
  const [cards, setCards] = useState(initialCards || []);
  const [newCardContent, setNewCardContent] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("ideas");
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const handleMount = () => {
      window.isClient = true;
    };
    handleMount();
  }, []);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const newColumns = Array.from(board.columns);
    const sourceCol = newColumns.find((col) => col.id === source.droppableId);
    const destCol = newColumns.find(
      (col) => col.id === destination.droppableId
    );

    const sourceCardIds = Array.from(sourceCol.cardIds);
    const [removed] = sourceCardIds.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCardIds.splice(destination.index, 0, removed);
      sourceCol.cardIds = sourceCardIds;
    } else {
      sourceCol.cardIds = sourceCardIds;
      const destCardIds = Array.from(destCol.cardIds);
      destCardIds.splice(destination.index, 0, removed);
      destCol.cardIds = destCardIds;

      const updatedCards = cards.map((card) => {
        if (card._id === draggableId) {
          return { ...card, columnId: destination.droppableId };
        }
        return card;
      });
      setCards(updatedCards);
    }

    setBoard({ ...board, columns: newColumns });

    // Save to backend
    try {
      await axiosInstance.put("/api/boards", { columns: newColumns });
    } catch (error) {
      toast.error("Failed to save board state");
    }
  };

  const addCard = async () => {
    if (!newCardContent.trim()) {
      toast.error("Please enter card content");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/api/cards", {
        content: newCardContent,
        columnId: selectedColumn,
      });

      const newCard = response.data.card;
      setCards([...cards, newCard]);

      const newColumns = board.columns.map((col) => {
        if (col.id === selectedColumn) {
          return {
            ...col,
            cardIds: [...col.cardIds, newCard._id],
          };
        }
        return col;
      });

      setBoard({ ...board, columns: newColumns });
      setNewCardContent("");

      if (newCard.suggestions?.length > 0) {
        toast.success("Card added with AI suggestions!", {
          duration: 4000,
          icon: "✨",
        });
      } else {
        toast.success("Card added!");
      }
    } catch (error) {
      toast.error("Failed to add card");
    } finally {
      setLoading(false);
    }
  };

  const deleteCard = async (cardId) => {
    try {
      await axiosInstance.delete(`/api/cards?cardId=${cardId}`);

      setCards(cards.filter((c) => c._id !== cardId));

      const newColumns = board.columns.map((col) => ({
        ...col,
        cardIds: col.cardIds.filter((id) => id !== cardId),
      }));

      setBoard({ ...board, columns: newColumns });

      toast.success("Card deleted");
    } catch (error) {
      toast.error("Failed to delete card");
    }
  };

  const updateCard = async (cardId, newContent) => {
    try {
      const response = await axiosInstance.put("/api/cards", {
        cardId,
        content: newContent,
      });

      setCards(cards.map((c) => (c._id === cardId ? response.data.card : c)));

      toast.success("Card updated");
    } catch (error) {
      toast.error("Failed to update card");
    }
  };

  const addSuggestion = async (suggestion, columnId) => {
    setNewCardContent(suggestion);
    setSelectedColumn(columnId);
    await addCard();
  };

  const getCardsForColumn = (columnId) => {
    const column = board.columns.find((col) => col.id === columnId);
    if (!column) return [];

    return column.cardIds
      .map((cardId) => cards.find((card) => card._id === cardId))
      .filter(Boolean);
  };

  const getClusterColor = (clusterId) => {
    const cluster = clusters.find((c) => c.name === clusterId);
    return cluster?.color || "#94a3b8";
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newCardContent}
            onChange={(e) => setNewCardContent(e.target.value)}
            placeholder="Enter your brilliant idea..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            onKeyPress={(e) => e.key === "Enter" && !loading && addCard()}
          />
          <select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {board.columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
          <button
            onClick={addCard}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Plus size={20} />
            )}
            Add Card
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {board.columns.map((column, columnIndex) => (
            <div
              key={column.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className="p-4 font-semibold text-white"
                style={{ backgroundColor: column.color || "#3B82F6" }}
              >
                <div className="flex items-center justify-between">
                  <span>{column.title}</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-sm">
                    {getCardsForColumn(column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 min-h-[400px] ${
                      snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
                    } transition-colors`}
                  >
                    {getCardsForColumn(column.id).map((card, index) => (
                      <Draggable
                        key={card._id}
                        draggableId={card._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? "opacity-50" : ""
                            }`}
                          >
                            <Card
                              card={card}
                              onDelete={() => deleteCard(card._id)}
                              onUpdate={(content) =>
                                updateCard(card._id, content)
                              }
                              onAddSuggestion={(suggestion) =>
                                addSuggestion(suggestion, column.id)
                              }
                              clusterColor={getClusterColor(card.clusterId)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
