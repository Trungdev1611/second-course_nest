'use client';

import { List, Avatar, Radio, Space } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useState, useMemo } from 'react';

interface AntdComment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

type SortType = 'newest' | 'popular';

interface AntdCommentListProps {
  comments: AntdComment[];
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
  emptyText?: string;
  showSort?: boolean;
  defaultSort?: SortType;
  onSortChange?: (sort: SortType) => void;
}

export function AntdCommentList({
  comments,
  onLike,
  onReply,
  emptyText = 'Chưa có bình luận',
  showSort = true,
  defaultSort = 'newest',
  onSortChange,
}: AntdCommentListProps) {
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortType>(defaultSort);

  const handleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
    onLike?.(commentId);
  };

  const handleSortChange = (newSort: SortType) => {
    setSort(newSort);
    onSortChange?.(newSort);
  };

  const sortedComments = useMemo(() => {
    if (!comments || comments.length === 0) return [];
    
    const sorted = [...comments];
    if (sort === 'popular') {
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      // newest - sort by createdAt descending
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  }, [comments, sort]);

  return (
    <div className="space-y-4">
      {showSort && comments.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Sắp xếp theo:</span>
          <Radio.Group
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            size="small"
          >
            <Radio.Button value="newest">Mới nhất</Radio.Button>
            <Radio.Button value="popular">Phổ biến</Radio.Button>
          </Radio.Group>
        </div>
      )}
      
      <List
        dataSource={sortedComments}
        locale={{ emptyText }}
        renderItem={(comment) => {
          const isLiked = likedComments.has(comment.id) || comment.isLiked;
          return (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={comment.author.avatar}>{comment.author.name[0]}</Avatar>}
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{comment.author.name}</span>
                    <span className="text-xs text-slate-500">
                      {dayjs(comment.createdAt).fromNow()}
                    </span>
                  </div>
                }
                description={
                  <div className="space-y-2">
                    <p className="text-slate-700">{comment.content}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer transition-colors"
                        onClick={() => handleLike(comment.id)}
                      >
                        {isLiked ? (
                          <HeartFilled className="text-red-500 text-base" />
                        ) : (
                          <HeartOutlined className="text-slate-400 hover:text-red-500 text-base transition-colors" />
                        )}
                        <span className={`${isLiked ? 'text-red-500' : 'text-slate-500'}`}>
                          {comment.likes ?? 0}
                        </span>
                      </div>
                      <span
                        className="text-slate-500 hover:text-blue-500 cursor-pointer transition-colors"
                        onClick={() => onReply?.(comment.id)}
                      >
                        Trả lời
                      </span>
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}

