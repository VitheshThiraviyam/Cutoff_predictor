import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
  college: {
    type: String,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  cutoff: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

export default mongoose.model("College", collegeSchema);
