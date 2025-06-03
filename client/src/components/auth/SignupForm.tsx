import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

    useAuthRedirect();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    role: "", // 'tailor' or 'customer'
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // <-- Add this line

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function checkExists(field: "email" | "username", value: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/verify`, {
        params: { [field]: value },
      });
      return response.data.exists;
    } catch (err) {
      console.error("Failed to check existence", err);
      return false;
    }
  }

  const validateStepFields = () => {
    if (step === 1) {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("Please fill all the fields.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
    }
    if (step === 2) {
      if (!formData.username.trim()) {
        setError("Please enter a username.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.role) {
        setError("Please select a role.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = async () => {
    setError("");
    setSuccess("");

    if (!validateStepFields()) {
      return;
    }

    if (step === 1) {
      const exists = await checkExists("email", formData.email);
      if (exists) {
        setError("Email already exists. Please use a different email.");
        return;
      }
    }
    if (step === 2) {
      const exists = await checkExists("username", formData.username);
      if (exists) {
        setError("Username already exists. Please choose another.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateStepFields()) {
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        username: formData.username,
        role: formData.role,
      });

      if (response.status === 201) {
        setSuccess("Signup successful! Redirecting...");
        setTimeout(() => {
          navigate("/"); // <-- Redirect to login after signup
        }, 100);
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {step === 1 && "Create an account"}
          {step === 2 && "Choose your username"}
          {step === 3 && "What are you here to do?"}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {step === 1 && "Enter your details to get started"}
          {step === 2 && "Pick a unique username"}
          {step === 3 && "Select your role"}
        </p>
      </div>

      <div className="grid gap-6">
        {step === 1 && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {(error || success) && (
              <p
                className={`text-sm ${
                  error ? "text-red-500" : "text-green-600"
                }`}
              >
                {error || success}
              </p>
            )}
            <Button type="button" className="w-full" onClick={handleNext}>
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            {(error || success) && (
              <p
                className={`text-sm ${
                  error ? "text-red-500" : "text-green-600"
                }`}
              >
                {error || success}
              </p>
            )}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="grid gap-4">
              <Button
                type="button"
                variant={formData.role === "tailor" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, role: "tailor" })}
              >
                I'm a Tailor
              </Button>
              <Button
                type="button"
                variant={formData.role === "customer" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, role: "customer" })}
              >
                I'm a Customer
              </Button>
            </div>
            {(error || success) && (
              <p
                className={`text-sm ${
                  error ? "text-red-500" : "text-green-600"
                }`}
              >
                {error || success}
              </p>
            )}
            <div className="flex gap-4 mt-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" disabled={!formData.role}>
                Sign Up
              </Button>
            </div>
          </>
        )}
      </div>

      {step > 1 && (
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      )}
    </form>
  );
}
