import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Home from "./Pages/Home";

export default function App() {
  return (
    <h1 className="">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </h1>
  );
}
