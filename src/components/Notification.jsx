import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  acceptRequestAndTransferPoints,
  updateRequestStatus,
} from "../redux/slices/requests";

const Notification = ({ id, from, points, to }) => {
  const [showError, setShowError] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const cards = useAppSelector((state) => state.cards);
  const fromCard = cards.byId[from];
  const toCard = cards.byId[to];

  const dispatch = useAppDispatch();

  return (
    <div className="bg-blue-50 rounded-lg px-5 py-3 mx-4 mt-4 flex items-start gap-3 shadow-sm border border-blue-100">
      <div className="flex-1">
        <p className="text-blue-700 text-sm mb-3">
          <>
            You have <span className="font-semibold">received</span> a request
            for <span className="font-semibold">{points}</span> points from{" "}
            <span className="font-semibold">
              {fromCard?.name}{" "}
              <span className="text-gray-400">({fromCard?.shortId})</span>
            </span>
            .
          </>
        </p>
        <div className="flex gap-2 justify-center items-center">
          <button
            disabled={showRejectInput}
            className="px-4 py-1 rounded bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => {
              if (toCard.selfValue < points) {
                return (
                  setShowError(true),
                  setRejectReason("I don't have enough points."),
                  setTimeout(() => {
                    setShowError(false);
                  }, 2500)
                );
              } else {
                setShowError(false);
                dispatch(acceptRequestAndTransferPoints({ id }));
              }
            }}
          >
            Accept
          </button>
          <button
            disabled={showRejectInput}
            className="px-4 py-1 rounded bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={() => setShowRejectInput(true)}
          >
            Reject
          </button>
        </div>
        {showRejectInput && (
          <div className="mt-2 flex flex-col gap-2">
            <input
              className="border px-2 py-1 rounded text-sm placeholder:italic placeholder:text-gray-400"
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 justify-center items-center">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded text-xs cursor-pointer"
                onClick={() => {
                  dispatch(
                    updateRequestStatus({
                      id,
                      status: "rejected",
                      rejectReason,
                    })
                  );
                  setShowRejectInput(false);
                }}
                disabled={!rejectReason.trim()}
              >
                Submit
              </button>
              <button
                className="px-3 py-1 bg-gray-200 rounded text-xs cursor-pointer"
                onClick={() => setShowRejectInput(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <p className="text-xs text-red-600 font-semibold mt-2 mb-4">
          {showError &&
            "You can not accept this request, because you don't have enough points."}
        </p>
      </div>
    </div>
  );
};

export default Notification;
