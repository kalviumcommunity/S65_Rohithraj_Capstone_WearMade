import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';


import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import Home from '@/pages/Home';

import NotFound from '@/pages/NotFound';
import PostUpload from '@/pages/post/PostUpload';


const AppRoutes = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Profile routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:username" element={<ProfilePage />} />
        <Route path="/upload/new" element={<PostUpload />} />
        
        {/* Catch-all for 404 Not Found */}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;