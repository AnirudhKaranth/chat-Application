import { BrowserRouter, Route, Routes } from "react-router-dom";

import Auth from "./components/Auth";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
 

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/chat" element={<ProtectedRoute > <Home /></ProtectedRoute> }/>
      <Route path="/" element={<Auth/>}/>
    </Routes>

      
    </BrowserRouter>
  )
}

export default App
