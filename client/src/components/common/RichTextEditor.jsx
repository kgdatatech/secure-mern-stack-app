import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaQuoteRight, FaImage, FaTable, FaAlignCenter, FaAlignLeft, FaAlignRight } from 'react-icons/fa';

const RichTextEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table,
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== content) {
        setContent(html);
      }
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <div className="flex flex-wrap mb-4">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaBold />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaItalic />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaUnderline />
        </button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaListUl />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaListOl />
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaQuoteRight />
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaImage />
        </button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaTable />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaAlignLeft />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaAlignCenter />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className="p-2 m-1 border rounded hover:bg-gray-200">
          <FaAlignRight />
        </button>
      </div>
      <EditorContent editor={editor} className="min-h-[200px] bg-white p-2 rounded" />
    </div>
  );
};

export default RichTextEditor;
