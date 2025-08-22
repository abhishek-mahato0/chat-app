import { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// GraphQL query
const LOGIN_QUERY = gql`
  query getUserByEmailAndPassword($email: String!, $password: String!) {
    getUserByEmailAndPassword(email: $email, password: $password) {
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
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

  const [login, { loading, error: serverError }] = useLazyQuery(LOGIN_QUERY);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field error on change
  };

  const handleLogin = async () => {
    try {
      const validated = loginSchema.parse(formData);

      const { data } = await login({ variables: validated });

      if (data?.getUserByEmailAndPassword?.token) {
        localStorage.setItem("token", data.getUserByEmailAndPassword.token);
        localStorage.setItem(
          "user",
          JSON.stringify(data.getUserByEmailAndPassword.user)
        );
        localStorage.setItem("userId", data.getUserByEmailAndPassword.user.id);
        navigate("/chat");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
        err.issues.forEach((e) => {
          if (e.path[0]) fieldErrors[e.path[0] as keyof LoginFormData] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error("Login error:", err);
      }
    }
  };

  const inputs = [
    { name: "email", placeholder: "Email", type: "email" },
    { name: "password", placeholder: "Password", type: "password" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111418] p-5">
      <div className="w-full max-w-md rounded-lg bg-[#1b1f26] p-8">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <div className="space-y-4">
          {inputs.map((input) => (
            <div className="flex flex-col gap-1" key={input.name}>
              <Label className="text-white">{input.placeholder}</Label>
              <Input
                name={input.name}
                type={input.type}
                placeholder={input.placeholder}
                value={formData[input.name as keyof LoginFormData] || ""}
                onChange={handleChange}
                className="bg-[#283039] text-white placeholder:text-[#9caaba] border-none focus:ring-0 focus:outline-none h-14"
              />
              {errors[input.name as keyof LoginFormData] && (
                <span className="text-red-400 text-sm">
                  {errors[input.name as keyof LoginFormData]}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#0b78f4] hover:bg-[#0960c0] text-white h-12"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        {serverError && (
          <p className="text-red-400 mt-3 text-center">{serverError.message}</p>
        )}

        <p className="text-[#9caaba] text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#0b78f4] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};
