import React, { useMemo } from "react";
import { Card, Tree } from "antd";

/**
 * files: Array<{ name: string; path: string; content: string }>
 * selectedPath: string
 * onSelect: (path: string) => void
 */
export default function FileExplorer({ files, selectedPath, onSelect }) {
  // Build treeData from flat files list (paths like "/Utils/Helper.cs")
  const treeData = useMemo(() => {
    const root = { key: "__root__", title: "root", children: [] };

    const ensureNode = (parent, name, fullPath, isLeaf) => {
      const existing = parent.children.find((c) => c.title === name);
      if (existing) return existing;

      const node = {
        key: isLeaf ? fullPath : `${parent.key}/${name}`,
        title: name,
        selectable: isLeaf, // only files selectable
        isLeaf,
        children: [],
      };
      parent.children.push(node);
      return node;
    };

    files.forEach((f) => {
      const parts = f.path.replace(/^\/+/, "").split("/");
      let curr = root;
      parts.forEach((p, i) => {
        const isLeaf = i === parts.length - 1;
        curr = ensureNode(curr, p, `/${parts.slice(0, i + 1).join("/")}`, isLeaf);
      });
    });

    return root.children;
  }, [files]);

  return (
    <Card
      title="Files"
      size="small"
      variant="outlined"
      styles={{ body: { padding: 8 } }}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1, overflow: "auto" }}>
<Tree
  showIcon={false}
  defaultExpandAll
  treeData={treeData}
  selectedKeys={selectedPath ? [selectedPath] : []}
  onSelect={(_, info) => {
    if (info.node.isLeaf) {
      onSelect(info.node.key); // ✅ Only select actual file nodes
    }
  }}
/>

      </div>
    </Card>
  );
}
