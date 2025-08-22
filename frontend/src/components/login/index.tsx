// src/pages/Login.tsx
import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LOGIN_QUERY = gql`
  query getUserByEmailAndPassword($email: String!, $password: String!) {
    getUserByEmailAndPassword(email: $email, password: $password) {
      token
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, error }] = useLazyQuery(LOGIN_QUERY);

  const handleLogin = async () => {
    await login({ variables: { email, password } });
    if (data?.getUserByEmailAndPassword?.token) {
      localStorage.setItem("token", data.getUserByEmailAndPassword.token);
      localStorage.setItem("user", data.getUserByEmailAndPassword.user);
      localStorage.setItem("userId", data.getUserByEmailAndPassword.user.id)
      navigate("/chat");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        className="border p-2 mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2" onClick={handleLogin}>
        Login
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};
