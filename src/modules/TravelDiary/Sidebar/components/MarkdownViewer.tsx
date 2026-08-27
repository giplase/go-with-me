"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <div className="bg-foreground max-h-200 min-h-100 rounded-md p-4">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}
