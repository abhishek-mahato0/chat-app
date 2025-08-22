import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// GraphQL mutation
const REGISTER_MUTATION = gql`
  mutation createUser(
    $fullname: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      fullname: $fullname
      username: $username
      email: $email
      password: $password
    ) {
      token
      user {
        id
        fullname
        username
        email
      }
    }
  }
`;

// Zod schema
const registerSchema = z.object({
  fullname: z.string().min(3, "Full name must be at least 3 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface RegisterFormData {
  fullname: string;
  username: string;
  email: string;
  password: string;
}

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

  const [register, { loading, error: serverError }] = useMutation(REGISTER_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field error on change
  };

  const handleRegister = async () => {
    try {
      // Validate using Zod
      const validated = registerSchema.parse(formData);

      const { data } = await register({ variables: validated });

      if (data?.createUser?.token) {
        localStorage.setItem("token", data.createUser.token);
        localStorage.setItem("userId", data.createUser.user.id);
        navigate("/chat");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Map Zod errors to our state
        const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        err.issues.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0] as keyof RegisterFormData] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Registration error:", err);
      }
    }
  };

  const inputs = [
    { name: "fullname", placeholder: "Full name", type: "text" },
    { name: "username", placeholder: "Username", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111418] p-5">
      <div className="w-full max-w-md rounded-lg bg-[#1b1f26] p-8">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Create your account
        </h2>

        <div className="space-y-4">
          {inputs.map((input) => (
            <div className="flex flex-col gap-1" key={input.name}>
              <Label className="text-white">{input.placeholder}</Label>
              <Input
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                value={formData[input.name as keyof RegisterFormData] || ""}
                onChange={handleChange}
                className="bg-[#283039] text-white placeholder:text-[#9caaba] border-none focus:ring-0 focus:outline-none h-14"
              />
              {errors[input.name as keyof RegisterFormData] && (
                <span className="text-red-400 text-sm">
                  {errors[input.name as keyof RegisterFormData]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#0b78f4] hover:bg-[#0960c0] text-white h-12"
          >
            {loading ? "Registering..." : "Sign up"}
          </Button>
        </div>

        {serverError && (
          <p className="text-red-400 mt-3 text-center">{serverError.message}</p>
        )}

        <p className="text-[#9caaba] text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0b78f4] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
