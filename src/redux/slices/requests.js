import { createSlice, nanoid } from "@reduxjs/toolkit";
import { updateCard } from "./cards";

const requestsSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    addRequest: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare({ from, to, points }) {
        return {
          payload: {
            id: nanoid(),
            from,
            to,
            points,
            status: "pending",
            rejectReason: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    },
    updateRequestStatus(state, action) {
      const { id, status, rejectReason } = action.payload;
      const req = state.find((r) => r.id === id);
      if (req) {
        req.status = status;
        if (rejectReason !== undefined) {
          req.rejectReason = rejectReason;
        }
        req.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const acceptRequestAndTransferPoints =
  ({ id }) =>
  (dispatch, getState) => {
    const state = getState();
    const req = state.requests.find((r) => r.id === id);
    if (!req || req.status !== "pending") return;

    const fromCard = state.cards.byId[req.from];
    const toCard = state.cards.byId[req.to];
    const points = Number(req.points);

    if (!fromCard || !toCard) return;
    if (toCard.selfValue < points) {
      console.error("Not enough points to transfer");
      return;
    }

    dispatch(updateRequestStatus({ id, status: "accepted" }));
    dispatch(updateCard({ id: req.to, selfValue: toCard.selfValue - points }));
    dispatch(
      updateCard({ id: req.from, selfValue: fromCard.selfValue + points })
    );
  };

export const { addRequest, updateRequestStatus } = requestsSlice.actions;
export default requestsSlice.reducer;
