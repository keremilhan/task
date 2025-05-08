import React, { useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Card, CardForm } from "./index";
import { useAppSelector } from "../redux/hooks";

const CardTree = ({ cardId }) => {
  const [addingSubTo, setAddingSubTo] = useState(null);
  const cards = useAppSelector((state) => state.cards);
  const card = cards.byId[cardId];

  const renderSubTree = (id) => {
    const node = cards.byId[id];
    return (
      <TreeNode
        key={id}
        label={
          <div
            style={{ minWidth: 260, display: "flex", justifyContent: "center" }}
          >
            <Card {...node} onAddSubitemClick={() => setAddingSubTo(node.id)} />
          </div>
        }
      >
        {node.subItemIds.map((subId) => renderSubTree(subId))}
        {addingSubTo === node.id && (
          <TreeNode
            label={
              <div
                style={{
                  minWidth: 260,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CardForm
                  parentId={node.id}
                  treeId={node.treeId}
                  onCancel={() => setAddingSubTo(null)}
                />
              </div>
            }
          />
        )}
      </TreeNode>
    );
  };

  return (
    <Tree
      lineWidth="2px"
      lineColor="#bbc"
      lineBorderRadius="10px"
      label={
        <div
          style={{ minWidth: 260, display: "flex", justifyContent: "center" }}
        >
          <Card {...card} onAddSubitemClick={() => setAddingSubTo(card.id)} />
        </div>
      }
    >
      {card.subItemIds.map((subId) => renderSubTree(subId))}
      {addingSubTo === card.id && (
        <TreeNode
          label={
            <div
              style={{
                minWidth: 260,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <CardForm
                parentId={card.id}
                treeId={card.treeId}
                onCancel={() => setAddingSubTo(null)}
              />
            </div>
          }
        />
      )}
    </Tree>
  );
};

export default CardTree;
