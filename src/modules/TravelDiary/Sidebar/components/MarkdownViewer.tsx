"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function MarkdownViewer({ markdown }: { markdown: string }) {
  return (
    <div className="bg-foreground h-[calc(100vh-17rem)] overflow-y-auto rounded-md p-4">
      <article className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    </div>
  )
}
