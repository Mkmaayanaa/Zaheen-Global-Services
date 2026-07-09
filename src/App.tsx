import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Zaheen Global Services</h1>
        <p className="text-gray-600 mb-6">Welcome to your React + Vite application</p>
        
        <div className="bg-indigo-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-3">Counter: <span className="font-bold text-indigo-600">{count}</span></p>
          <button
            onClick={() => setCount(count + 1)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Increment
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Edit <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code> to get started
        </p>
      </div>
    </div>
  );
}

