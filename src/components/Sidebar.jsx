import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../store/chatStore";

function Sidebar() {
  const navigate = useNavigate();
  const {
    isSidebarOpen,
    toggleSidebar,
    currentCharacter,
    getCharacterChats,
    currentChatId,
    setCurrentChatId,
  } = useChatStore();

  // Close sidebar on small screens when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      const sidebarElement = document.getElementById("sidebar");
      const toggleButton = document.getElementById("sidebar-toggle");

      if (
        isSidebarOpen &&
        sidebarElement &&
        !sidebarElement.contains(e.target) &&
        toggleButton &&
        !toggleButton.contains(e.target)
      ) {
        // Only close on small screens
        if (window.innerWidth < 768) {
          toggleSidebar();
        }
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen, toggleSidebar]);

  // Group chats by date
  const groupChatsByDate = (chats) => {
    if (!chats || chats.length === 0) return {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      "Previous 30 Days": [],
      Older: [],
    };
    chats.forEach((chat) => {
      const chatDate = new Date(chat.timestamp);
      const chatDateString = chatDate.toDateString();
      const daysDiff = (new Date() - chatDate) / (1000 * 60 * 60 * 24);
      if (chatDateString === today) {
        groups["Today"].push(chat);
      } else if (chatDateString === yesterday) {
        groups["Yesterday"].push(chat);
      } else if (daysDiff <= 7) {
        groups["Previous 7 Days"].push(chat);
      } else if (daysDiff <= 30) {
        groups["Previous 30 Days"].push(chat);
      } else {
        groups["Older"].push(chat);
      }
    });
    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    return groups;
  };

  // Get chats for current character
  const characterChats = currentCharacter
    ? getCharacterChats(currentCharacter.id)
    : [];
  const groupedChats = groupChatsByDate(characterChats);

  // Handler for clicking a chat
  const handleChatClick = (chatId) => {
    setCurrentChatId(chatId);
    navigate(`/chat/${chatId}`);
    // Close sidebar on mobile after selecting a chat
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  // Handler for new chat
  const handleNewChat = () => {
    if (currentCharacter) {
      const chatId = useChatStore.getState().createChat(currentCharacter);
      navigate(`/chat/${chatId}`);
      // Close sidebar on mobile after creating a new chat
      if (window.innerWidth < 768) {
        toggleSidebar();
      }
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* Overlay for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar - now positioned as fixed overlay on mobile */}
      <div
        id="sidebar"
        className={`fixed top-0 left-0 h-full bg-zinc-900 text-white transition-all duration-300 shadow-xl z-30
                  ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
                  md:${isSidebarOpen ? "w-64" : "w-0"} w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              {currentCharacter && (
                <>
                  {currentCharacter.imagePlaceholder ? (
                    <img
                      src={currentCharacter.imagePlaceholder}
                      alt={currentCharacter.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${
                        currentCharacter.bgColor || "bg-zinc-700"
                      }`}
                    >
                      <span className="text-sm">
                        {currentCharacter.avatar || "👤"}
                      </span>
                    </div>
                  )}
                  <span className="font-medium">{currentCharacter.name}</span>
                </>
              )}
              {!currentCharacter && (
                <span className="font-medium">Select a Character</span>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1 text-zinc-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="18"
                  y1="6"
                  x2="6"
                  y2="18"
                ></line>
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                ></line>
              </svg>
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
            {Object.keys(groupedChats).length > 0 ? (
              Object.entries(groupedChats).map(([dateGroup, chats]) => (
                <div
                  key={dateGroup}
                  className="mb-2"
                >
                  <div className="px-3 py-2 text-xs text-zinc-500 font-medium">
                    {dateGroup}
                  </div>
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`px-3 py-3 hover:bg-zinc-800 transition-colors ${
                        currentChatId === chat.id ? "bg-zinc-800" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          onClick={() => handleChatClick(chat.id)}
                          className="flex items-center gap-2 cursor-pointer flex-1"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-zinc-400"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <span className="truncate text-sm">{chat.title}</span>
                        </div>
                        <button
                          onClick={() =>
                            useChatStore.getState().deleteChat(chat.id)
                          }
                          className="ml-2 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Delete chat"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6m5 0V4h4v2" />
                            <line
                              x1="10"
                              y1="11"
                              x2="10"
                              y2="17"
                            />
                            <line
                              x1="14"
                              y1="11"
                              x2="14"
                              y2="17"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-zinc-500 text-sm">
                {currentCharacter
                  ? "No chats yet with this character"
                  : "Select a character to start chatting"}
              </div>
            )}
          </div>

          {/* New Chat Button */}
          <div className="p-3 border-t border-zinc-800">
            <button
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-md py-2 px-3 hover:bg-zinc-200 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="12"
                  y1="5"
                  x2="12"
                  y2="19"
                ></line>
                <line
                  x1="5"
                  y1="12"
                  x2="19"
                  y2="12"
                ></line>
              </svg>
              <span>New Chat</span>
            </button>
          </div>

          {/* User/Settings */}
          <div className="p-3 border-t border-zinc-800 space-y-2">
            <button
              onClick={() => navigate("/token-usage")}
              className="w-full flex items-center justify-center gap-2 text-zinc-300 py-2 px-3 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-zinc-400"
                viewBox="0 0 24 24"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Token Usage</span>
            </button>

            <button
              onClick={() => {
                navigate("/");
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className="w-full flex items-center justify-center gap-2 text-zinc-300 py-2 px-3 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Characters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toggle button when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          id="sidebar-toggle"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-20 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition-colors text-white shadow-lg"
          aria-label="Open sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
            ></line>
            <line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
            ></line>
            <line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
            ></line>
          </svg>
        </button>
      )}
    </>
  );
}

export default Sidebar;
