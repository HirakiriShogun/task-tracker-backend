import { useEffect, useState } from 'react';
import type { WorkspaceMember } from '@/entities/workspace/model/types';
import { Button } from '@/shared/ui/Button';
import { Field } from '@/shared/ui/Field';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';

type CommentComposerProps = {
  members: WorkspaceMember[];
  submitting: boolean;
  onSubmit: (payload: { content: string; authorId: string }) => Promise<void>;
};

export function CommentComposer({
  members,
  submitting,
  onSubmit,
}: CommentComposerProps) {
  const [content, setContent] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    setAuthorId((current) => current || members[0]?.userId || '');
  }, [members]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!content.trim() || !authorId) {
      return;
    }

    await onSubmit({
      content: content.trim(),
      authorId,
    });

    setContent('');
  };

  return (
    <form className="comment-composer" onSubmit={handleSubmit}>
      <Field label="Write a comment">
        <Textarea
          rows={4}
          placeholder="Share progress, context, blockers or next steps."
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </Field>
      <div className="comment-composer__footer">
        <Field label="Author">
          <Select
            value={authorId}
            onChange={(event) => setAuthorId(event.target.value)}
            options={members.map((member) => ({
              value: member.userId,
              label: member.user?.fullName || member.userId,
            }))}
            disabled={!members.length || submitting}
          />
        </Field>
        <Button type="submit" disabled={submitting || !members.length}>
          {submitting ? 'Posting…' : 'Add comment'}
        </Button>
      </div>
    </form>
  );
}
