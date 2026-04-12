import mongoose from "mongoose";

const familyDetailsSchema = new mongoose.Schema({
  fatherName: { type: String, required: true, minlength: 2 },
  motherName: { type: String, required: true , minlength: 2 },
  numChildren: { type: Number, required: true , min: 0 },
});
export default mongoose.model("FamilyDetails", familyDetailsSchema);