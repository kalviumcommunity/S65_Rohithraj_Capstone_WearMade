// components/PostHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, Pencil, Trash2, User } from "lucide-react";

interface PostHeaderProps {
  user: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const PostHeader = ({
  user,
  createdAt,
  isOwner,
  onEdit,
  onDelete
}: PostHeaderProps) => (
  <div className="flex items-start justify-between mb-6">
    <div className="flex items-center space-x-4">
      <Avatar className="w-14 h-14 ring-2 ring-gray-100">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <User className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
    
    {isOwner && (
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        >
          <Pencil className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </div>
    )}
  </div>
);