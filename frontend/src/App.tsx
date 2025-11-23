import { useState, useEffect } from 'react';
import { fetchGridStatus, fetchJobs } from './api';
import { Zap, Cloud, Server, AlertTriangle, PoundSterling } from 'lucide-react';

// Types matching our backend
interface GridState {
  hour: number;
  gridLoadMw: number;
  carbonIntensity: number;
  pricePerMwh: number;
  isPeak: boolean;
}

interface Job {
  id: string;
  type: string;
  powerConsumptionKw: number;
  status: string;
  urgency: string;
}

function App() {
  const [hour, setHour] = useState<number>(12); // Start at Noon
  const [gridData, setGridData] = useState<GridState | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  // Fetch data whenever the Slider moves
  useEffect(() => {
    const loadData = async () => {
      try {
        const grid = await fetchGridStatus(hour);
        const jobList = await fetchJobs();
        setGridData(grid);
        setJobs(jobList);
      } catch (error) {
        console.error("Failed to connect to backend", error);
      }
    };
    loadData();
  }, [hour]);

  if (!gridData) return <div className="p-10 text-center">Loading Simulation...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Eco-Compute Arbitrageur</h1>
            <p className="text-gray-500">Digital Energy Grid Simulator</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-blue-600">
              {hour}:00
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-wide">Time of Day</span>
          </div>
        </header>

        {/* CONTROLS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Simulation Time Controller</label>
          <input
            type="range"
            min="0"
            max="23"
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>00:00</span>
            <span>12:00</span>
            <span>23:00</span>
          </div>
        </div>

        {/* GRID STATS PANEL */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-colors duration-500 ${gridData.isPeak ? 'bg-red-50 p-4 rounded-xl border border-red-200' : ''}`}>
          
          {/* Load */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${gridData.isPeak ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Grid Load</p>
              <p className="text-2xl font-bold">{gridData.gridLoadMw} MW</p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <PoundSterling size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Price / MWh</p>
              <p className="text-2xl font-bold">£{gridData.pricePerMwh}</p>
            </div>
          </div>

          {/* Carbon */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <Cloud size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Carbon Intensity</p>
              <p className="text-2xl font-bold">{gridData.carbonIntensity} g/kWh</p>
            </div>
          </div>
        </div>

        {/* ALERT BANNER */}
        {gridData.isPeak && (
          <div className="bg-red-600 text-white p-4 rounded-lg flex items-center shadow-lg animate-pulse">
            <AlertTriangle className="mr-3" />
            <span className="font-bold">GRID STRESS EVENT DETECTED: High Prices & Carbon Intensity!</span>
          </div>
        )}

        {/* COMPUTE JOBS LIST */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Server className="mr-2 text-blue-500" size={20} />
              Active Workloads
            </h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="p-4">Job ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Power</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-mono text-sm">{job.id}</td>
                  <td className="p-4">{job.type}</td>
                  <td className="p-4 text-gray-600">{job.powerConsumptionKw} kW</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${job.urgency === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {job.urgency}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${job.status === 'Running' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default App;
