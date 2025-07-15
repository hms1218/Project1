import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PostDetail from "./pages/board/PostDetail";
import About from "./pages/About";
import './App.css';
import SignUp from "./pages/sign/SignUp";
import SignIn from "./pages/sign/SignIn";
import FindId from "./pages/sign/FindId";
import FindPw from "./pages/sign/FindPw";
import { AuthProvider } from "./context/AuthContext";
import ResetPassword from "./pages/sign/ResetPassword";
import MyPage from "./pages/MyPage";
import Board from "./pages/board/Board";
import PostWrite from "./pages/board/PostWrite";
import PostEdit from "./pages/board/PostEdit";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <main className="main-container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/find-id" element={<FindId />} />
                        <Route path="/find-pw" element={<FindPw />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/board" element={<Board />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/write" element={<PostWrite />} />
                        <Route path="/post/:id/edit" element={<PostEdit />} />
                        <Route path="/mypage" element={<MyPage />} />                      
                    </Routes>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
