import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set, get) => ({
      isSidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      currentCharacter: null,
      setCurrentCharacter: (character) => {
        set({ currentCharacter: character });
      },

      chats: {},
      tokenUsage: {},

      createChat: (character) => {
        const newChat = {
          id: Date.now(),
          title: `Chat ${new Date().toLocaleTimeString()}`,
          messages: [],
          timestamp: new Date().toISOString(),
        };

        set((state) => {
          const characterChats = state.chats[character.id] || [];

          return {
            currentCharacter: character,
            currentChatId: newChat.id,
            chats: {
              ...state.chats,
              [character.id]: [newChat, ...characterChats],
            },
          };
        });

        return newChat.id;
      },

      getCharacterChats: (characterId) => {
        const state = get();
        return state.chats[characterId] || [];
      },

      currentChatId: null,
      setCurrentChatId: (chatId) => {
        set({ currentChatId: chatId });
      },

      getCurrentChat: () => {
        const state = get();
        if (!state.currentCharacter || !state.currentChatId) return null;

        const characterChats = state.chats[state.currentCharacter.id] || [];
        return characterChats.find((chat) => chat.id === state.currentChatId);
      },

      updateChatTitle: (chatId, title) => {
        set((state) => {
          if (!state.currentCharacter) return state;

          const characterId = state.currentCharacter.id;
          const characterChats = state.chats[characterId] || [];

          const updatedChats = characterChats.map((chat) =>
            chat.id === chatId ? { ...chat, title } : chat
          );

          return {
            chats: {
              ...state.chats,
              [characterId]: updatedChats,
            },
          };
        });
      },
      deleteChat: (chatId) => {
        set((state) => {
          if (!state.currentCharacter) return state;

          const characterId = state.currentCharacter.id;
          const updatedChats = (state.chats[characterId] || []).filter(
            (chat) => chat.id !== chatId
          );

          const newState = {
            chats: {
              ...state.chats,
              [characterId]: updatedChats,
            },
          };

          if (state.currentChatId === chatId) {
            newState.currentChatId = null;
          }

          return newState;
        });
      },

      recordTokenUsage: (chatId, inputTokens, outputTokens) => {
        set((state) => {
          const existingUsage = state.tokenUsage[chatId] || {
            totalInput: 0,
            totalOutput: 0,
            history: [],
          };

          const updatedUsage = {
            totalInput: existingUsage.totalInput + inputTokens,
            totalOutput: existingUsage.totalOutput + outputTokens,
            history: [
              ...existingUsage.history,
              {
                timestamp: new Date().toISOString(),
                input: inputTokens,
                output: outputTokens,
              },
            ],
          };

          return {
            tokenUsage: {
              ...state.tokenUsage,
              [chatId]: updatedUsage,
            },
          };
        });
      },

      getChatTokenUsage: (chatId) => {
        const state = get();
        return (
          state.tokenUsage[chatId] || {
            totalInput: 0,
            totalOutput: 0,
            history: [],
          }
        );
      },

      getTotalTokenUsage: () => {
        const state = get();
        const usage = Object.values(state.tokenUsage);

        return usage.reduce(
          (total, chatUsage) => {
            return {
              totalInput: total.totalInput + chatUsage.totalInput,
              totalOutput: total.totalOutput + chatUsage.totalOutput,
            };
          },
          { totalInput: 0, totalOutput: 0 }
        );
      },
    }),
    {
      name: "chat-store",
    }
  )
);

export default useChatStore;
