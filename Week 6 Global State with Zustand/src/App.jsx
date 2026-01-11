import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Discover from './pages/Discover';
import SongDetails from './pages/SongDetails';
import Search from './pages/Search';
import TopArtists from './pages/TopArtists';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] text-gray-900 dark:text-white transition-colors duration-300">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/song/:id" element={<SongDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/top-artists" element={<TopArtists />} />
          </Routes>
        </main>
        <Player />
      </div>
    </Router>
  );
}

export default App;