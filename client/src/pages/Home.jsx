import React, { useState, useEffect, useRef, useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  IoMic,
  IoMicOff,
  IoSend,
  IoSparkles,
  IoVolumeHigh,
  IoVolumeMute,
  IoTimeOutline,
  IoClose,
  IoTrashOutline,
} from "react-icons/io5";
import {
  MdSettings,
  MdHistory,
  MdExitToApp,
  MdOpenInNew,
} from "react-icons/md";
import { FaRobot } from "react-icons/fa";

const QUICK_PROMPTS = [
  "What time is it?",
  "Open YouTube",
  "Open Google",
  "Tell me a joke",
  "Open GitHub",
  "Today's date",
];

const Home = () => {
  const { userData, serverUrl, handleLogout } = useContext(userDataContext);
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle"); // "idle" | "listening" | "processing" | "speaking"
  const [transcript, setTranscript] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [latestUserPrompt, setLatestUserPrompt] = useState("");
  const [latestAssistantResponse, setLatestAssistantResponse] = useState(
    `Greetings, ${userData?.name || "User"}! I am ${
      userData?.assistantName || "your AI Assistant"
    }. How can I help you today?`
  );
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  // Load conversation history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/history`, {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    };
    fetchHistory();
  }, [serverUrl]);

  // Scroll chat drawer when history updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isHistoryOpen]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setStatus("listening");
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let current = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setTranscript(current);

      if (event.results[0].isFinal) {
        const finalQuery = current.trim();
        if (finalQuery) {
          handleSendPrompt(finalQuery);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setStatus("idle");
    };

    recognition.onend = () => {
      // If we weren't transitioning to processing, return to idle
      setStatus((prev) => (prev === "listening" ? "idle" : prev));
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Text to Speech
  const speakResponse = (text) => {
    if (isMuted || !("speechSynthesis" in window)) {
      setStatus("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Natural") ||
          v.name.includes("Google") ||
          v.name.includes("Samantha") ||
          v.name.includes("David"))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => setStatus("idle");
    utterance.onerror = () => setStatus("idle");

    window.speechSynthesis.speak(utterance);
  };

  // Toggle voice listening
  const toggleListening = () => {
    if (!speechSupported) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (status === "listening") {
      recognitionRef.current?.stop();
      setStatus("idle");
    } else {
      window.speechSynthesis?.cancel();
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Error starting recognition:", err);
      }
    }
  };

  // Process and send user prompt
  const handleSendPrompt = async (promptToSend) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text) return;

    setInputPrompt("");
    setTranscript("");
    setLatestUserPrompt(text);
    setStatus("processing");
    setActiveAction(null);

    // Optimistic user entry in local history
    const tempUserMsg = { role: "user", content: text, timestamp: new Date() };
    setHistory((prev) => [...prev, tempUserMsg]);

    try {
      const res = await axios.post(
        `${serverUrl}/api/user/ask`,
        { prompt: text },
        { withCredentials: true }
      );

      const { reply, action, history: updatedHistory } = res.data;

      setLatestAssistantResponse(reply);
      if (Array.isArray(updatedHistory)) {
        setHistory(updatedHistory);
      } else {
        setHistory((prev) => [
          ...prev,
          { role: "assistant", content: reply, timestamp: new Date() },
        ]);
      }

      // Execute web action if command triggered one
      if (action && action.type === "open" && action.url) {
        setActiveAction(action);
        window.open(action.url, "_blank");
      }

      // Speak response aloud
      speakResponse(reply);
    } catch (err) {
      console.error("Failed to query assistant:", err);
      const fallbackError =
        err.response?.data?.message ||
        "I had trouble processing that request. Please try again.";
      setLatestAssistantResponse(fallbackError);
      speakResponse(fallbackError);
      setStatus("idle");
    }
  };

  // Clear conversation history
  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your conversation history?")) {
      return;
    }
    try {
      await axios.delete(`${serverUrl}/api/user/history`, {
        withCredentials: true,
      });
      setHistory([]);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  const assistantName = userData?.assistantName || "AI Assistant";
  const assistantImage = userData?.assistantImage;

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white overflow-hidden flex flex-col justify-between selection:bg-blue-500 selection:text-white">
      {/* Dynamic Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none transition-all duration-700"></div>
      <div
        className={`absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 ${
          status === "listening"
            ? "bg-cyan-500/30 scale-125"
            : status === "speaking"
            ? "bg-indigo-500/30 scale-110"
            : "bg-blue-800/10"
        }`}
      ></div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-500 shadow-md shadow-blue-500/50 bg-black">
            {assistantImage ? (
              <img
                src={assistantImage}
                alt={assistantName}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaRobot className="w-full h-full p-2 text-blue-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg tracking-wide text-white">
                {assistantName}
              </h2>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all duration-300 ${
                  status === "listening"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 animate-pulse"
                    : status === "processing"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse"
                    : status === "speaking"
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/50 animate-pulse"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                ● {status}
              </span>
            </div>
            <p className="text-xs text-gray-400">User: {userData?.name}</p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mute Voice Synthesis Toggle */}
          <button
            onClick={() => {
              if (!isMuted) window.speechSynthesis?.cancel();
              setIsMuted(!isMuted);
            }}
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? "bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30"
                : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/15 hover:text-white"
            }`}
          >
            {isMuted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
          </button>

          {/* History Drawer Toggle */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            title="Conversation History"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white rounded-xl border border-white/10 transition-all cursor-pointer relative"
          >
            <MdHistory size={19} />
            <span className="hidden md:inline text-xs font-semibold">History</span>
            {history.length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {history.length}
              </span>
            )}
          </button>

          {/* Customize Assistant Re-entry */}
          <button
            onClick={() => navigate("/customize")}
            title="Customize Avatar & Name"
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-blue-300 rounded-xl border border-blue-500/40 transition-all cursor-pointer"
          >
            <MdSettings size={18} />
            <span className="hidden md:inline text-xs font-semibold">Customize</span>
          </button>

          {/* Logout */}
          <button
            onClick={async () => {
              await handleLogout();
              navigate("/signin");
            }}
            title="Log Out"
            className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl border border-red-500/30 transition-all cursor-pointer"
          >
            <MdExitToApp size={18} />
          </button>
        </div>
      </header>

      {/* Main Center Stage: Animated Virtual Assistant */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
        {/* Glowing Animated Avatar Stage */}
        <div className="relative flex items-center justify-center my-6 group">
          {/* Outer Pulsing Rings */}
          <div
            className={`absolute w-64 h-64 md:w-80 md:h-80 rounded-full border border-blue-500/30 transition-all duration-700 ${
              status === "listening"
                ? "scale-110 border-cyan-400 animate-pulse-ring"
                : status === "speaking"
                ? "scale-105 border-indigo-400 animate-pulse-ring"
                : "animate-pulse-ring"
            }`}
          ></div>
          <div
            className={`absolute w-52 h-52 md:w-68 md:h-68 rounded-full border border-blue-400/40 transition-all duration-500 ${
              status === "speaking" || status === "listening"
                ? "scale-105 border-blue-300 shadow-2xl shadow-blue-500/50"
                : ""
            }`}
          ></div>

          {/* Avatar Disc */}
          <div
            className={`relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 transition-all duration-500 shadow-2xl bg-black ${
              status === "listening"
                ? "border-cyan-400 shadow-cyan-500/60 scale-105"
                : status === "processing"
                ? "border-amber-400 shadow-amber-500/50 animate-pulse"
                : status === "speaking"
                ? "border-indigo-400 shadow-indigo-500/70 scale-105"
                : "border-blue-500 shadow-blue-500/50"
            }`}
          >
            {assistantImage ? (
              <img
                src={assistantImage}
                alt={assistantName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-b from-blue-900 to-black">
                <FaRobot size={64} className="text-blue-300" />
              </div>
            )}
          </div>
        </div>

        {/* Live Audio Equalizer Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-10 my-2">
          <div
            className={`w-1.5 bg-blue-500 rounded-full transition-all ${
              status === "speaking" || status === "listening"
                ? "animate-wave-1 bg-cyan-400"
                : "h-2 bg-blue-500/30"
            }`}
          ></div>
          <div
            className={`w-1.5 bg-blue-500 rounded-full transition-all ${
              status === "speaking" || status === "listening"
                ? "animate-wave-2 bg-cyan-400"
                : "h-3 bg-blue-500/30"
            }`}
          ></div>
          <div
            className={`w-1.5 bg-blue-500 rounded-full transition-all ${
              status === "speaking" || status === "listening"
                ? "animate-wave-3 bg-cyan-300"
                : "h-2 bg-blue-500/30"
            }`}
          ></div>
          <div
            className={`w-1.5 bg-blue-500 rounded-full transition-all ${
              status === "speaking" || status === "listening"
                ? "animate-wave-4 bg-cyan-400"
                : "h-3 bg-blue-500/30"
            }`}
          ></div>
          <div
            className={`w-1.5 bg-blue-500 rounded-full transition-all ${
              status === "speaking" || status === "listening"
                ? "animate-wave-5 bg-cyan-400"
                : "h-2 bg-blue-500/30"
            }`}
          ></div>
        </div>

        {/* Status Indicator & Live Transcript Display */}
        <div className="min-h-16 flex flex-col items-center justify-center max-w-2xl px-4">
          {status === "listening" && (
            <p className="text-cyan-400 font-medium text-lg animate-pulse flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              {transcript ? `"${transcript}"` : "Listening for voice..."}
            </p>
          )}

          {status === "processing" && (
            <div className="flex items-center gap-2 text-amber-400 text-lg">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing command...</span>
            </div>
          )}

          {status !== "listening" && status !== "processing" && (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md max-w-xl transition-all">
              {latestUserPrompt && (
                <p className="text-xs text-blue-400 font-semibold mb-1 uppercase tracking-wider">
                  You: "{latestUserPrompt}"
                </p>
              )}
              <p className="text-gray-100 text-base md:text-lg leading-relaxed font-light">
                {latestAssistantResponse}
              </p>
            </div>
          )}

          {/* Active Action Banner (e.g. YouTube, Google links) */}
          {activeAction && (
            <a
              href={activeAction.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/30 border border-blue-500 text-blue-300 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-lg"
            >
              <span>Action: Opened {activeAction.label || "Page"}</span>
              <MdOpenInNew size={14} />
            </a>
          )}
        </div>
      </main>

      {/* Bottom Controls: Microphone, Quick Chips & Text Prompt Bar */}
      <footer className="relative z-20 w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col items-center gap-3">
        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto w-full justify-center py-1 no-scrollbar">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSendPrompt(prompt)}
              disabled={status === "processing"}
              className="whitespace-nowrap text-xs bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar & Big Mic Button */}
        <div className="w-full flex items-center gap-3">
          {/* Futuristic Voice Mic Button */}
          <button
            onClick={toggleListening}
            title={status === "listening" ? "Stop Listening" : "Start Voice Assistant"}
            className={`relative p-4 md:p-4.5 rounded-2xl border-2 transition-all duration-300 cursor-pointer shadow-xl flex items-center justify-center shrink-0 ${
              status === "listening"
                ? "bg-cyan-500 border-cyan-300 text-black shadow-cyan-500/60 scale-105"
                : "bg-blue-600 border-blue-400 text-white hover:bg-blue-500 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
            }`}
          >
            {status === "listening" ? (
              <IoMicOff size={26} className="animate-pulse" />
            ) : (
              <IoMic size={26} />
            )}
          </button>

          {/* Text Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex-1 flex items-center bg-black/60 border-2 border-blue-600/60 focus-within:border-blue-400 rounded-2xl px-4 py-2 shadow-inner transition-all backdrop-blur-md"
          >
            <input
              type="text"
              placeholder={`Ask ${assistantName} anything or type a command...`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={status === "processing"}
              className="w-full bg-transparent text-white placeholder:text-gray-500 outline-none text-sm md:text-base py-1"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || status === "processing"}
              className="p-2 ml-2 rounded-xl text-blue-400 hover:text-white hover:bg-blue-600/30 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
            >
              <IoSend size={18} />
            </button>
          </form>
        </div>
      </footer>

      {/* Slide-out Conversation History Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-all">
          <div className="w-full max-w-md h-full bg-slate-950 border-l border-white/10 flex flex-col justify-between shadow-2xl p-5 animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MdHistory size={22} className="text-blue-400" />
                <h3 className="font-bold text-lg text-white">Conversation History</h3>
              </div>
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    title="Clear Conversation History"
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                  >
                    <IoTrashOutline size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                >
                  <IoClose size={22} />
                </button>
              </div>
            </div>

            {/* History Messages List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                  <IoTimeOutline size={40} />
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs text-gray-600">Start talking or typing to begin</p>
                </div>
              ) : (
                history.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <span className="text-[10px] text-gray-400 mb-1 px-1">
                      {msg.role === "user" ? "You" : assistantName}
                    </span>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/30"
                          : "bg-white/10 text-gray-200 rounded-bl-none border border-white/5"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Drawer Footer */}
            <div className="pt-3 border-t border-white/10 text-center">
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
