import { createSlice, nanoid } from "@reduxjs/toolkit";
import { generateShortId } from "../../utils/functions";

const initialState = {
  byId: {},
  allIds: [],
};

function updateTotals(state, cardId) {
  const card = state.byId[cardId];
  if (!card) return 0;
  const subTotal = card.subItemIds.reduce(
    (sum, subId) => sum + updateTotals(state, subId),
    0
  );
  card.totalValue = Number(card.selfValue) + subTotal;
  return card.totalValue;
}

const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addCard: {
      reducer(state, action) {
        const { id, name, selfValue, totalValue, parentId, treeId } =
          action.payload;
        let shortId = generateShortId(state);
        state.byId[id] = {
          id,
          shortId,
          name,
          selfValue,
          totalValue,
          parentId: parentId || null,
          treeId,
          subItemIds: [],
        };
        state.allIds.push(id);
        if (parentId && state.byId[parentId]) {
          state.byId[parentId].subItemIds.push(id);
        }
        if (parentId) {
          let current = parentId;
          while (current) {
            updateTotals(state, current);
            current = state.byId[current]?.parentId;
          }
        }
        updateTotals(state, id);
      },
      prepare({ name, selfValue, totalValue, parentId, shortId, treeId }) {
        return {
          payload: {
            id: nanoid(),
            shortId: shortId,
            name,
            selfValue,
            totalValue,
            parentId: parentId || null,
            treeId,
          },
        };
      },
    },
    updateCard(state, action) {
      const { id, ...changes } = action.payload;
      if (state.byId[id]) {
        Object.assign(state.byId[id], changes);
        let current = id;
        while (current) {
          updateTotals(state, current);
          current = state.byId[current]?.parentId;
        }
      }
    },
    deleteCard(state, action) {
      const id = action.payload;
      const card = state.byId[id];
      if (!card) return;

      if (card.parentId && state.byId[card.parentId]) {
        state.byId[card.parentId].subItemIds = state.byId[
          card.parentId
        ].subItemIds.filter((subId) => subId !== id);
      }

      function deleteSubtree(cardId) {
        const subIds = state.byId[cardId]?.subItemIds || [];
        subIds.forEach(deleteSubtree);
        delete state.byId[cardId];
        state.allIds = state.allIds.filter((cid) => cid !== cardId);
      }
      deleteSubtree(id);

      if (card.parentId) {
        let current = card.parentId;
        while (current) {
          updateTotals(state, current);
          current = state.byId[current]?.parentId;
        }
      }
    },
  },
});

export const { addCard, updateCard, deleteCard } = cardsSlice.actions;
export default cardsSlice.reducer;
