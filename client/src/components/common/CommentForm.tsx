// components/CommentForm.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface CommentFormProps {
  user: {
    name: string;
    avatar?: string;
  };
  commentInput: string;
  submitting: boolean;
  onCommentInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const CommentForm = ({
  user,
  commentInput,
  submitting,
  onCommentInputChange,
  onSubmit
}: CommentFormProps) => (
  <div className="mb-8">
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <Avatar className="w-10 h-10 ring-2 ring-gray-100">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Share your thoughts..."
            value={commentInput}
            onChange={onCommentInputChange}
          />
          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={!commentInput.trim() || submitting}
              className="px-6"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  </div>
);