import type { Comment } from '@/entities/comment/model/types';
import { Avatar } from '@/shared/ui/Avatar';
import { Card } from '@/shared/ui/Card';
import { formatDate } from '@/shared/lib/date';

type CommentCardProps = {
  comment: Comment;
  authorName: string;
};

export function CommentCard({ comment, authorName }: CommentCardProps) {
  return (
    <Card className="comment-card">
      <div className="comment-card__header">
        <div className="comment-card__identity">
          <Avatar name={authorName} size="sm" accent="rose" />
          <div>
            <h4>{authorName}</h4>
            <span>{formatDate(comment.createdAt)}</span>
          </div>
        </div>
      </div>
      <p className="comment-card__content">{comment.content}</p>
    </Card>
  );
}
