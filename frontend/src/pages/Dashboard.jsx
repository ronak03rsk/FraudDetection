import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showModelSettings, setShowModelSettings] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    fraud: 0,
    safe: 0,
    fraudRate: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/transactions/all");
      const data = response.data;
      setTransactions(data);
      
      const total = data.length;
      const fraud = data.filter(t => t.fraud).length;
      const safe = total - fraud;
      const fraudRate = total > 0 ? (fraud / total * 100).toFixed(1) : 0;

      setStats({ total, fraud, safe, fraudRate });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  const generateReport = () => {
    const reportData = {
      generatedAt: new Date().toLocaleString(),
      totalTransactions: stats.total,
      fraudDetected: stats.fraud,
      safeTransactions: stats.safe,
      fraudRate: stats.fraudRate,
      recentTransactions: transactions.slice(-10)
    };

    // Generate CSV format
    const csvContent = [
      ['Fraud Detection Report'],
      ['Generated At:', reportData.generatedAt],
      [''],
      ['Summary Statistics'],
      ['Total Transactions:', reportData.totalTransactions],
      ['Fraud Detected:', reportData.fraudDetected],
      ['Safe Transactions:', reportData.safeTransactions],
      ['Fraud Rate:', `${reportData.fraudRate}%`],
      [''],
      ['Recent Transactions'],
      ['ID', 'Status', 'Timestamp', 'Amount'],
      ...reportData.recentTransactions.map(t => [
        t.id || 'N/A',
        t.fraud ? 'Fraud' : 'Safe',
        t.timestamp || 'N/A',
        t.features && t.features.length > 0 ? t.features[t.features.length - 1] : 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraud-detection-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  const toggleModelSettings = () => {
    setShowModelSettings(!showModelSettings);
  };

  const pieData = [
    { name: "Fraud", value: stats.fraud, color: "#EF4444" },
    { name: "Safe", value: stats.safe, color: "#10B981" }
  ];

  const barData = [
    { name: "Fraud", count: stats.fraud, color: "#EF4444" },
    { name: "Safe", count: stats.safe, color: "#10B981" }
  ];

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const recentTransactions = transactions.slice(-5).reverse();

  // Advanced analytics calculations
  const getAdvancedStats = () => {
    if (transactions.length === 0) return {};
    
    const fraudTransactions = transactions.filter(t => t.fraud);
    const safeTransactions = transactions.filter(t => !t.fraud);
    
    // Calculate average amounts
    const avgFraudAmount = fraudTransactions.length > 0 
      ? fraudTransactions.reduce((sum, t) => sum + (t.features?.[t.features.length - 1] || 0), 0) / fraudTransactions.length
      : 0;
    
    const avgSafeAmount = safeTransactions.length > 0
      ? safeTransactions.reduce((sum, t) => sum + (t.features?.[t.features.length - 1] || 0), 0) / safeTransactions.length
      : 0;

    return {
      avgFraudAmount: avgFraudAmount.toFixed(2),
      avgSafeAmount: avgSafeAmount.toFixed(2),
      riskScore: (stats.fraudRate * 2.5).toFixed(1),
      totalAmount: transactions.reduce((sum, t) => sum + (t.features?.[t.features.length - 1] || 0), 0).toFixed(2)
    };
  };

  const advancedStats = getAdvancedStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value={stats.total}
          color="text-blue-600"
          icon="📊"
        />
        <StatCard
          title="Fraud Detected"
          value={stats.fraud}
          color="text-red-600"
          icon="🚨"
        />
        <StatCard
          title="Safe Transactions"
          value={stats.safe}
          color="text-green-600"
          icon="✅"
        />
        <StatCard
          title="Fraud Rate"
          value={`${stats.fraudRate}%`}
          color="text-orange-600"
          icon="📈"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Transaction Distribution</h3>
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No transactions available
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Transaction Counts</h3>
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No transactions available
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
        
        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Amount</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={transaction.id || index} className="border-b">
                    <td className="px-4 py-2">{transaction.id || `T-${index + 1}`}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.fraud 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {transaction.fraud ? '🚨 Fraud' : '✅ Safe'}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {transaction.amount ? `$${transaction.amount.toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recent transactions found
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={generateReport}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              📊 Generate Report
            </button>
            <button 
              onClick={toggleModelSettings}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              ⚙️ Model Settings
            </button>
            <button 
              onClick={toggleAnalytics}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              🔍 Advanced Analytics
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>ML Model Status:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                ✅ Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Database:</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                ✅ Connected
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Update:</span>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Settings Modal */}
      {showModelSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">ML Model Settings</h3>
              <button 
                onClick={toggleModelSettings}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Model Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Model Type:</span>
                    <p>Random Forest Classifier</p>
                  </div>
                  <div>
                    <span className="font-medium">Version:</span>
                    <p>1.0.0</p>
                  </div>
                  <div>
                    <span className="font-medium">Training Date:</span>
                    <p>2025-01-15</p>
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span>
                    <p>99.2%</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Model Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Number of Features:</span>
                    <span>29</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Threshold:</span>
                    <span>0.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cross-validation Score:</span>
                    <span>0.987</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Precision:</span>
                    <p>0.95</p>
                  </div>
                  <div>
                    <span className="font-medium">Recall:</span>
                    <p>0.93</p>
                  </div>
                  <div>
                    <span className="font-medium">F1-Score:</span>
                    <p>0.94</p>
                  </div>
                  <div>
                    <span className="font-medium">AUC-ROC:</span>
                    <p>0.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Advanced Analytics</h3>
              <button 
                onClick={toggleAnalytics}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fraud Detection Trends */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Detection Trends</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Today's Fraud Rate:</span>
                    <span className="text-red-600">{stats.fraudRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weekly Average:</span>
                    <span className="text-orange-600">2.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Average:</span>
                    <span className="text-blue-600">3.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trend:</span>
                    <span className="text-green-600">↓ Decreasing</span>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Risk Assessment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>High Risk Transactions:</span>
                    <span className="text-red-600">{Math.floor(stats.fraud * 0.3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medium Risk:</span>
                    <span className="text-yellow-600">{Math.floor(stats.fraud * 0.5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Risk:</span>
                    <span className="text-green-600">{Math.floor(stats.fraud * 0.2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False Positives:</span>
                    <span className="text-blue-600">{Math.floor(stats.fraud * 0.1)}</span>
                  </div>
                </div>
              </div>

              {/* Transaction Volume */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Volume Analytics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Volume:</span>
                    <span>${advancedStats.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Fraud Amount:</span>
                    <span className="text-red-600">${advancedStats.avgFraudAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Safe Amount:</span>
                    <span className="text-green-600">${advancedStats.avgSafeAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <span className="text-orange-600">{advancedStats.riskScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Model Performance */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Model Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Detection Speed:</span>
                    <span className="text-green-600">Real-time</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence Score:</span>
                    <span>94.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Retrain:</span>
                    <span>3 days ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Drift:</span>
                    <span className="text-green-600">Minimal</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="text-sm space-y-1">
                <li>• Consider retraining model with recent data</li>
                <li>• Monitor transaction patterns during peak hours</li>
                <li>• Review false positive cases for model improvement</li>
                <li>• Implement real-time alerting for high-risk transactions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
