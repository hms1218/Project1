import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostDetail from "./pages/PostDetail";
import About from "./pages/About";
import './App.css';
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import FindId from "./pages/FindId";
import FindPw from "./pages/FindPw";
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <main className="main-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/find-id" element={<FindId />} />
                        <Route path="/find-pw" element={<FindPw />} />
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
