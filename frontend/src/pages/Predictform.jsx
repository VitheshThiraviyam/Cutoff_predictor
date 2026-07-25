import { useState } from "react";
import "./PredictForm.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const PredictForm = () => {
  const [cutoff, setCutoff] = useState("");
  const [category, setCategory] = useState("");
  const [branch, setBranch] = useState("");
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cutoff || !category || !branch || !location) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/predict-admission?branch=${encodeURIComponent(
          branch
        )}&category=${encodeURIComponent(
          category
        )}&location=${encodeURIComponent(location)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();

      const eligible = data.predictions.filter(
        (college) => Number(cutoff) >= Number(college.predictedCutoff)
      );

      setResults(eligible);
    } catch (error) {
      console.error("Prediction Error:", error);
      alert("Unable to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>🎓 College Predictor</h2>

        <form className="predict-form" onSubmit={handleSubmit}>
          <input
            type="number"
            min="80"
            max="200"
            step="0.1"
            placeholder="Enter Cutoff Mark"
            value={cutoff}
            onChange={(e) => setCutoff(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="OC">OC</option>
            <option value="BC">BC</option>
            <option value="MBC">MBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">Select Branch</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="AI & DS">AI & DS</option>
            <option value="AI & ML">AI & ML</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select Location</option>
            <option value="Chennai">Chennai</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Madurai">Madurai</option>
            <option value="Vellore">Vellore</option>
            <option value="Erode">Erode</option>
            <option value="Thanjavur">Thanjavur</option>
            <option value="Kanchipuram">Kanchipuram</option>
            <option value="Chengalpattu">Chengalpattu</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict Colleges"}
          </button>
        </form>
      </div>

      {!loading && results.length > 0 && (
        <div className="results-wrapper">
          <h3>📊 Eligible Colleges (This Year)</h3>

          <div className="results-grid">
            {results.map((college, index) => (
              <div key={index} className="result-card">
                <h4>{college.college}</h4>
                <p>Predicted Cutoff: {college.predictedCutoff}</p>
              </div>
            ))}
          </div>

          <div className="chart-container">
            <h3 className="chart-title">📊 Cutoff Comparison</h3>

            <ResponsiveContainer width="100%" height={450}>
              <BarChart
                data={results}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 120,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="college"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />

                <ReferenceLine
                  y={Number(cutoff)}
                  stroke="red"
                  strokeWidth={2}
                  label="Your Cutoff"
                />

                <Bar
                  dataKey="predictedCutoff"
                  fill="#667eea"
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {!loading && results.length === 0 && (
        <p className="no-result">No eligible colleges found.</p>
      )}
    </div>
  );
};

export default PredictForm;