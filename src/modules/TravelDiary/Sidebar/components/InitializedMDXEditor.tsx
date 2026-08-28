"use client"
import type { ForwardedRef } from "react"
import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertThematicBreak,
} from "@mdxeditor/editor"
import "@mdxeditor/editor/style.css"
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      {...props}
      ref={editorRef}
      className="dark-theme markdown-editor"
      contentEditableClassName="prose prose-invert max-w-none"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <BlockTypeSelect />
              <ListsToggle />
              <CreateLink />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  )
}
