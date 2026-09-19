import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "getCurrentUser Error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { assistantName } = req.body;
    let assistantImageUrl = req.body.assistantImage;

    if (req.file) {
      const uploadedUrl = await uploadOnCloudinary(req.file.path);
      if (uploadedUrl) {
        assistantImageUrl = uploadedUrl;
      }
    }

    const updateFields = {};
    if (assistantName && assistantName.trim()) {
      updateFields.assistantName = assistantName.trim();
    }
    if (assistantImageUrl) {
      updateFields.assistantImage = assistantImageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: "Failed to update assistant" });
  }
};
