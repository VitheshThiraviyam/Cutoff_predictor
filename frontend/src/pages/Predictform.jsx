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
  ReferenceLine
} from "recharts";

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
        `http://localhost:5000/api/predict-admission?branch=${branch}&category=${category}&location=${location}`
      );

      const data = await response.json();

      const eligible = data.predictions.filter(
        (college) => Number(cutoff) >= college.predictedCutoff
      );

      setResults(eligible);
      setLoading(false);
    } catch (error) {
      console.error(error);
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

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option>OC</option>
            <option>BC</option>
            <option>MBC</option>
            <option>SC</option>
            <option>ST</option>
          </select>

          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">Select Branch</option>
            <option>CSE</option>
            <option>IT</option>
            <option>ECE</option>
            <option>EEE</option>
            <option>AI & DS</option>
            <option>AI & ML</option>
            <option>MECH</option>
            <option>CIVIL</option>
          </select>

          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select Location</option>
            <option>Chennai</option>
            <option>Coimbatore</option>
            <option>Madurai</option>
            <option>Vellore</option>
            <option>Erode</option>
            <option>Thanjavur</option>
            <option>Kanchipuram</option>
            <option>Chengalpattu</option>
          </select>

          <button type="submit">
            {loading ? "Predicting..." : "Predict Colleges"}
          </button>
        </form>
      </div>

      {results.length > 0 && (
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
                margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
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
                  label={{ value: "", position: "top", fill: "red" }}
                />
                <Bar
                  dataKey="predictedCutoff"
                  barSize={12}
                  fill="#667eea"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {results.length === 0 && !loading && (
        <p className="no-result">No eligible colleges found.</p>
      )}
    </div>
  );
};

export default PredictForm;