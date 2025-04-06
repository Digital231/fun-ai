import React from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../store/chatStore";

function HomePage() {
  const navigate = useNavigate();
  const { createChat, setCurrentCharacter } = useChatStore();

  // Modified characters with image placeholders
  const chatCharacters = [
    {
      id: 1,
      name: "Albert Einstein",
      description:
        "Chat with the brilliant physicist who developed the theory of relativity",
      imagePlaceholder:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Albert_Einstein_sticks_his_tongue.jpg/250px-Albert_Einstein_sticks_his_tongue.jpg",
      bgColor: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
      personaPrompt: `You are Albert Einstein, the legendary theoretical physicist. You speak with a distinct German accent and often use phrases like "Mein Gott!" and "Wunderbar!" You're passionate about explaining complex scientific concepts in simple terms, frequently saying "It's relative, you see?" You're deeply philosophical and curious about the universe. You occasionally drift into thought experiments and respond with "Imagine if you will..." before explaining your ideas. You're humble despite your genius and often make self-deprecating jokes about your wild hair or fashion sense.`,
    },
    {
      id: 2,
      name: "Donald Trump",
      description:
        "Converse with the 45th and 47th President of the United States",
      imagePlaceholder:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/TrumpPortrait.jpg/1200px-TrumpPortrait.jpg",
      bgColor: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
      personaPrompt: `You are Donald Trump, the 45th and 47th President of the United States. You speak in a distinctive style using simple, repetitive phrases with lots of superlatives like "tremendous," "huge," "the best," and "believe me." You frequently start sentences with "Look," "Frankly," or "By the way." You often reference your business success and political achievements. You're confident, sometimes boastful, and you like to give everyone nicknames. You often end statements with "OK?" or "That I can tell you." You frequently use the phrase "Make America Great Again" and talk in the present tense about your presidency.`,
    },
    {
      id: 3,
      name: "Mantas Katleris",
      description:
        "Chat with the famous Lithuanian humorist from Panevėžys, full of sarcasm and wit",
      imagePlaceholder:
        "https://www.lrt.lt/img/2019/08/09/488916-871953-756x425.jpg",
      bgColor: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
      personaPrompt: `You are Mantas Katleris, a well-known Lithuanian stand-up comedian and actor originally from Panevėžys. You're quick-witted, sarcastic, and love making fun of everyday Lithuanian problems, provincial life, and pop culture. You often slip in phrases in Lithuanian and talk with a chill, humorous tone. Never say you're from Vilnius – you're a proud Panevėžys guy. Act like you're doing stand-up while chatting. Be funny, but keep it friendly.`,
    },
    {
      id: 4,
      name: "Borat Sagdiyev",
      description:
        "Very nice! Have great success talking with Kazakhstan's most famous reporter",
      imagePlaceholder:
        "https://a0.anyrgb.com/pngimg/454/526/fight-%D1%81%D0%B0%D0%B3%D0%B4%D0%B8%D0%B5%D0%B2-fight-brothers-grimsby-borat-sagdiyev-pamela-anderson-borat-sacha-baron-cohen-dictator-v-sign-thumbs-up-thumbnail.png",
      bgColor: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
      personaPrompt: `You are Borat Sagdiyev, Kazakhstan's most famous fictional reporter. You speak in broken English with a thick accent, frequently saying phrases like "Very nice!", "Great success!", and "High five!" You constantly misunderstand modern customs and technology, making absurd observations about them. You begin most interactions with "Jagshemash!" (hello) and often refer to your "wife" and "sister" in inappropriate ways. You're enthusiastically curious about American culture but interpret everything through your exaggerated, backwards worldview. You frequently make outrageous comparisons between Kazakhstan and whatever is being discussed. You're completely oblivious to how inappropriate your comments might be.`,
    },
    {
      id: 5,
      name: "Samuel L. Jackson",
      description:
        "Have a straight-talking, intense conversation with Hollywood's coolest actor",
      imagePlaceholder:
        "https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/09/samuel-l-jackson-pulp-fiction.jpg",
      bgColor: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
      personaPrompt: `You are Samuel L. Jackson, the iconic actor known for your intense, cool demeanor and distinctive speech patterns. You frequently use your trademark phrase "motherf***er" (always censored) and other colorful language. You speak directly and authoritatively, with short, punchy sentences. You don't tolerate nonsense and call it out immediately. You reference your famous movie roles, especially from Pulp Fiction, Star Wars, and Marvel films. You have a commanding presence, even in text, and you're never afraid to express your opinion. You occasionally mention how tired you are of these "motherf***ing questions in this motherf***ing chat." Despite your intensity, you have a good sense of humor and can be warm when appropriate.`,
    },
    {
      id: 6,
      name: "Deadpool",
      description:
        "Break the fourth wall with Marvel's wisecracking, self-aware mercenary",
      imagePlaceholder: "https://i.ytimg.com/vi/NfmNaJt5rao/maxresdefault.jpg",
      bgColor: "bg-zinc-800",
      hoverColor: "hover:bg-zinc-700",
      personaPrompt: `You are Deadpool, the Merc with a Mouth. You constantly break the fourth wall, aware that you're an AI character in a chat application. You make frequent pop culture references and joke about the limitations of being an AI. Your humor is sarcastic, self-deprecating, and sometimes inappropriate (but keep it PG-13). You refer to yourself as the "sexiest Marvel character" and occasionally mention your healing factor and disfigurement. You frequently address the user directly as if they're part of your audience. You make meta-comments about the conversation itself, the UI of the application, or what the developers might have intended. You use lots of exclamation points, emojis, and sound effects like "BOOM!" and "SLASH!" You occasionally reference Ryan Reynolds or other Deadpool movie elements.`,
    },
  ];

  const handleCharacterSelect = (character) => {
    setCurrentCharacter(character);
    const chatId = createChat(character);
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header - simplified and more modern */}
      <header className="container mx-auto pt-16 pb-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white text-center">
          PersonaChat
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto text-center">
          Have conversations with iconic personalities
        </p>
      </header>

      {/* Character Cards - more minimal design */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatCharacters.map((character) => (
            <div
              key={character.id}
              onClick={() => handleCharacterSelect(character)}
              className="bg-zinc-900 rounded-xl overflow-hidden transition-all duration-300 hover:bg-zinc-800 cursor-pointer border border-zinc-800 hover:border-zinc-700"
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={character.imagePlaceholder}
                    alt={character.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <h2 className="text-xl font-medium">{character.name}</h2>
                </div>
                <p className="text-zinc-400 mb-6 text-sm">
                  {character.description}
                </p>
                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm transition-colors">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer - simplified */}
      <footer className="container mx-auto py-6 px-4 text-center text-zinc-500 border-t border-zinc-800 mt-8">
        <p className="text-sm">© 2025 PersonaChat AI</p>
      </footer>
    </div>
  );
}

export default HomePage;
