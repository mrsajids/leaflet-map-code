import logo from "./logo.svg";
import "./App.css";
import IndiaMapContainer from "./components/IndiaMapContainer";
import About from "./components/About";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import MapComponent from "./components/MapComponent";

function App() {
  return (
    <>
      {/* <Navbar/> */}
      {/* <Routes>
       <Route path="/" component={IndiaMapContainer}  />
        <Route path="/about" component={About} />
    </Routes> */}
      <Routes>
        <Route path="/" element={<IndiaMapContainer />} />
        <Route path="about" element={<About />} />
        <Route path="history" element={<MapComponent />} />
      </Routes>
    </>
  ); 
}

export default App;
