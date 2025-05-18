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

// Define validation schema using Yup
const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "First name is too short")
    .max(50, "First name is too long")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name is too short")
    .max(50, "Last name is too long")
    .required("Last name is required"),
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    //  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
});

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async (
    values: any,
    { setSubmitting, setStatus }: any
  ) => {
    setStatus(null);

    try {
      // Prepare data for API
      const userData = {
        firstname: values.firstName,
        lastname: values.lastName,
        email: values.email,
        password: values.password,
      };

      // Send signup request to external backend
      const response = await authAPI.signUp(userData);

      console.log("Signup successful:", response.data);

      // Store authentication data if the API returns a token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Optionally store user info if it's returned
        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
      }

      // Redirect to profile page on successful signup
      router.push("/profile");
    } catch (err: any) {
      console.error("Signup failed:", err);

      // Display appropriate error message
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setStatus(
          err.response.data.message || "Sign up failed. Please try again."
        );
      } else if (err.request) {
        // The request was made but no response was received
        setStatus(
          "No response from server. Please check your connection and try again."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setStatus("An error occurred during sign up. Please try again.");
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
                Sign Up
              </CardTitle>
              <CardDescription className="text-center">
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                }}
                validationSchema={SignupSchema}
                onSubmit={handleSignUp}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Field
                          as={Input}
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          autoComplete="off"
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Field
                          as={Input}
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          autoComplete="off"
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                    </div>
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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Signing up..." : "Sign Up"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
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
