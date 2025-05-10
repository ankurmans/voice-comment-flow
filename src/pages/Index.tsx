
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SocialPlatformIcons } from "@/components/landing/SocialPlatformIcons";
import { ScrollingHeadline } from "@/components/landing/ScrollingHeadline";

const headlines = [
  "Finally, replies that feel like you.",
  "Your comment section, without the cringe.",
  "Set your tone. Let Driply handle the rest.",
  "Never ghost your audience again.",
  "Real replies. Real tone. Zero burnout.",
];

const features = [
  {
    title: "Everything you are. In one simple AI helper.",
    description: "Upload a few comments or describe your vibe — Driply instantly learns how you speak so every reply sounds authentically you.",
    color: "bg-[#2B3C1B]",
    textColor: "text-[#F9FA8D]",
    buttonColor: "bg-[#F9FA8D] text-[#2B3C1B] hover:bg-[#F9FA8D]/90",
    image: "/icons/train-voice.png",
    buttonText: "Get Started",
    buttonLink: "/register",
  },
  {
    title: "Create and customize your responses in minutes",
    description: "Personalize your brand voice with a few examples. Our AI learns your style instantly across all your social platforms.",
    color: "bg-[#F5D3FC]",
    textColor: "text-[#4A1259]",
    buttonColor: "bg-[#9F3FC7] text-white hover:bg-[#9F3FC7]/90",
    image: "/icons/connect-accounts.png",
    buttonText: "Try Now",
    buttonLink: "/register",
  },
  {
    title: "Share your Driply across Instagram, Twitter and other bios",
    description: "Connect multiple accounts and manage all your comments in one place. No more switching between apps.",
    color: "bg-[#E74C3C]",
    textColor: "text-white",
    buttonColor: "bg-white text-[#E74C3C] hover:bg-white/90",
    image: "/icons/analytics.png",
    buttonText: "Connect Accounts",
    buttonLink: "/register",
  },
  {
    title: "Analyze your audience and keep them engaged",
    description: "Get insights into your engagement metrics, track what replies get the most love, and prove your brand presence.",
    color: "bg-[#F3F3F3]",
    textColor: "text-[#333333]",
    buttonColor: "bg-[#333333] text-white hover:bg-[#333333]/90",
    image: "/icons/analytics.png",
    buttonText: "See Analytics",
    buttonLink: "/register",
  },
];

const socialLogos = [
  {
    name: "HBO",
    image: "/placeholder.svg"
  },
  {
    name: "Comedy Central",
    image: "/placeholder.svg"
  },
  {
    name: "Netflix",
    image: "/placeholder.svg"
  },
  {
    name: "YouTube",
    image: "/placeholder.svg"
  }
];

const questions = [
  {
    question: "How do I set up my brand voice?",
    answer: "Simply upload a few examples of your writing or comments, and our AI will learn your style instantly."
  },
  {
    question: "Which social platforms do you support?",
    answer: "We currently support Instagram, Facebook, YouTube, TikTok, Twitter, and Google Business reviews."
  },
  {
    question: "Can I control what replies are sent?",
    answer: "Absolutely! You can set auto-replies to be reviewed before they're sent, or approve them in batches."
  },
  {
    question: "What makes Driply different from other comment tools?",
    answer: "Driply is specifically designed to maintain your authentic voice, unlike generic AI tools that sound robotic."
  }
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8 text-center" style={{ background: "#2B3C1B" }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#F9FA8D] mb-4">Driply</h1>
          <div className="h-24">
            <ScrollingHeadline headlines={headlines} />
          </div>
          <p className="mt-4 text-lg text-[#F9FA8D]/80 max-w-2xl mx-auto">
            The AI-powered comment management tool trusted by the world's top creators
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link to="/register">
              <Button className="bg-[#F9FA8D] text-[#2B3C1B] hover:bg-[#F9FA8D]/80">
                Get Started Free
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-[#F9FA8D] text-[#F9FA8D] hover:bg-[#F9FA8D]/10">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <img 
              src="/icons/train-voice.png" 
              alt="Driply App Screenshot" 
              className="w-full max-w-md rounded-lg shadow-lg transform rotate-2"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          <SocialPlatformIcons />
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, index) => (
        <section 
          key={index} 
          className={`px-4 py-16 sm:px-6 lg:px-8 ${feature.color} ${feature.textColor}`}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:space-x-10">
            <div className={`md:w-1/2 mb-8 md:mb-0 ${index % 2 === 1 ? 'md:order-last' : ''}`}>
              <h2 className="text-3xl font-bold mb-4">{feature.title}</h2>
              <p className="text-lg mb-6 opacity-90">{feature.description}</p>
              <Link to={feature.buttonLink}>
                <Button className={feature.buttonColor}>
                  {feature.buttonText}
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src={feature.image} 
                alt={feature.title} 
                className="w-full max-w-sm rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
        </section>
      ))}

      {/* Trusted By Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white text-black">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">The only comment AI trusted by 70M+ influencers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
            {socialLogos.map((logo, index) => (
              <div key={index} className="flex items-center justify-center">
                <img 
                  src={logo.image} 
                  alt={logo.name} 
                  className="h-12"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login/Register Card */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="max-w-md mx-auto">
          <Card className="border-none shadow-xl">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold text-center mb-6">Jump into your corner of the internet today</h3>
              <div className="space-y-4">
                <Link to="/register" className="w-full block">
                  <Button className="w-full">Sign Up Free</Button>
                </Link>
                <div className="text-center">
                  <span className="text-sm text-gray-500">Already have an account?</span>
                </div>
                <Link to="/login" className="w-full block">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-[#E74C3C] text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Got questions?</h2>
          <div className="space-y-4">
            {questions.map((item, index) => (
              <Card key={index} className="bg-[#E74C3C]/30 border border-white/20 text-white hover:bg-[#E74C3C]/50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                  <p className="opacity-90">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Driply</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/login" className="hover:underline">Login</Link></li>
              <li><Link to="/register" className="hover:underline">Sign Up</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Brand Voice</a></li>
              <li><a href="#" className="hover:underline">Platforms</a></li>
              <li><a href="#" className="hover:underline">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Contact</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/20 text-center text-sm">
          <p>© 2025 Driply. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
