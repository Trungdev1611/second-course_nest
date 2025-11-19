import { Avatar, Badge, Button, Input, List, Space } from 'antd';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  fromMe?: boolean;
}

interface AntdChatProps {
  title?: string;
  participants?: { id: string; name: string; online?: boolean; avatar?: string }[];
  messages: ChatMessage[];
  onSend?: (message: string) => void;
  placeholder?: string;
}

export function AntdChat({
  title = 'Team Chat',
  participants = [],
  messages,
  onSend,
  placeholder = 'Type your message...',
}: AntdChatProps) {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend?.(draft.trim());
    setDraft('');
  };

  return (
    <div className="rounded-2xl bg-white shadow-md flex flex-col h-[450px] max-h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{participants.length} members</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} ghost>
          New Chat
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="hidden md:block w-56 border-r border-gray-100 overflow-y-auto">
          <List
            itemLayout="horizontal"
            dataSource={participants}
            renderItem={(user) => (
              <List.Item className="px-4">
                <List.Item.Meta
                  avatar={
                    <Badge dot={user.online} offset={[-2, 32]}>
                      <Avatar src={user.avatar}>{user.name[0]}</Avatar>
                    </Badge>
                  }
                  title={<span className="font-medium text-gray-900">{user.name}</span>}
                  description={
                    <span className="text-xs text-gray-500">
                      {user.online ? 'Online' : 'Offline'}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                    message.fromMe
                      ? 'bg-blue-500 text-white rounded-tr-none'
                      : 'bg-white text-gray-900 rounded-tl-none'
                  }`}
                >
                  {!message.fromMe && (
                    <p className="text-xs font-semibold mb-1">{message.sender.name}</p>
                  )}
                  <p className="text-sm break-words">{message.content}</p>
                  <p
                    className={`text-[11px] mt-1 ${
                      message.fromMe ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 p-3">
            <Space.Compact className="w-full">
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 4 }}
                placeholder={placeholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!draft.trim()}
              />
            </Space.Compact>
          </div>
        </div>
      </div>
    </div>
  );
}

