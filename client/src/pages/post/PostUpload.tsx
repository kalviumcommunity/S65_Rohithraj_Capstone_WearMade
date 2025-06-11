import React from 'react';
import PostForm from '../../components/common/PostForm';

const PostUpload: React.FC = () => {
  return (
    <div className="min-h-screen bg-[white] py-10">
      <div className="max-w-auto mx-auto">
        <PostForm />
      </div>
    </div>
  );
};

export default PostUpload;
