import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            HNG Ticket Manager
          </h1>
          <div className="flex gap-4">
            <Link to="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="wave-bg text-white py-20 relative flex-1">
        <div className="absolute top-10 right-20 circle-decoration circle-lg bg-white"></div>
        <div className="absolute bottom-20 left-10 circle-decoration circle-md bg-white"></div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6 text-balance">
            Manage Your Tickets Efficiently
          </h2>
          <p className="text-xl mb-8 text-white/90 text-balance">
            A simple, powerful ticket management system to track, organize, and
            resolve issues with ease.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth/signup">
              <Button size="lg" variant="secondary">
                Start Free
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white/10 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Create Tickets</h4>
              <p className="text-muted-foreground">
                Easily create and organize tickets with titles, descriptions,
                and status tracking.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Track Progress</h4>
              <p className="text-muted-foreground">
                Monitor ticket status from open to in-progress to closed with
                real-time updates.
              </p>
            </Card>
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">View Statistics</h4>
              <p className="text-muted-foreground">
                Get insights into your ticket workflow with comprehensive
                statistics and metrics.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 HNG Ticket Manager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
