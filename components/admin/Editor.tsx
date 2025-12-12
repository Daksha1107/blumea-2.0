'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorToolbar } from './EditorToolbar';

interface EditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function Editor({ content, onChange, placeholder = 'Start writing...' }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[500px] focus:outline-none p-6',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for link
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const url = window.prompt('Enter URL:');
        if (url) {
          editor.chain().focus().setLink({ href: url }).run();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  if (!editor) {
    return <div className="animate-pulse bg-muted h-[500px] rounded-lg"></div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
