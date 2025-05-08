import React, { useEffect, useMemo, useRef, useState } from "react";
import { Notification, RequestPointsModal, Log } from "./index";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { deleteCard, updateCard } from "../redux/slices/cards";
import { addRequest } from "../redux/slices/requests";

const Card = ({
  onAddSubitemClick,
  name,
  selfValue,
  totalValue,
  id,
  shortId,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [editName, setEditName] = useState(name);
  const [editingName, setEditingName] = useState(false);

  const [editSelfValue, setEditSelfValue] = useState(selfValue);
  const [editingSelf, setEditingSelf] = useState(false);

  const requests = useAppSelector((state) => state.requests);
  const cards = useAppSelector((state) => state.cards);

  const sortedHistoryLog = useMemo(() => {
    return requests
      .filter(
        (req) => (req.to === id || req.from === id) && req.status !== "pending"
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [requests, id]);

  const sortedNotifications = useMemo(() => {
    return requests
      .filter((req) => req.to === id && req.status === "pending")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [requests, id]);

  const dispatch = useAppDispatch();

  const menuRef = useRef();

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    setEditName(name);
  }, [name]);
  const handleNameBlur = () => {
    setEditingName(false);
    if (editName !== name) {
      dispatch(updateCard({ id, name: editName }));
    }
  };

  useEffect(() => {
    setEditSelfValue(selfValue);
  }, [selfValue]);
  const handleSelfBlur = () => {
    setEditingSelf(false);
    if (Number(editSelfValue) !== Number(selfValue)) {
      dispatch(updateCard({ id, selfValue: Number(editSelfValue) }));
    }
  };

  return (
    <>
      <div className="w-80 max-w-xs rounded-xl shadow-lg p-2 pt-3">
        <div className="flex justify-between items-center mx-3">
          <img
            className="w-16 h-16 rounded-full"
            src={`https://i.pravatar.cc/300?u=${id}`}
            alt="Profile Picture"
          />
          {editingName ? (
            <input
              className="font-semibold truncate max-w-[120px] border-b border-blue-400 outline-none px-1"
              value={editName}
              autoFocus
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={(e) => e.key === "Enter" && handleNameBlur()}
              maxLength={25}
            />
          ) : (
            <div className="relative max-w-[120px] w-full">
              <p
                className="font-semibold cursor-pointer truncate pr-6 hover:bg-blue-50 border-b border-b-gray-200 hover:border-blue-400 transition px-1 w-full"
                title={name}
                onClick={() => setEditingName(true)}
              >
                {name}
              </p>
              <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-blue-400 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.75 18.963l-4 1 1-4 12.112-12.476Z"
                  />
                </svg>
              </span>
            </div>
          )}
          <span className="text-xs text-gray-400">{shortId}</span>
          <div className="relative mt-2" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute left-0 mt-3 w-42 bg-white rounded shadow-xl z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    onAddSubitemClick && onAddSubitemClick();
                  }}
                >
                  Add a Downline
                </button>
                <button
                  onClick={() => dispatch(deleteCard(id))}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Delete
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false);
                    setShowRequestModal(true);
                  }}
                >
                  Request Income
                </button>
              </div>
            )}
          </div>
        </div>
        <hr className="h-0.5 border-0 w-full mt-3 bg-gray-300" />
        <div className="px-6 py-3 flex items-center justify-between">
          <span className="text-gray-500 font-medium">Self:</span>
          {editingSelf ? (
            <input
              className="text-lg font-semibold text-gray-800 border-b border-blue-400 outline-none px-1 w-16"
              type="number"
              min={0}
              value={editSelfValue}
              autoFocus
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val < 0) {
                  setEditSelfValue(0);
                } else {
                  setEditSelfValue(val);
                }
              }}
              onBlur={handleSelfBlur}
              onKeyDown={(e) => e.key === "Enter" && handleSelfBlur()}
            />
          ) : (
            <span
              className="text-lg font-semibold text-gray-800 cursor-pointer flex items-center gap-2 hover:bg-blue-50 border-b border-b-gray-200 hover:border-b-blue-400 transition px-1"
              title="Click to edit"
              onClick={() => setEditingSelf(true)}
            >
              <svg
                className="w-4 h-4 text-blue-400 ml-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.75 18.963l-4 1 1-4 12.112-12.476Z"
                />
              </svg>
              {selfValue}
            </span>
          )}
        </div>
        <div className="px-6 py-3 flex items-center justify-between">
          <span className="text-gray-500 font-medium">Total:</span>
          <span className="text-lg font-semibold text-gray-800">
            {totalValue}
          </span>
        </div>
        {sortedNotifications.length > 0 &&
          sortedNotifications.map((notification, index) => (
            <Notification key={index} {...notification} />
          ))}
        {sortedHistoryLog.length > 0 && (
          <div className="mt-6 px-3 pb-4">
            <button
              className="flex justify-around items-center gap-2 text-gray-700 font-semibold mb-2 focus:outline-none cursor-pointer"
              onClick={() => setHistoryOpen((prev) => !prev)}
            >
              <p>History</p>
              <svg
                className={`w-4 h-4 transition-transform ${
                  historyOpen ? "rotate-90" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            {historyOpen && (
              <ul className="space-y-3 text-sm max-h-60 overflow-y-auto custom-scrollbar">
                {sortedHistoryLog?.map((log, index) => (
                  <Log key={index} {...log} currentCardId={id} cards={cards} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {showRequestModal && (
        <RequestPointsModal
          cards={cards}
          fromId={id}
          onClose={() => setShowRequestModal(false)}
          onRequest={({ from, to, points }) => {
            dispatch(addRequest({ from, to, points }));
          }}
        />
      )}
    </>
  );
};

export default Card;
