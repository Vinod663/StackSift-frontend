// src/pages/Dashboard.tsx
import { useSelector } from 'react-redux';
import { type RootState } from '../redux/store';

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
        <h2 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Cards... (Keep your existing card code here) */}
             <div className="bg-brand-dark/50 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-gray-400 text-sm mb-2">Total Contributions</h3>
                <p className="text-4xl font-bold text-white">0</p>
             </div>
        </div>
    </div>
  );
};

export default Dashboard;