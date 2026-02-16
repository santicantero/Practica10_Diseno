import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import NotFound from "./pages/NotFound";
import TagGames from "./pages/TagGames";
import Publishers from "./pages/Publishers";
import PublisherDetail from "./pages/PublisherDetail";


export default function App() {
  return (
    <div className="min-h-screen text-zinc-900 flex flex-col bg-gradient-to-b from-indigo-50 via-white to-cyan-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/tag/:slug" element={<TagGames />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/publisher/:id" element={<PublisherDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
