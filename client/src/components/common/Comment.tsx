// components/Comment.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface CommentProps {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  isLast: boolean;
}

export const Comment = ({ id, user, content, createdAt, isLast }: CommentProps) => (
  <div key={id}>
    <div className="flex space-x-4">
      <Avatar className="w-10 h-10 ring-2 ring-gray-100">
        {user.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-sm">
            {user.name?.charAt(0) || 'U'}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900">{user.name}</h4>
            <span className="text-sm text-gray-500">
              {new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
    {!isLast && <Separator className="mt-6" />}
  </div>
);