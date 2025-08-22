// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "./ApolloClient";
import { Login } from "./components/login";
import { Register } from "./components/register";
import { ChatPage } from "./components/ChatPage";
import Dashboard from "./components/Pages/Dashboard";
import ProfilePage from "./components/Pages/Profile";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}
