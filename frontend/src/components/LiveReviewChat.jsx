import React, { useState, useEffect, useRef, useContext } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";
import { API_URL } from "../utils/api";
import { Send, MessageSquare, Zap, User } from "lucide-react";

export default function LiveReviewChat({ postId, currentUser }) {
  const context = useContext(UserContext);
  const activeUser = currentUser || context?.user;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Connect to the backend WebSocket server
    const socket = io(API_URL, {
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      if (postId) {
        socket.emit("joinReviewRoom", postId);
      }
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Listen for incoming review messages
    socket.on("receiveReviewMessage", (incomingData) => {
      // Avoid duplicates if message was already added
      setMessages((prev) => {
        if (incomingData.id && prev.some((m) => m.id === incomingData.id)) {
          return prev;
        }
        return [...prev, incomingData];
      });
    });

    // Also support generic chatMessage event
    socket.on("chatMessage", (incomingData) => {
      setMessages((prev) => [...prev, incomingData]);
    });

    return () => {
      socket.disconnect();
    };
  }, [postId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const senderName =
      activeUser?.name || activeUser?.username || "Guest Dev";

    const payload = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      postId,
      author: senderName,
      username: senderName,
      text: inputMessage.trim(),
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Emit real-time message through Socket.IO (EXP NO. 8)
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("sendReviewMessage", payload);
      socketRef.current.emit("chatMessage", payload);
    } else {
      // Local fallback if socket temporarily disconnected
      setMessages((prev) => [...prev, payload]);
    }

    setInputMessage("");
  };

  return (
    <div className="bg-[#151517] border border-[#242427] rounded-xl p-4 space-y-3">
      {/* Header with Connection Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#242427]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-950/50 border border-sky-800/40 flex items-center justify-center text-[#4F9CF9]">
            <Zap size={15} />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#E8E8EA] flex items-center gap-1.5">
              Live Review Discussion
            </h3>
            <p className="text-[11px] text-[#8A8A8E]">
              Real-time collaborative chat with online reviewers
            </p>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            connected
              ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/50"
              : "bg-amber-950/40 text-amber-400 border-amber-800/50"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <span>{connected ? "Live Connected" : "Connecting..."}</span>
        </div>
      </div>

      {/* Message List */}
      <div className="bg-[#0E0E10] border border-[#242427] rounded-lg p-3 max-h-56 overflow-y-auto space-y-2.5">
        {messages.length === 0 ? (
          <div className="py-6 text-center space-y-1">
            <MessageSquare
              size={20}
              className="mx-auto text-[#5A5A5E]"
            />
            <p className="text-xs text-[#8A8A8E]">
              No live discussion messages yet.
            </p>
            <p className="text-[11px] text-[#5A5A5E]">
              Start the discussion or ask questions about this snippet!
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe =
              msg.author === (activeUser?.name || activeUser?.username);

            return (
              <div
                key={msg.id || index}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-[#8A8A8E] mb-0.5 px-1">
                  <span className="font-semibold text-[#E8E8EA]">
                    {msg.author || msg.username || 'Reviewer'}
                  </span>
                  <span>·</span>
                  <span>{msg.time || "Just now"}</span>
                </div>
                <div
                  className={`rounded-lg px-3 py-1.5 text-xs max-w-[85%] break-words ${
                    isMe
                      ? "bg-[#1E293B] text-sky-200 border border-sky-800/40"
                      : "bg-[#151517] text-[#E8E8EA] border border-[#242427]"
                  }`}
                >
                  {msg.text || msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={`Chat live as @${
            activeUser?.name || activeUser?.username || "Reviewer"
          }...`}
          className="flex-1 bg-[#0E0E10] border border-[#242427] focus:border-[#4F9CF9] rounded-lg px-3 py-2 text-xs text-[#E8E8EA] placeholder-[#5A5A5E] outline-none transition"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="bg-[#4F9CF9] hover:bg-[#3b82f6] disabled:opacity-40 disabled:cursor-not-allowed text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
        >
          <Send size={13} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}