import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Colleges.css";

const Colleges = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await await axios.get(
          `${import.meta.env.VITE_API_URL}/api/colleges`
        );
        setColleges(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching colleges:", err);
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  if (loading) {
    return (
      <div className="colleges-page">
        <p className="loading-text">Loading colleges...</p>
      </div>
    );
  }

  return (
    <div className="colleges-page">
      <div className="colleges-container">
        <h2>🎓 Tamil Nadu Colleges</h2>

        <div className="college-grid">
          {colleges.map((college, index) => (
            <div key={index} className="college-card">
              {college}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Colleges;
