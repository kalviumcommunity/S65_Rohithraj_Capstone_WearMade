import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';


import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import ProfilePage from '@/pages/profile/ProfilePage';
import Home from '@/pages/Home';
import { useAuth } from '@/context/AuthContext';

import NotFound from '@/pages/NotFound';


const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Profile routes */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:username" element={<ProfilePage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;