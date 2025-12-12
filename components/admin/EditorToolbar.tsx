'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading2,
  Heading3,
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-muted transition-colors ${
        active ? 'bg-muted text-primary' : ''
      }`}
      title={title}
      type="button"
    >
      {children}
    </button>
  );

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-card">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <Heading2 className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <Heading3 className="w-5 h-5" />
      </ToolbarButton>

      <div className="w-px h-8 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="Bold (Cmd+B)"
      >
        <Bold className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="Italic (Cmd+I)"
      >
        <Italic className="w-5 h-5" />
      </ToolbarButton>

      <div className="w-px h-8 bg-border mx-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <List className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered className="w-5 h-5" />
      </ToolbarButton>

      <div className="w-px h-8 bg-border mx-1" />

      <ToolbarButton
        onClick={setLink}
        active={editor.isActive('link')}
        title="Add Link (Cmd+K)"
      >
        <LinkIcon className="w-5 h-5" />
      </ToolbarButton>

      <ToolbarButton onClick={addImage} title="Add Image">
        <ImageIcon className="w-5 h-5" />
      </ToolbarButton>
    </div>
  );
}
