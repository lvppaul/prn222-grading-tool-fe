import React, { useEffect, useMemo, useRef, useState } from "react";
import { Typography, Avatar, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import CodeViewer from "../components/CodeViewer";
import GradingPanel from "../components/GradingPanel";
import FileExplorer from "../components/FileExplorer";
import "./grading.css";

const { Title, Text } = Typography;

// Demo multi-file submission (C#)
const FILES = [
  {
    name: "Program.cs",
    path: "/Program.cs",
    content: `using System;

class Program {
    static void Main() {
        int[] sortedArray = { 1, 3, 5, 7, 9, 11, 13, 15 };
        Console.WriteLine(BinarySearch.Search(sortedArray, 7));  // 3
        Console.WriteLine(BinarySearch.Search(sortedArray, 10)); // -1
    }
}`,
  },
  {
    name: "BinarySearch.cs",
    path: "/Algorithms/BinarySearch.cs",
    content: `using System;

public static class BinarySearch {
    public static int Search(int[] arr, int target) {
        int left = 0, right = arr.Length - 1;
        while (left <= right) {
            int mid = (left + right) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
  },
  {
    name: "Helper.cs",
    path: "/Utils/Helper.cs",
    content: `using System;

namespace Utils {
    public static class Helper {
        public static void Log(string message) {
            Console.WriteLine("[LOG] " + message);
        }
    }
}`,
  },
];

export default function GradingPage() {
  const containerRef = useRef(null);
  const [leftPct, setLeftPct] = useState(55);
  const [dragging, setDragging] = useState(false);

  // File state (selected file path + content)
  const [selectedPath, setSelectedPath] = useState(FILES[0].path);
  const selectedFile = useMemo(
    () => FILES.find((f) => f.path === selectedPath) ?? FILES[0],
    [selectedPath]
  );

  const submission = useMemo(
    () => ({
      id: "1",
      studentName: "Alice Johnson",
      assignmentTitle: "Binary Search Tree Implementation",
      submittedAt: "2024-01-15",
      language: "csharp",
      files: FILES,
    }),
    []
  );

  useEffect(() => {
    const stopDrag = () => setDragging(false);
    const move = (e) => {
      if (!dragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      if (pct > 30 && pct < 70) setLeftPct(pct);
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("mousemove", move);
    };
  }, [dragging]);

  return (
    <div className="grading-root" ref={containerRef}>
      {/* HEADER */}
      <div className="grading-header">
        <Space size={16} align="center">
          <Avatar size={42} icon={<UserOutlined />} />
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {submission.studentName}
            </Title>
            <Text type="secondary">
              {submission.assignmentTitle} • Submitted {submission.submittedAt}
            </Text>
          </div>
        </Space>
      </div>

      {/* BODY: [LEFT (Files+Code)] | [Divider] | [RIGHT (Grading)] */}
      <div className={`grading-body ${dragging ? "dragging" : ""}`}>
        {/* LEFT combined area */}
        <div className="left-pane" style={{ width: `${leftPct}%` }}>
          {/* Inner split: Files (20%) | Code (80%) */}
          <div className="left-inner">
            <div className="files-pane">
              <FileExplorer
                files={submission.files}
                selectedPath={selectedPath}
                onSelect={setSelectedPath}
              />
            </div>
            <div className="code-pane" style={{ height: "100%" }}>
                <CodeViewer code={selectedFile?.content || ""} height="100%" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="divider"
          onMouseDown={() => setDragging(true)}
          role="separator"
          aria-orientation="vertical"
        />

        {/* RIGHT grading */}
        <div className="right-pane" style={{ width: `${100 - leftPct}%` }}>
          <GradingPanel submission={submission} />
        </div>
      </div>
    </div>
  );
}
