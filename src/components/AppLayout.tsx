import { Outlet } from 'react-router-dom';
import '../index.css';

const AppLayout = () => {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export default AppLayout;