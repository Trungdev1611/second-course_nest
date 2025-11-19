'use client';

import { useEffect } from 'react';
import { Tooltip } from 'antd';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined, OrderedListOutlined, UnorderedListOutlined, CodeOutlined, QuestionCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';

interface AntdEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  minHeight?: number;
}

const toolbarActions = [
  { icon: <BoldOutlined />, action: 'toggleBold', title: 'Bold' },
  { icon: <ItalicOutlined />, action: 'toggleItalic', title: 'Italic' },
  { icon: <UnderlineOutlined />, action: 'toggleUnderline', title: 'Underline' },
  { icon: <StrikethroughOutlined />, action: 'toggleStrike', title: 'Strike' },
  { icon: <OrderedListOutlined />, action: 'toggleOrderedList', title: 'Ordered List' },
  { icon: <UnorderedListOutlined />, action: 'toggleBulletList', title: 'Bullet List' },
  { icon: <CodeOutlined />, action: 'toggleCodeBlock', title: 'Code Block' },
  { icon: <QuestionCircleOutlined />, action: 'toggleBlockquote', title: 'Quote' },
];

export function AntdEditor({
  value = '',
  onChange,
  label,
  error,
  helperText,
  placeholder = 'Write something amazing...',
  minHeight = 200,
}: AntdEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'tiptap-content',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const runAction = (action: string) => {
    if (!editor) return;
    (editor.chain() as any).focus()[action]().run();
  };

  const setLink = () => {
    if (!editor) return;
    const url = window.prompt('Enter URL');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className={`border rounded-xl bg-white overflow-hidden ${error ? 'border-red-500' : 'border-gray-200'}`}>
        <div className="flex flex-wrap gap-2 p-3 border-b border-gray-100 bg-gray-50">
          {toolbarActions.map(({ icon, action, title }) => (
            <Tooltip key={action} title={title}>
              <button
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 transition"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => runAction(action)}
              >
                {icon}
              </button>
            </Tooltip>
          ))}
          <Tooltip title="Link">
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-200 transition"
              onMouseDown={(e) => e.preventDefault()}
              onClick={setLink}
            >
              <LinkOutlined />
            </button>
          </Tooltip>
        </div>
        <div className="p-4">
          <EditorContent editor={editor} style={{ minHeight }} />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
}

