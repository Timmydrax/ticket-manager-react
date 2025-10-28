"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
}

export default function TicketsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const sessionData = localStorage.getItem("ticketapp_session");
    if (!sessionData) {
      navigate("/auth/login");
      return;
    }

    // Load tickets from localStorage
    const ticketsData = localStorage.getItem("tickets");
    if (ticketsData) {
      setTickets(JSON.parse(ticketsData));
    }
    setIsLoading(false);
  }, [navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!["open", "in_progress", "closed"].includes(formData.status)) {
      newErrors.status = "Invalid status";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newTicket: Ticket = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status as "open" | "in_progress" | "closed",
      createdAt: new Date().toISOString(),
    };

    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));

    toast({
      title: "Success",
      description: "Ticket created successfully",
    });

    setFormData({ title: "", description: "", status: "open" });
    setShowForm(false);
  };

  const handleDeleteTicket = (id: string) => {
    const updatedTickets = tickets.filter((t) => t.id !== id);
    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));

    toast({
      title: "Success",
      description: "Ticket deleted successfully",
    });

    setDeleteConfirm(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-[var(--status-open)]/10 text-[var(--status-open)]";
      case "in_progress":
        return "bg-[var(--status-in-progress)]/10 text-[var(--status-in-progress)]";
      case "closed":
        return "bg-[var(--status-closed)]/10 text-[var(--status-closed)]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    return (
      status.replace("_", " ").charAt(0).toUpperCase() +
      status.replace("_", " ").slice(1)
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Ticket Manager</h1>
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tickets</h2>
            <p className="text-muted-foreground">
              Manage all your tickets in one place
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Create Ticket"}
          </Button>
        </div>

        {/* Create Ticket Form */}
        {showForm && (
          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Create New Ticket</h3>
            <form onSubmit={handleAddTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  type="text"
                  placeholder="Ticket title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Ticket description (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                {errors.status && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.status}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Ticket
              </Button>
            </form>
          </Card>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No tickets yet. Create one to get started!
              </p>
              <Button onClick={() => setShowForm(true)}>
                Create First Ticket
              </Button>
            </Card>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {ticket.title}
                    </h3>
                    {ticket.description && (
                      <p className="text-muted-foreground mb-3">
                        {ticket.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {getStatusLabel(ticket.status)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/tickets/${ticket.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteConfirm(ticket.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deleteConfirm === ticket.id && (
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm mb-3">
                      Are you sure you want to delete this ticket?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTicket(ticket.id)}
                      >
                        Confirm Delete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
