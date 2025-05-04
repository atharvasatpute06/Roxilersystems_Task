// ✅ App.js
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import StoreDashboard from './pages/store/Dashboard';
import UpdatePassword from './pages/user/UpdatePassword'; // Reusing for both user and store

// 🧠 Wrappers to pass userId from location.state
const AdminWrapper = () => {
  const { state } = useLocation();
  return <AdminDashboard userId={state?.userId} />;
};

const UserWrapper = () => {
  const { state } = useLocation();
  return <UserDashboard userId={state?.userId} />;
};

const StoreWrapper = () => {
  const { state } = useLocation();
  return <StoreDashboard userId={state?.userId} />;
};

const StorePasswordWrapper = () => {
  const { state } = useLocation();
  return <UpdatePassword userId={state?.userId} />;
};

const UserPasswordWrapper = () => {
  const { state } = useLocation();
  return <UpdatePassword userId={state?.userId} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/dashboard" element={<AdminWrapper />} />
        <Route path="/user/dashboard" element={<UserWrapper />} />
        <Route path="/store/dashboard" element={<StoreWrapper />} />
        <Route path="/user/update-password" element={<UserPasswordWrapper />} />
        <Route path="/store/update-password" element={<StorePasswordWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
