import "./App.css";
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home";

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900">
      <div className="w-[70%] mx-auto">
        <Routes>
          <Route path="/" element={<Home />} ></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
