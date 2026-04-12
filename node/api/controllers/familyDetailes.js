import familyDetailes from "../models/familyDetailes.js";
export const getFamilyDetailes = async (req, res) => {
  try {
    const details = await familyDetailes.find();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const detail = await familyDetailes.findById(req.params.id);
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createFamilyDetailes = async (req, res) => {
  try {
     newDetail = new familyDetailes(req.body);
    const savedDetail = await newDetail.save();
    res.status(201).json(savedDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateFamilyDetailes = async (req, res) => {
  try {
    const updatedDetail = await familyDetailes.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.status(200).json(updatedDetail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteFamilyDetailes = async (req, res) => {
  try {
    await familyDetailes.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
