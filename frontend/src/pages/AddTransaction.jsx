import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddTransaction() {
  const [features, setFeatures] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const values = features.split(",").map(v => parseFloat(v.trim()));
      
      // Validate that we have exactly 29 values
      if (values.length !== 29) {
        throw new Error("Please provide exactly 29 comma-separated values");
      }

      // Validate that all values are numbers
      if (values.some(v => isNaN(v))) {
        throw new Error("All values must be valid numbers");
      }

      const res = await axios.post("http://localhost:8081/api/transactions/add-form", { features: values });
      setResponse(res.data);
      
      // Clear form after successful submission
      setTimeout(() => {
        setFeatures("");
        setResponse(null);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleData = () => {
    // Sample transaction data (29 values)
    const sampleData = [
      -1.35980713, -0.07278117, 2.536346738, 1.378155224, -0.338320769,
      -0.482842646, -0.498539999, -0.238432864, 0.803611294, -0.254988554,
      -1.506858318, -0.617800586, -0.065963517, -0.678892888, -0.156421964,
      1.943464899, -1.015454045, -0.651493476, -0.412098806, 0.502292224,
      -0.460379354, -0.514389781, -0.685291014, -0.295132678, -0.147242254,
      0.095126945, -0.150568242, -0.097193031, 149.62
    ];
    setFeatures(sampleData.join(", "));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Transaction</h2>
          <button
            onClick={() => navigate("/transactions")}
            className="px-4 py-2 text-green-600 hover:text-green-700 transition-colors"
          >
            📋 View All Transactions
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <p className="text-blue-700 text-sm">
            Enter exactly 29 comma-separated numeric values representing transaction features. 
            These values will be processed by our ML model to detect potential fraud.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transaction Features (29 values)
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              rows="4"
              placeholder="Enter 29 comma-separated values (e.g., -1.359, -0.072, 2.536, ...)"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Current count: {features.split(",").filter(v => v.trim()).length} / 29
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handleSampleData}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              📝 Use Sample Data
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? "🔄 Processing..." : "🚀 Submit Transaction"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">❌ {error}</p>
          </div>
        )}

        {response && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700 font-semibold">✅ Transaction Processed Successfully!</p>
                <p className="text-sm text-green-600 mt-1">
                  Result: {response.fraud ? "🚨 Fraud Detected" : "✅ Safe Transaction"}
                </p>
                {response.message && (
                  <p className="text-sm text-green-600 mt-1">{response.message}</p>
                )}
              </div>
              <div className="text-right">
                <button
                  onClick={() => navigate("/")}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  📊 View Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">🔍 How It Works</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Enter 29 numerical features</li>
              <li>• ML model analyzes the data</li>
              <li>• Fraud detection result returned</li>
              <li>• Transaction stored in database</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">📊 Feature Information</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Features are anonymized for privacy</li>
              <li>• Each feature represents transaction attributes</li>
              <li>• Values are typically normalized</li>
              <li>• Last feature is usually the amount</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
