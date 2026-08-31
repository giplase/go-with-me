"use client"

import dynamic from "next/dynamic"
import { forwardRef } from "react"
import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor"

const Editor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
  loading: () => <div className="bg-pending h-[calc(100vh-23rem)] w-full animate-pulse rounded-md"></div>,
})

export const ForwardRefEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
  <Editor {...props} editorRef={ref} />
))

ForwardRefEditor.displayName = "ForwardRefEditor"
