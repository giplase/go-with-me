"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <div className="bg-foreground h-[calc(100vh-23rem)] rounded-md p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}
