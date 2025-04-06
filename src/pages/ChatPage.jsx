import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useChatStore from "../store/chatStore";
import Sidebar from "../components/Sidebar";

function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    // eslint-disable-next-line no-unused-vars
    currentChatId,
    setCurrentChatId,
    getCurrentChat,
    currentCharacter,
    isSidebarOpen,
  } = useChatStore();

  useEffect(() => {
    if (chatId) setCurrentChatId(parseInt(chatId, 10));
  }, [chatId, setCurrentChatId]);

  const currentChat = getCurrentChat();

  useEffect(() => {
    if (!currentCharacter && !currentChat) {
      navigate("/");
    }
  }, [currentCharacter, currentChat, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [message]);

  useEffect(() => {
    if (!isLoading) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  const sendMessage = async () => {
    if (!message.trim() || !currentCharacter || !currentChat) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
    };

    useChatStore.setState((state) => {
      const chats = { ...state.chats };
      chats[currentCharacter.id] = chats[currentCharacter.id].map((chat) =>
        chat.id === currentChat.id ? updatedChat : chat
      );
      return { chats };
    });

    setMessage("");
    setIsLoading(true);
    textareaRef.current?.focus();

    const placeholderId = Date.now() + 1;
    const botMessage = {
      id: placeholderId,
      sender: "bot",
      text: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    useChatStore.setState((state) => {
      const chats = { ...state.chats };
      chats[currentCharacter.id] = chats[currentCharacter.id].map((chat) =>
        chat.id === currentChat.id
          ? { ...chat, messages: [...chat.messages, botMessage] }
          : chat
      );
      return { chats };
    });

    const buildPrompt = (messages, characterName) =>
      messages
        .map((msg) => {
          const roleName = msg.sender === "user" ? "User" : characterName;
          return `${roleName}: ${msg.text}`;
        })
        .join("\n");

    const promptHistory = buildPrompt(
      [...updatedChat.messages],
      currentCharacter.name
    );
    const persona = currentCharacter.personaPrompt ?? "";
    const fullPrompt = `${persona}\n\n${promptHistory}\n${currentCharacter.name}:`;

    try {
      const res = await fetch(
        "https://personachat-api-931690948663.us-central1.run.app/api/gemini-stream",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: fullPrompt,
            character_name: currentCharacter.name,
          }),
        }
      );

      const inputTokens = parseInt(res.headers.get("x-input-tokens") || "0");
      const outputTokens = parseInt(res.headers.get("x-output-tokens") || "0");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let botText = "";
      let receivedFirstChunk = false;
      let tokenMetadata = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);

        if (chunk.includes("__USAGE_METADATA__:")) {
          const parts = chunk.split("__USAGE_METADATA__:");
          if (parts[0]) botText += parts[0];
          try {
            tokenMetadata = JSON.parse(parts[1]);
          } catch (e) {
            console.error("Failed to parse token metadata:", e);
          }
        } else {
          botText += chunk;
        }

        if (!receivedFirstChunk && chunk.trim() !== "") {
          receivedFirstChunk = true;
        }

        useChatStore.setState((state) => {
          const chats = JSON.parse(JSON.stringify(state.chats));
          const updatedChats = chats[currentCharacter.id].map((chat) => {
            if (chat.id !== currentChat.id) return chat;
            const updatedMessages = chat.messages.map((msg) =>
              msg.id === placeholderId
                ? { ...msg, text: botText, isStreaming: !receivedFirstChunk }
                : msg
            );
            return { ...chat, messages: updatedMessages };
          });
          return { chats: { ...chats, [currentCharacter.id]: updatedChats } };
        });
      }

      const recordTokens = useChatStore.getState().recordTokenUsage;
      if (tokenMetadata) {
        recordTokens(
          currentChat.id,
          tokenMetadata.input_tokens || 0,
          tokenMetadata.output_tokens || 0
        );
      } else if (inputTokens > 0 || outputTokens > 0) {
        recordTokens(currentChat.id, inputTokens, outputTokens);
      }
    } catch (err) {
      console.error("Stream failed", err);
    } finally {
      setIsLoading(false);

      useChatStore.setState((state) => {
        const chats = { ...state.chats };
        chats[currentCharacter.id] = chats[currentCharacter.id].map((chat) =>
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === placeholderId
                    ? { ...msg, isStreaming: false }
                    : msg
                ),
              }
            : chat
        );
        return { chats };
      });

      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderMessageContent = (msg) => {
    if (msg.sender === "bot" && msg.isStreaming && msg.text.trim() === "") {
      return (
        <div className="flex items-center space-x-2">
          <div
            className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: "200ms" }}
          />
          <div
            className="w-2.5 h-2.5 bg-zinc-400 rounded-full animate-bounce"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      );
    }
    return msg.text;
  };

  return (
    <div className="h-screen w-full flex bg-zinc-950 text-white font-[SF Pro Display, -apple-system, BlinkMacSystemFont]">
      <Sidebar />

      <div
        className={`flex-1 flex flex-col relative transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
          {currentChat && currentChat.messages.length > 0 ? (
            currentChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-xl rounded-2xl px-5 py-3 shadow-md transition-all ${
                  msg.sender === "user"
                    ? "ml-auto bg-gradient-to-br from-zinc-800 to-zinc-700 text-white"
                    : "mr-auto bg-zinc-800 text-zinc-200"
                }`}
              >
                {renderMessageContent(msg)}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-12">
              <h1 className="text-3xl font-semibold mb-2">
                Chat with {currentCharacter?.name}
              </h1>
              <p className="text-zinc-500">
                Start a conversation and see where it goes.
              </p>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        {currentChat && (
          <div className="px-4 pb-6 pt-2 border-t border-zinc-800 backdrop-blur-lg bg-zinc-900/70">
            <div className="max-w-3xl mx-auto flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={`Message ${currentCharacter?.name}...`}
                className="flex-1 resize-none bg-zinc-800 text-white placeholder-zinc-400 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all overflow-hidden"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="p-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <line
                    x1="22"
                    y1="2"
                    x2="11"
                    y2="13"
                  />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-zinc-500 mt-2">
              {currentCharacter?.name} may hallucinate. Verify critical info.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
