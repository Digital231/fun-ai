# PersonaChat Frontend

A React-based chat application that enables users to have conversations with AI personas with distinct personalities and characteristics.

## Features

- Chat with a variety of AI personas including Albert Einstein, Donald Trump, Deadpool, and more
- Clean, modern UI with dark mode
- Real-time streaming responses
- Persistent chat history
- Token usage tracking and visualization
- Mobile-responsive design

## Tech Stack

- React 19
- React Router 7
- Tailwind CSS 4
- Zustand (for state management)
- Recharts (for data visualization)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/personachat-frontend.git
cd personachat-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Update the backend API URL:

In `ChatPage.jsx`, update the fetch URL to point to your backend:

```javascript
// Look for this line in the sendMessage function
const res = await fetch("https://your-backend-url.run.app/api/gemini-stream", {
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── App.jsx           # Main application component with routes
├── main.jsx          # Entry point
├── components/       # Reusable UI components
├── pages/            # Page components
│   ├── HomePage.jsx   # Character selection page
│   ├── ChatPage.jsx   # Chat interface
├── store/            # State management
│   ├── chatStore.js   # Zustand store for chat state
└── index.css         # Global styles
```

## Deployment

The frontend can be deployed to any static hosting service:

1. Build the project:
   ```bash
   npm run build
   ```

2. The built files will be in the `dist` directory
3. Upload these files to your preferred hosting service

## Customizing Personas

You can modify the available AI personas by editing the `chatCharacters` array in `HomePage.jsx`. Each character has:

- `id`: Unique identifier
- `name`: Character name
- `description`: Brief description
- `imagePlaceholder`: URL to character image
- `personaPrompt`: System prompt that defines the character's personality

## License

This project is for fun and educational purposes.
