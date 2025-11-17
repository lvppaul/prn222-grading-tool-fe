import React, { useEffect, useRef } from "react";
import { Card, Space, Button, message, Tooltip } from "antd";
import { CopyOutlined, DownloadOutlined } from "@ant-design/icons";
import Editor from "@monaco-editor/react";

export default function CodeViewer({ code, height }) {
  const editorRef = useRef(null);
  const lang = "csharp"; // Fixed to C# only

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      message.success("✅ Code copied");
    } catch {
      message.error("❌ Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `submission.cs`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Enable Keyboard Shortcuts
  useEffect(() => {
    const handleKeys = (e) => {
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        handleCopy();
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, []);

  return (
<Card
  title="Submitted Code"
  extra={
    <Space>
      <Tooltip title="Copy (Ctrl + C)">
        <Button size="small" icon={<CopyOutlined />} onClick={handleCopy} />
      </Tooltip>
      <Tooltip title="Download .cs (Ctrl + S)">
        <Button size="small" icon={<DownloadOutlined />} onClick={handleDownload} />
      </Tooltip>
    </Space>
  }
  // 👇 Card itself fills the pane and becomes a flex column
  style={{ height: "100%", display: "flex", flexDirection: "column" }}
  // 👇 Card body stretches so Editor's 100% has something to measure
  styles={{ body: { padding: 0, flex: 1, display: "flex" } }}
  variant="outlined"
  size="small"
  className="codeviewer-card"
>
  {/* 👇 wrapper gives Editor a definite height */}
  <div style={{ flex: 1 }}>
    <Editor
      value={code}
      language={lang}
      height="100%"
      theme="vs-dark"
      onMount={(editor) => (editorRef.current = editor)}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "JetBrains Mono, Consolas, monospace",
        fontLigatures: true,
        scrollBeyondLastLine: false,
        lineNumbersMinChars: 3,
        smoothScrolling: true,
        padding: { top: 12, bottom: 12 },
      }}
    />
  </div>
</Card>

  );
}
