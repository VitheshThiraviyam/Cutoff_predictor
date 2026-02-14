import express from "express";
import College from "../models/college.js";

const router = express.Router();

router.get("/predict", async (req, res) => {
  try {
    const { cutoff, branch, category, year } = req.query;

    const colleges = await College.find({
      branch,
      category,
      year: Number(year),
      cutoff: { $lte: Number(cutoff) },
    }).sort({ cutoff: -1 });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/predict-admission", async (req, res) => {
  try {
    const { branch, category, location } = req.query;

    if (!branch || !category || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    const data = await College.find({
      branch,
      category,
      location
    }).sort({ year: 1 });

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const collegeMap = {};

    data.forEach(record => {
      if (!collegeMap[record.college]) {
        collegeMap[record.college] = [];
      }
      collegeMap[record.college].push(record);
    });

    const predictions = [];

    for (const collegeName in collegeMap) {

      const records = collegeMap[collegeName];

      if (records.length < 5) continue;

      const lastFive = records.slice(-5);

      const years = lastFive.map(r => r.year);
      const cutoffs = lastFive.map(r => r.cutoff);

      const n = years.length;

      const sumX = years.reduce((a, b) => a + b, 0);
      const sumY = cutoffs.reduce((a, b) => a + b, 0);
      const sumXY = years.reduce((sum, year, i) => sum + year * cutoffs[i], 0);
      const sumX2 = years.reduce((sum, year) => sum + year * year, 0);

      const slope =
        (n * sumXY - sumX * sumY) /
        (n * sumX2 - sumX * sumX);

      const intercept = (sumY - slope * sumX) / n;

      const lastYear = Math.max(...years);
      const nextYear = lastYear + 1;

      const predictedCutoff = slope * nextYear + intercept;

      predictions.push({
        college: collegeName,
        predictedYear: nextYear,
        predictedCutoff: parseFloat(predictedCutoff.toFixed(2))
      });
    }

    res.json({
      branch,
      category,
      location,
      totalColleges: predictions.length,
      predictions
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/colleges", async (req, res) => {
  try {
    const colleges = await College.find().select("college -_id");
    const uniqueColleges = [...new Set(colleges.map((c) => c.college))];
    res.json(uniqueColleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
