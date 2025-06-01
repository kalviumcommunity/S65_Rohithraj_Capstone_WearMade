import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';


import LoginPage from '@/pages/Auth/LoginPage';
import NotFound from '@/pages/NotFound';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
