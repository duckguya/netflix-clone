import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <HashRouter>
      <Header />
      <HelmetProvider>
        <Routes>
          <Route path="/tv" element={<Tv />} />
          <Route path="/tv/:tvId" element={<Tv />} />

          <Route path="/search" element={<Search />} />
          <Route path="/search/:keyword" element={<Search />} />
          <Route path="/search/:keyword/:movieId" element={<Search />} />

          <Route path="/" element={<Home />} />
          <Route path="/netflix-clone" element={<Home />} />
          <Route path="/movies/:movieId" element={<Home />} />
        </Routes>
      </HelmetProvider>
    </HashRouter>
  );
}

export default App;
