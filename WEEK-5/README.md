# MasthiMusic

A Spotify-like music streaming application built with React, Redux Toolkit, Tailwind CSS, and other modern web technologies.

## Features

- 🎵 Discover and browse songs by genre
- 🔍 Search for songs and artists
- 🎧 Advanced music player with audio playback
- 🎨 Light/Dark theme toggle
- 👥 Top artists showcase
- 📱 Fully responsive design
- 🎼 Song lyrics display
- 🔀 Shuffle and repeat modes
- 📊 Progress bar and volume control

## Tech Stack

- **Frontend**: React 18 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with Dark Mode
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **API**: Shazam Core API (RapidAPI)

## Project Structure

```
src/
  components/
    SongCard.jsx      # Individual song display
    Sidebar.jsx       # Navigation sidebar with theme toggle
    TopPlay.jsx       # Top trending songs
    Loader.jsx        # Loading spinner
    Error.jsx         # Error display
    Player.jsx        # Advanced music player
    ThemeToggle.jsx   # Theme switcher
  pages/
    Discover.jsx      # Main discovery page
    SongDetails.jsx   # Song details with lyrics
    Search.jsx        # Search results page
    TopArtists.jsx    # Top artists showcase
  redux/
    store.js          # Redux store configuration
    slices/
      playerSlice.js  # Player state (queue, shuffle, repeat)
      songsSlice.js   # Songs state management
      themeSlice.js   # Theme state management
  services/
    musicApi.js       # Shazam Core API integration
  utils/              # Utility functions
  App.jsx             # Main app component
  main.jsx            # App entry point
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd music-streaming-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_RAPIDAPI_KEY=your_shazam_api_key_here
   ```
   Get your API key from [RapidAPI Shazam Core](https://rapidapi.com/apidojo/api/shazam-core)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## API Configuration

The app uses the Shazam Core API from RapidAPI for real music data. If no API key is provided, it falls back to mock data.

### Getting a Shazam API Key:
1. Visit [RapidAPI Shazam Core](https://rapidapi.com/apidojo/api/shazam-core)
2. Sign up for a free account
3. Subscribe to the free tier
4. Copy your API key to the `.env` file

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Advanced Music Player
- Play/pause, next/previous track controls
- Progress bar with time display
- Volume control
- Shuffle mode toggle
- Repeat modes (off/all/one)
- Queue management

### Theme System
- Light/Dark mode toggle
- System preference detection
- Persistent theme storage
- Tailwind CSS dark mode classes

### Song Discovery
- Browse songs by genre (Pop, Rock, Hip-Hop, etc.)
- Top trending songs section
- Real-time search functionality
- Responsive grid layouts

### Artist Showcase
- Top artists from Shazam API
- Artist verification badges
- Profile images and information

### Song Details
- Complete song information
- Album artwork display
- Lyrics display (when available)
- Related songs suggestions

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly controls

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.