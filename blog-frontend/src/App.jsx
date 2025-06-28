import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BlogProvider } from "./context/BlogContext";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

function App() {
  return (
    <BlogProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create" element={<CreatePost />} />
              <Route path="/admin/edit/:slug" element={<EditPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BlogProvider>
  );
}

export default App;
