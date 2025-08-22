import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// GraphQL mutation to create a user
const REGISTER_MUTATION = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const Register = () => {
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Apollo mutation hook
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);

  const handleRegister = async () => {
    try {
      const { data } = await register({
        variables: { firstName, lastName, email, password },
      });

      if (data?.createUser?.token) {
        console.log(data?.createUser);
        // Save token and userId locally
        localStorage.setItem("token", data.createUser.token);
        localStorage.setItem("userId", data.createUser.user.id);
        navigate("/chat"); // redirect to chat page
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Register</h1>
      <input
        className="border p-2 mb-2"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="border p-2 mb-2"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
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
      <button
        onClick={handleRegister}
        className="bg-green-500 text-white p-2"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </div>
  );
};
