'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Space, Divider, Spin, Input, Form, List, Avatar } from 'antd';
import { HeartOutlined, HeartFilled, LikeOutlined, LikeFilled } from '@ant-design/icons';
import { AntdTag, AntdButton, AntdCard, AntdAlert, useAntdNotification } from '@/components/common';
import usePostAPI from '@/hooks/usePostAPI';
import useCommentAPI from '@/hooks/useCommentAPI';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLazyLoad } from '@/hooks/useLazyLoad';

dayjs.extend(relativeTime);

interface PostDetailProps {
  params: { slug: string };
}

// CommentItemWithReplies component - handles loading replies
function CommentItemWithReplies({
  comment,
  postId,
  user,
  isExpanded,
  isReplying,
  replyContent,
  useCommentReplies,
  createReplyMutation,
  success,
  error,
  onToggleReplies,
  onReplyClick,
  onReplyContentChange,
  onReplySubmit,
  onCancelReply,
}: {
  comment: any;
  postId: number;
  user: any;
  isExpanded: boolean;
  isReplying: boolean;
  replyContent: string;
  useCommentReplies: (postId: number, commentId: number, options?: { enabled?: boolean }) => any;
  createReplyMutation: any;
  success: any;
  error: any;
  onToggleReplies: () => void;
  onReplyClick: () => void;
  onReplyContentChange: (content: string) => void;
  onReplySubmit: () => void;
  onCancelReply: () => void;
}) {
  const commentId = comment.comment_id || comment.id;
  
  // Load replies if expanded
  const { data: repliesData, isLoading: repliesLoading } = useCommentReplies(
    postId,
    commentId,
    { enabled: isExpanded }
  );
  
  const replies = isExpanded ? (repliesData?.data || []) : [];
  const replyCount = parseInt(comment.reply_count || '0');

  return (
    <CommentItem
      comment={comment}
      user={user}
      isExpanded={isExpanded}
      isReplying={isReplying}
      replyContent={replyContent}
      replies={replies}
      repliesLoading={repliesLoading}
      replyCount={replyCount}
      onToggleReplies={onToggleReplies}
      onReplyClick={onReplyClick}
      onReplyContentChange={onReplyContentChange}
      onReplySubmit={onReplySubmit}
      onCancelReply={onCancelReply}
    />
  );
}

// CommentItem component
function CommentItem({
  comment,
  user,
  isExpanded,
  isReplying,
  replyContent,
  replies,
  repliesLoading,
  replyCount,
  onToggleReplies,
  onReplyClick,
  onReplyContentChange,
  onReplySubmit,
  onCancelReply,
}: {
  comment: any;
  user: any;
  isExpanded: boolean;
  isReplying: boolean;
  replyContent: string;
  replies: any[];
  repliesLoading: boolean;
  replyCount: number;
  onToggleReplies: () => void;
  onReplyClick: () => void;
  onReplyContentChange: (content: string) => void;
  onReplySubmit: () => void;
  onCancelReply: () => void;
}) {
  return (
    <List.Item className="!px-0 !py-4">
      <div className="w-full">
        <div className="flex items-start gap-3">
          <Avatar src={comment.user_image || comment.user?.avatar}>
            {(comment.user_name || comment.user?.name || 'U')[0]}
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {comment.user_name || comment.user?.name || 'Unknown'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {dayjs(comment.comment_created_at || comment.created_at).fromNow()}
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300">{comment.comment_content || comment.content}</p>
            <div className="flex items-center gap-4 text-sm">
              {/* Like Icon - màu xanh, luôn hiển thị */}
              <div className="flex items-center gap-1.5 cursor-pointer group">
                {comment.isLiked ? (
                  <LikeFilled className="!text-blue-600 dark:!text-blue-400 text-base transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#2563eb' }} />
                ) : (
                  <LikeOutlined className="!text-blue-600 dark:!text-blue-400 text-base transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#2563eb' }} />
                )}
                {(() => {
                  const likeCount = parseInt(comment.like_count || comment.likes || '0');
                  return likeCount > 0 ? (
                    <span className="!text-blue-600 dark:!text-blue-400" style={{ color: '#2563eb' }}>{likeCount}</span>
                  ) : null;
                })()}
              </div>
              
              {/* Heart Icon - màu đỏ, luôn hiển thị */}
              <div className="flex items-center gap-1.5 cursor-pointer group">
                {comment.isHearted ? (
                  <HeartFilled className="!text-red-600 dark:!text-red-400 text-base transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#dc2626' }} />
                ) : (
                  <HeartOutlined className="!text-red-600 dark:!text-red-400 text-base transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#dc2626' }} />
                )}
                {(() => {
                  const heartCount = parseInt(comment.heart_count || comment.hearts || '0');
                  return heartCount > 0 ? (
                    <span className="!text-red-600 dark:!text-red-400" style={{ color: '#dc2626' }}>{heartCount}</span>
                  ) : null;
                })()}
              </div>
              
              <span
                className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors"
                onClick={onReplyClick}
              >
                Trả lời
              </span>
              {replyCount > 0 && (
                <span
                  className="text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  onClick={onToggleReplies}
                >
                  {isExpanded ? 'Ẩn' : `Xem ${replyCount} phản hồi`}
                </span>
              )}
            </div>

            {/* Reply Input - luôn hiển thị khi bấm Trả lời */}
            {isReplying && (
              <div className="ml-4 mt-3 space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                <Input.TextArea
                  rows={3}
                  placeholder="Viết phản hồi..."
                  value={replyContent}
                  onChange={(e) => onReplyContentChange(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <AntdButton
                    type="primary"
                    size="small"
                    onClick={onReplySubmit}
                    disabled={!replyContent.trim()}
                  >
                    Gửi
                  </AntdButton>
                  <AntdButton size="small" onClick={onCancelReply}>
                    Hủy
                  </AntdButton>
                </div>
              </div>
            )}

            {/* Replies List */}
            {isExpanded && (
              <div className="ml-4 mt-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-3">
                {repliesLoading ? (
                  <div className="flex justify-center py-2">
                    <Spin size="small" />
                  </div>
                ) : replies.length > 0 ? (
                  replies.map((reply: any) => (
                    <div key={reply.comment_id || reply.id} className="flex items-start gap-3">
                      <Avatar size="small" src={reply.user_image || reply.user?.avatar}>
                        {(reply.user_name || reply.user?.name || 'U')[0]}
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-slate-900 dark:text-slate-100">
                            {reply.user_name || reply.user?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {dayjs(reply.comment_created_at || reply.created_at).fromNow()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {reply.comment_content || reply.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          {/* Like Icon for Reply - màu xanh, luôn hiển thị */}
                          <div className="flex items-center gap-1 cursor-pointer group">
                            {reply.isLiked ? (
                              <LikeFilled className="!text-blue-600 dark:!text-blue-400 transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#2563eb' }} />
                            ) : (
                              <LikeOutlined className="!text-blue-600 dark:!text-blue-400 transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#2563eb' }} />
                            )}
                            {(() => {
                              const likeCount = parseInt(reply.like_count || reply.likes || '0');
                              return likeCount > 0 ? (
                                <span className="!text-blue-600 dark:!text-blue-400" style={{ color: '#2563eb' }}>{likeCount}</span>
                              ) : null;
                            })()}
                          </div>
                          
                          {/* Heart Icon for Reply - màu đỏ, luôn hiển thị */}
                          <div className="flex items-center gap-1 cursor-pointer group">
                            {reply.isHearted ? (
                              <HeartFilled className="!text-red-600 dark:!text-red-400 transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#dc2626' }} />
                            ) : (
                              <HeartOutlined className="!text-red-600 dark:!text-red-400 transition-all duration-200 group-hover:scale-110 group-hover:-translate-y-0.5" style={{ color: '#dc2626' }} />
                            )}
                            {(() => {
                              const heartCount = parseInt(reply.heart_count || reply.hearts || '0');
                              return heartCount > 0 ? (
                                <span className="!text-red-600 dark:!text-red-400" style={{ color: '#dc2626' }}>{heartCount}</span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Chưa có phản hồi</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </List.Item>
  );
}

export default function PostDetailPage({ params }: PostDetailProps) {
  const postId = parseInt(params.slug);
  const { user } = useAuthStore();
  const { contextHolder, success, error } = useAntdNotification();
  const [commentContent, setCommentContent] = useState('');
  const [form] = Form.useForm();

  const { usePostDetail, useRelatedPosts, useIncrementView } = usePostAPI();
  const { useComments, useCreateComment, useCommentReplies, useCreateReply } = useCommentAPI();

  const { data: postData} = usePostDetail(postId);
  const { data: relatedData } = useRelatedPosts(postId);

  const [setCommentRef, isVisibleComment] = useLazyLoad({
    threshold: 0,
    rootMargin: "0px 0px 200px 0px",
    triggerOnce: true
  });
  const { data: commentsData} = useComments(postId, { per_page: 5 },
    {enabled:  isVisibleComment} );
  const createCommentMutation = useCreateComment();
  const createReplyMutation = useCreateReply();
  const incrementViewMutation = useIncrementView();

  // States for replies
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});

  useEffect(() => {
    if (user && postId) {
      incrementViewMutation.mutate(postId);
    }
  }, [postId, user]);


  const post = postData?.data
  const related = relatedData?.data || [];
  const comments = commentsData?.data || [];
  const commentsMeta = commentsData?.meta;

  if (!post) {
    return null
  }
  const handleSubmitComment = async () => {
    if (!commentContent.trim()) {
      error({
        message: 'Lỗi',
        description: 'Vui lòng nhập nội dung bình luận',
      });
      return;
    }

    if (!user) {
      error({
        message: 'Cần đăng nhập',
        description: 'Vui lòng đăng nhập để bình luận',
      });
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId,
        data: { content: commentContent },
      });
      form.resetFields();
      setCommentContent('');
      success({
        message: 'Thành công',
        description: 'Bình luận đã được thêm',
      });
    } catch (err: any) {
      error({
        message: 'Lỗi',
        description: err?.response?.data?.message || 'Không thể thêm bình luận',
      });
    }
  };

  return (
    <>
      {contextHolder}
      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <Link href="/posts" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Quay lại danh sách
        </Link>

        <article className="space-y-6">
          {/* Hero image */}
          {post?.post_thumbnail && (
            <div className="w-full rounded-2xl overflow-hidden shadow-sm">
              <img src={post?.post_thumbnail} alt={post.title} className="w-full h-64 object-cover" />
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{post.post_created_at ? new Date(post.post_created_at).toLocaleDateString('vi-VN') : ''}</span>
              <span>•</span>
              <span>{post.post_views || 0} lượt xem</span>
              <span>•</span>
              <span>{post.post_likes || 0} lượt thích</span>
            </div>

            <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">{post.title}</h1>

            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">{post?.user_name || 'Unknown'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{post?.user_email || ''}</p>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <Link key={tag.id || tag.name} href={`/tags/${tag.name}`}>
                    <AntdTag>{tag.name}</AntdTag>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-slate dark:prose-invert prose-lg max-w-none bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-6 text-slate-900 dark:text-slate-100"
            dangerouslySetInnerHTML={{ __html: post.post_content || '' }}
          />
        </article>

        {related.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Bài viết liên quan</h2>
            <Space direction="vertical" className="w-full">
              {related.map((item: any, index: number) => (
                <AntdCard key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : ''}
                      </p>
                      <Link href={`/posts/${item.id}`} className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400">
                        {item.title}
                      </Link>
                    </div>
                    <Link href={`/posts/${item.id}`}>
                      <AntdButton variant="secondary">Đọc</AntdButton>
                    </Link>
                  </div>
                </AntdCard>
              ))}
            </Space>
          </section>
        )}

        <Divider />

        <section className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Bình luận</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {commentsMeta?.total ? `${commentsMeta.total} bình luận` : 'Chưa có bình luận'}
            </p>
          </div>

          {!user && (
            <AntdAlert
              type="info"
              message="Đăng nhập để tham gia thảo luận"
              description="Chỉ cần đăng nhập nếu bạn muốn bình luận hoặc thả tim. Người xem không đăng nhập vẫn đọc được toàn bộ conversation."
            />
          )}

          {user && (
            <Form form={form} onFinish={handleSubmitComment}>
              <Form.Item name="content" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                <Input.TextArea
                  rows={4}
                  placeholder="Viết bình luận của bạn..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
              </Form.Item>
              <AntdButton
                type="primary"
                htmlType="submit"
                loading={createCommentMutation.isPending}
              >
                Gửi bình luận
              </AntdButton>
            </Form>
          )}

          {/* Comments List */}
          <div ref={setCommentRef} style={{ minHeight: 50 }}>
          {comments.length === 0 ? (
            <p className="text-center text-slate-500 dark:text-slate-400 py-8">Chưa có bình luận nào</p>
          ) :
          
          (

            <div className="space-y-0">
              {comments.map((comment: any) => {
                const commentId = comment.comment_id || comment.id;
                return (
                  <CommentItemWithReplies
                    key={commentId}
                    comment={comment}
                    postId={postId}
                    user={user}
                    isExpanded={expandedComments.has(commentId)}
                    isReplying={replyingToCommentId === commentId}
                    replyContent={replyContents[commentId] || ''}
                    useCommentReplies={useCommentReplies}
                    createReplyMutation={createReplyMutation}
                    success={success}
                    error={error}
                    onToggleReplies={() => {
                      setExpandedComments((prev) => {
                        const newSet = new Set(prev);
                        if (newSet.has(commentId)) {
                          newSet.delete(commentId);
                        } else {
                          newSet.add(commentId);
                        }
                        return newSet;
                      });
                    }}
                    onReplyClick={() => {
                      setReplyingToCommentId(commentId);
                      setReplyContents((prev) => ({ ...prev, [commentId]: '' }));
                    }}
                    onReplyContentChange={(content: string) => {
                      setReplyContents((prev) => ({ ...prev, [commentId]: content }));
                    }}
                    onReplySubmit={async () => {
                      const replyContent = replyContents[commentId] || '';
                      if (!replyContent.trim()) {
                        error({
                          message: 'Lỗi',
                          description: 'Vui lòng nhập nội dung phản hồi',
                        });
                        return;
                      }
                      if (!user) {
                        error({
                          message: 'Cần đăng nhập',
                          description: 'Vui lòng đăng nhập để gửi phản hồi',
                        });
                        return;
                      }
                      try {
                        await createReplyMutation.mutateAsync({
                          postId,
                          commentId,
                          data: { content: replyContent },
                        });
                        setReplyingToCommentId(null);
                        setReplyContents((prev) => {
                          const newPrev = { ...prev };
                          delete newPrev[commentId];
                          return newPrev;
                        });
                        success({
                          message: 'Thành công',
                          description: 'Phản hồi đã được thêm',
                        });
                      } catch (err: any) {
                        error({
                          message: 'Lỗi',
                          description: err?.response?.data?.message || 'Không thể thêm phản hồi',
                        });
                      }
                    }}
                    onCancelReply={() => {
                      setReplyingToCommentId(null);
                      setReplyContents((prev) => {
                        const newPrev = { ...prev };
                        delete newPrev[commentId];
                        return newPrev;
                      });
                    }}
                  />
                );
              })}
            </div>
          )}
          </div>
    


          {!user && (
            <Link href="/login">
              <AntdButton variant="primary" block>
                Đăng nhập để bình luận
              </AntdButton>
            </Link>
          )}
        </section>
      </main>
    </>
  );
}

