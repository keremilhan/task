import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

const RequestPointsModal = ({ cards, fromId, onClose, onRequest }) => {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [points, setPoints] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef();

  const selectedCard = cards.byId[selectedId];
  const maxPoints = selectedCard ? Number(selectedCard.selfValue) : undefined;
  const [highligthError, setHighlightError] = useState(false);

  const filteredCards = Object.values(cards.byId).filter(
    (card) =>
      card.id !== fromId &&
      card.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-30"
        onClick={onClose}
        style={{ zIndex: 49 }}
      />
      <div className="relative bg-white rounded-xl shadow-xl p-6 z-50 min-w-[320px] w-full max-w-xs flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-2">Request Points</h2>
        <label className="text-sm font-medium">Select Card</label>
        <div className="relative" ref={inputRef}>
          <input
            className="border px-2 py-1 rounded w-full placeholder:italic placeholder:text-gray-400"
            placeholder="Type card name..."
            value={search}
            onFocus={() => setDropdownOpen(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setDropdownOpen(true);
              setSelectedId("");
            }}
            autoComplete="off"
          />
          {dropdownOpen && (
            <ul className="absolute left-0 right-0 border rounded bg-white max-h-40 overflow-y-auto mt-1 z-50 shadow">
              {filteredCards.length === 0 ? (
                <li className="px-2 py-1 text-gray-400">No match</li>
              ) : (
                filteredCards.map((card) => (
                  <li
                    key={card.id}
                    className={`px-2 py-1 cursor-pointer hover:bg-blue-100 ${
                      selectedId === card.id ? "bg-blue-50" : ""
                    }`}
                    onMouseDown={() => {
                      setSelectedId(card.id);
                      setSearch(card.name);
                      setDropdownOpen(false);
                    }}
                  >
                    {card.name}
                    <span className="text-xs text-gray-400 ml-2">
                      {card.shortId}
                    </span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <label className="text-sm font-medium mt-2">Points</label>
        <input
          type="number"
          className="border px-2 py-1 rounded w-full"
          value={points}
          min={0}
          max={maxPoints}
          disabled={!selectedId}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= maxPoints) {
              setHighlightError(true);
              setPoints(maxPoints);
            } else {
              setHighlightError(false);
              setPoints(val);
            }
          }}
        />
        <div
          className={`text-xs h-3 mb-1 ${
            highligthError
              ? "text-red-600 font-bold animate-pulse"
              : "text-gray-500"
          }`}
        >
          {selectedCard && (
            <>
              You can request at most{" "}
              <span className="font-semibold">{maxPoints}</span> points from
              this card.
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-200 px-4 py-1 rounded cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!selectedId || points <= 0}
            onClick={() => {
              if (points > maxPoints) {
                setHighlightError(true);
                return;
              }
              onRequest({ from: fromId, to: selectedId, points });
              onClose();
            }}
          >
            Request
          </button>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default RequestPointsModal;
