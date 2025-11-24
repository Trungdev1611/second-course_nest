'use client';

import Link from 'next/link';
import { Space } from 'antd';
import { AntdCard, AntdButton, AntdTag, HighlightText } from '@/components/common';

interface PostItemProps {
  post: {
    blog_id?: number;
    id?: number;
    blog_thumbnail?: string;
    blog_title?: string;
    title?: string;
    blog_content?: string;
    blog_created_at?: string;
    blog_views?: number;
    blog_likes?: number;
    comment_count?: number;
    tags?: Array<{ id: number; name: string }>;
    user_name?: string;
    user_email?: string;
    highlight?: {
      title?: string[];
      content?: string[];
      excerpt?: string[];
    };
  };
}

export function PostItem({ post }: PostItemProps) {
  return (
    <AntdCard
      hoverable
      cover={
        (post?.blog_thumbnail) ? (
          <div className="h-48 w-full rounded-xl overflow-hidden">
          <img
            src={post.blog_thumbnail}
            alt={post.blog_title || post.title || 'Post thumbnail'}
            className="w-full h-full object-cover"
            loading="lazy" // ✅ Thêm native lazy loading cho ảnh
          />
        </div>
        ) : (
          <div className="h-48 w-full bg-slate-200 rounded-xl" />
        )
      }
      actions={[
        <span key="views">{post.blog_views || 0} views</span>,
        <span key="likes">{post.blog_likes || 0} likes</span>,
        <span key="comments">{post.comment_count || 0} comments</span>,
      ]}
    >
      <Space direction="vertical" size="small">
        <p className="text-xs uppercase text-slate-500">
          {post.blog_created_at
            ? new Date(post.blog_created_at).toLocaleDateString('vi-VN')
            : 'Chưa có ngày'}
        </p>
        <Link
          href={`/posts/${post.blog_id || post.id}`}
          className="text-xl font-semibold text-slate-900 hover:text-blue-600"
        >
          <HighlightText
            text={post.blog_title || post.title || ''}
            highlight={post.highlight?.title}
          />
        </Link>
        <p className="text-slate-600 line-clamp-2">
          {post.highlight?.content && post.highlight.content.length > 0 ? (
            <HighlightText
              text={post.blog_content || ''}
              highlight={post.highlight.content}
            />
          ) : post.highlight?.excerpt && post.highlight.excerpt.length > 0 ? (
            <HighlightText
              text={post.blog_content || ''}
              highlight={post.highlight.excerpt}
            />
          ) : (
            <>
              {post.blog_content?.substring(0, 150)}...
            </>
          )}
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: any) => (
              <AntdTag key={tag.id}>{tag.name}</AntdTag>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="font-medium">{post.user_name || 'Unknown'}</p>
            <p className="text-sm text-slate-500">{post.user_email || ''}</p>
          </div>
          <Link href={`/posts/${post.blog_id || post.id}`}>
            <AntdButton variant="ghost">Xem chi tiết</AntdButton>
          </Link>
        </div>
      </Space>
    </AntdCard>
  );
}

