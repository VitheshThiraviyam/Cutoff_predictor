import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import College from "./models/college.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("MongoDB connected for import");

const records = [];

fs.createReadStream("./data/cutoff.csv")
  .pipe(csv())
  .on("data", (row) => {
    const college = row.college?.trim();
    const branch = row.branch?.trim();
    const category = row.category?.trim();
    const location = row.location?.trim();
    const year = Number(row.year);
    const cutoff = Number(row.cutoff);

    if (
      !college ||
      !branch ||
      !category ||
      !location ||
      isNaN(year) ||
      isNaN(cutoff)
    ) {
      console.log("Skipping bad row:", row);
      return;
    }

    records.push({
      college,
      branch,
      category,
      year,
      cutoff,
      location,
    });
  })
  .on("end", async () => {
    try {
      await College.insertMany(records);
      console.log(`Imported ${records.length} records successfully`);
      process.exit();
    } catch (err) {
      console.error("Import error:", err.message);
      process.exit(1);
    }
  });
