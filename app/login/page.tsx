"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { authAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";
import { setTokenCookies } from "@/lib/setCookies";

// Define validation schema using Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (
    values: any,
    { setSubmitting, setStatus }: any
  ) => {
    setStatus(null);

    try {
      // Prepare data for API
      const userData = {
        email: values.email,
        password: values.password,
      };

      // Send login request to external backend
      const response = await authAPI.login(userData);

      // Store authentication data if the API returns a token
      if (response.data.token.accessToken) {
        localStorage.setItem("token", response.data.token.accessToken);
        await setTokenCookies(response.data.token.accessToken);

        const { data } = await authAPI.authMe();

        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
        }

        const roleName = data.role?.name?.toLowerCase().trim();

        if (roleName === "user") {
          router.push("/profile");
        } else if (roleName === "admin") {
          router.push("/admin");
        } else if (roleName === "editor") {
          console.log("routing to ewditor ");

          router.push("/admin");
        } else {
          // Handle any other roles or fallback
          router.push("/");
        }
      }
    } catch (err: any) {
      console.log("Login failed:", err);

      // Display appropriate error message
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setStatus(
          err.response.data.message || "Login failed. Please try again."
        );
      } else if (err.request) {
        // The request was made but no response was received
        setStatus(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setStatus("An error occurred during login. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Quizly</h1>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Log In
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                validationSchema={LoginSchema}
                onSubmit={handleLogin}
                // Disable browser validation
                validateOnChange={true}
                validateOnBlur={true}
              >
                {({ isSubmitting, status, errors, touched }) => (
                  <Form className="space-y-4" noValidate>
                    {status && (
                      <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
                        {status}
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        as={Input}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div className="flex items-center justify-end">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Log In"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="bg-muted/30 border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Quizly</span>
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Quizly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
