"use client";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Session {
  email: string;
  name?: string;
  token: string;
}

interface Ticket {
  id: string;
  title: string;
  status: "open" | "in_progress" | "closed";
  description?: string;
  priority?: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionData = localStorage.getItem("ticketapp_session");
    if (!sessionData) {
      navigate("/auth/login");
      return;
    }

    try {
      const parsed = JSON.parse(sessionData);
      setSession(parsed);

      // Load tickets to calculate stats
      const ticketsData = localStorage.getItem("tickets");
      if (ticketsData) {
        const tickets: Ticket[] = JSON.parse(ticketsData);

        const total = tickets.length;
        const open = tickets.filter((t) => t.status === "open").length;
        const inProgress = tickets.filter(
          (t) => t.status === "in_progress"
        ).length;
        const closed = tickets.filter((t) => t.status === "closed").length;
        setStats({ total, open, inProgress, closed });
      }
    } catch (error) {
      console.error(`${error}`);
      navigate("/auth/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ticketapp_session");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            HNG Ticket Manager
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {session.name || session.email}!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">
              Total Tickets
            </div>
            <div className="text-4xl font-bold">{stats.total}</div>
          </Card>
          <Card className="p-6 border-l-4 border-l-[var(--status-open)]">
            <div className="text-sm text-muted-foreground mb-2">Open</div>
            <div className="text-4xl font-bold text-[var(--status-open)]">
              {stats.open}
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-[var(--status-in-progress)]">
            <div className="text-sm text-muted-foreground mb-2">
              In Progress
            </div>
            <div className="text-4xl font-bold text-[var(--status-in-progress)]">
              {stats.inProgress}
            </div>
          </Card>
          <Card className="p-6 border-l-4 border-l-[var(--status-closed)]">
            <div className="text-sm text-muted-foreground mb-2">Closed</div>
            <div className="text-4xl font-bold text-[var(--status-closed)]">
              {stats.closed}
            </div>
          </Card>
        </div>

        {/* Action Card */}
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to manage your tickets?
          </h3>
          <p className="text-muted-foreground mb-6">
            Create, view, edit, and delete tickets to keep your workflow
            organized.
          </p>
          <Link to="/tickets">
            <Button size="lg">Go to Ticket Management</Button>
          </Link>
        </Card>
      </main>
    </div>
  );
}
