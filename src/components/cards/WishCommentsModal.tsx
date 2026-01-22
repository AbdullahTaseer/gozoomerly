'use client';

import {  useState, useEffect, useRef  } from 'react';
import Image from 'next/image';
import { X, Send, Reply } from 'lucide-react';
import ProfileAvatar from '@/assets/svgs/avatar-list-icon-1.svg';
import { getWishComments, addWishComment, type WishComment } from '@/lib/supabase/boards';
import { authService } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';

interface WishCommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishId: string;
  wishContent?: string;
  wishAuthor?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const WishCommentsModal: React.FC<WishCommentsModalProps> = ({
  isOpen,
  onClose,
  wishId,
  wishContent,
  wishAuthor,
}) => {
  const router = useRouter();
  const [comments, setComments] = useState<WishComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && wishId) {
      fetchComments();
      getCurrentUser();
    }
  }, [isOpen, wishId]);

  useEffect(() => {
    if (isOpen && comments.length > 0) {
      scrollToBottom();
    }
  }, [comments, isOpen]);

  const getCurrentUser = async () => {
    const user = await authService.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchComments = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setOffset(0);
      }

      const currentOffset = loadMore ? offset : 0;
      const { data, error } = await getWishComments(wishId, {
        limit,
        offset: currentOffset,
        includeDeleted: false,
      });

      if (error) {
      } else {
        if (loadMore) {
          setComments(prev => [...prev, ...(data || [])]);
        } else {
          setComments(data || []);
        }

        setHasMore((data || []).length === limit);
        setOffset(currentOffset + (data || []).length);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !currentUserId) {
      if (!currentUserId) {
        router.push('/signin');
      }
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await addWishComment(wishId, newComment.trim(), null);

      if (error) {
        alert('Failed to post comment. Please try again.');
      } else {
        setNewComment('');
        await fetchComments(false);
      }
    } catch (err) {
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentCommentId: string) => {
    if (!replyContent.trim() || !currentUserId) {
      if (!currentUserId) {
        router.push('/signin');
      }
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await addWishComment(wishId, replyContent.trim(), parentCommentId);

      if (error) {
        alert('Failed to post reply. Please try again.');
      } else {
        setReplyContent('');
        setReplyingTo(null);
        await fetchComments(false);
      }
    } catch (err) {
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUserClick = (userId: string) => {
    router.push(`/dashboard/visitProfile/${userId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Comments</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {}
        {wishContent && (
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              {wishAuthor?.avatar && (
                <Image
                  src={wishAuthor.avatar}
                  alt={wishAuthor.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-sm font-semibold">{wishAuthor?.name || 'User'}</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">{wishContent}</p>
          </div>
        )}

        {}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.comment_id}
                comment={comment}
                onReply={(commentId) => {
                  setReplyingTo(commentId);
                  setTimeout(() => replyInputRef.current?.focus(), 100);
                }}
                onUserClick={handleUserClick}
                formatTimeAgo={formatTimeAgo}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onSubmitReply={handleSubmitReply}
                submitting={submitting}
                replyInputRef={replyInputRef}
                currentUserId={currentUserId}
              />
            ))
          )}
          <div ref={commentsEndRef} />

          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={() => fetchComments(true)}
                disabled={loading}
                className="text-pink-500 hover:text-pink-600 font-medium text-sm disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More Comments'}
              </button>
            </div>
          )}
        </div>

        {}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 min-h-[60px] max-h-[120px] p-3 border border-gray-300 rounded-lg resize-none outline-none focus:border-pink-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment();
                }
              }}
            />
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: WishComment;
  onReply: (commentId: string) => void;
  onUserClick: (userId: string) => void;
  formatTimeAgo: (date: string) => string;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (parentId: string) => void;
  submitting: boolean;
  replyInputRef: React.RefObject<HTMLTextAreaElement | null>;
  currentUserId: string | null;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onUserClick,
  formatTimeAgo,
  replyingTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  submitting,
  replyInputRef,
  currentUserId,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div
          className="relative h-8 w-8 shrink-0 cursor-pointer"
          onClick={() => onUserClick(comment.user_id)}
        >
          <Image
            src={comment.user?.profile_pic_url || ProfileAvatar}
            alt={comment.user?.name || 'User'}
            fill
            className="rounded-full object-cover"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = ProfileAvatar.src || ProfileAvatar;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-semibold text-sm cursor-pointer hover:text-pink-500"
              onClick={() => onUserClick(comment.user_id)}
            >
              {comment.user?.name || 'Unknown User'}
            </span>
            <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
          <button
            onClick={() => onReply(comment.comment_id)}
            className="text-xs text-gray-500 hover:text-pink-500 mt-1 flex items-center gap-1"
          >
            <Reply size={12} />
            Reply
          </button>

          {}
          {replyingTo === comment.comment_id && (
            <div className="mt-2 flex gap-2">
              <textarea
                ref={replyInputRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 min-h-[50px] max-h-[100px] p-2 border border-gray-300 rounded-lg resize-none outline-none focus:border-pink-500 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    onSubmitReply(comment.comment_id);
                  }
                }}
              />
              <button
                onClick={() => onSubmitReply(comment.comment_id)}
                disabled={!replyContent.trim() || submitting}
                className="px-3 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <Send size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-11 space-y-2 border-l-2 border-gray-200 pl-4">
          {comment.replies.map((reply) => (
            <div key={reply.comment_id} className="flex gap-3">
              <div
                className="relative h-7 w-7 shrink-0 cursor-pointer"
                onClick={() => onUserClick(reply.user_id)}
              >
                <Image
                  src={reply.user?.profile_pic_url || ProfileAvatar}
                  alt={reply.user?.name || 'User'}
                  fill
                  className="rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = ProfileAvatar.src || ProfileAvatar;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-semibold text-xs cursor-pointer hover:text-pink-500"
                    onClick={() => onUserClick(reply.user_id)}
                  >
                    {reply.user?.name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500">{formatTimeAgo(reply.created_at)}</span>
                </div>
                <p className="text-xs text-gray-700 whitespace-pre-wrap break-words">{reply.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishCommentsModal;
