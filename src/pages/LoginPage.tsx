
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { ScrollingHeadline } from "@/components/landing/ScrollingHeadline";
import { TestimonialCarousel } from "@/components/landing/TestimonialCarousel";
import { SocialPlatformIcons } from "@/components/landing/SocialPlatformIcons";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const headlines = [
  "Finally, replies that feel like you.",
  "Your comment section, without the cringe.",
  "Set your tone. Let Driply handle the rest.",
  "Never ghost your audience again.",
  "Real replies. Real tone. Zero burnout.",
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    setIsLoading(false);
    
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Scrolling Headline */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-primary mb-4">Driply</h1>
          <ScrollingHeadline headlines={headlines} />
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            The AI-powered comment management tool trusted by the world's top creators
          </p>
          <SocialPlatformIcons />
        </div>
      </div>

      {/* Login Form */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white py-8 px-6 shadow-md rounded-lg sm:px-10">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80"
              >
                create a new account
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-primary hover:text-primary/80"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">
            Trusted by the world's leading creators
          </h2>
          <TestimonialCarousel />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 Driply. All rights reserved.</p>
          <div className="mt-4">
            <a href="#" className="text-primary hover:text-primary/80 mx-2">Privacy Policy</a>
            <a href="#" className="text-primary hover:text-primary/80 mx-2">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
