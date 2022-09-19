import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";
function App() {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/tv" element={<Tv />}>
          <Route path=":tvId" element={<Tv />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path="/search/:keyword" element={<Search />} />
          <Route path="/search/:keyword/:movieId" element={<Search />} />
        </Route>
        <Route path="/" element={<Home />}>
          <Route path="netflix-clone" element={<Home />} />
          <Route path="movies/:movieId" element={<Home />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
