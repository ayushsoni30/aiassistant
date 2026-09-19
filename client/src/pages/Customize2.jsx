import React, { useState, useContext, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoArrowBack, IoSparkles } from "react-icons/io5";

const SUGGESTED_NAMES = ["Jarvis", "Friday", "Nova", "Cyberia", "Cortana", "Aura", "Comatozze"];

const Customize2 = () => {
  const {
    userData,
    setUserData,
    frontendImage,
    backendImage,
    selectedImage,
    serverUrl,
  } = useContext(userDataContext);

  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeAvatar = frontendImage || selectedImage || userData?.assistantImage;

  useEffect(() => {
    if (!activeAvatar) {
      navigate("/customize");
    }
  }, [activeAvatar, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!assistantName.trim()) {
      setErrorMsg("Please provide a name for your assistant");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      let result;
      if (backendImage) {
        const formData = new FormData();
        formData.append("image", backendImage);
        formData.append("assistantName", assistantName.trim());

        result = await axios.post(`${serverUrl}/api/user/update`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      } else {
        result = await axios.post(
          `${serverUrl}/api/user/update`,
          {
            assistantName: assistantName.trim(),
            assistantImage: selectedImage || userData?.assistantImage,
          },
          { withCredentials: true }
        );
      }

      setUserData(result.data);
      navigate("/");
    } catch (err) {
      console.error("Failed to configure assistant:", err);
      setErrorMsg(err.response?.data?.message || "Failed to save assistant settings");
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-t from-black via-slate-950 to-blue-900 flex flex-col justify-center items-center p-6 relative">
      <button
        onClick={() => navigate("/customize")}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 transition-all cursor-pointer backdrop-blur-md"
      >
        <IoArrowBack size={18} /> Reselect Avatar
      </button>

      <div className="text-center max-w-md mb-8">
        <span className="text-blue-400 font-semibold tracking-widest text-sm uppercase">Step 2 of 2</span>
        <h1 className="text-white text-3xl md:text-4xl font-extrabold mt-2 tracking-tight">
          Name Your Assistant
        </h1>
        <p className="text-gray-300 mt-2 text-sm md:text-base">
          Give your AI identity a name that suits its personality
        </p>
      </div>

      <div className="relative mb-8 group">
        <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-blue-500 shadow-2xl shadow-blue-500/50 bg-black">
          {activeAvatar && (
            <img
              src={activeAvatar}
              alt="Assistant Avatar Preview"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-slate-950">
          <IoSparkles size={18} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center gap-5">
        <div className="w-full">
          <input
            className="w-full h-14 bg-black/50 border-2 border-blue-500/80 focus:border-blue-400 text-white placeholder:text-gray-400 px-6 rounded-2xl font-sans text-xl outline-none transition-all shadow-inner"
            type="text"
            placeholder="e.g. Jarvis, Nova, Friday"
            value={assistantName}
            onChange={(e) => setAssistantName(e.target.value)}
            maxLength={30}
            autoFocus
          />

          {errorMsg && (
            <p className="text-red-400 text-sm mt-2 text-center font-medium">
              *{errorMsg}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Suggested Names</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED_NAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setAssistantName(name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                  assistantName === name
                    ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/50"
                    : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/15 hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !assistantName.trim()}
          className={`mt-4 w-full h-14 rounded-2xl text-xl font-bold border-2 transition-all duration-300 cursor-pointer shadow-xl flex items-center justify-center gap-3 ${
            submitting || !assistantName.trim()
              ? "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
              : "bg-blue-600 border-blue-400 text-white hover:bg-blue-500 hover:shadow-blue-500/50 hover:scale-[1.02]"
          }`}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Configuring Assistant...</span>
            </>
          ) : (
            <span>Launch Virtual Assistant</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Customize2;
