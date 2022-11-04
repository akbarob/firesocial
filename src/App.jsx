import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./Components/Login";
import Home from "./Pages/Home";

export default function App() {
  return (
    <div className="">
      <ToastContainer />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
}
