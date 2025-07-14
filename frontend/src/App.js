import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostDetail from "./pages/PostDetail";
import About from "./pages/About";
import './App.css';
import SignUp from "./pages/SignUp";

function App() {
    return (
        <Router>
            <Header />
            <main className="main-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
