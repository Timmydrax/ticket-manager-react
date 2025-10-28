"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

export default function EditTicketPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "open",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const sessionData = localStorage.getItem("ticketapp_session");
    if (!sessionData) {
      navigate("/auth/login");
      return;
    }

    // Load ticket from localStorage
    const ticketsData = localStorage.getItem("tickets");
    if (ticketsData) {
      const tickets = JSON.parse(ticketsData);
      const foundTicket = tickets.find((t: Ticket) => t.id === id);
      if (foundTicket) {
        setTicket(foundTicket);
        setFormData({
          title: foundTicket.title,
          description: foundTicket.description,
          status: foundTicket.status,
        });
      }
    }
    setIsLoading(false);
  }, [id, navigate]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const ticketsData = localStorage.getItem("tickets");
    if (ticketsData) {
      const tickets = JSON.parse(ticketsData);
      const updatedTickets = tickets.map((t: Ticket) =>
        t.id === id
          ? {
              ...t,
              title: formData.title,
              description: formData.description,
              status: formData.status,
            }
          : t
      );
      localStorage.setItem("tickets", JSON.stringify(updatedTickets));

      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });

      navigate("/tickets");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Ticket not found</p>
          <Link to="/tickets">
            <Button>Back to Tickets</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">
            Ticket Manager
          </h1>
          <Link to="/tickets">
            <Button variant="outline">Back to Tickets</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="p-8">
          <h2 className="text-3xl font-bold mb-6">Edit Ticket</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                <p className="text-sm text-destructive mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                placeholder="Ticket description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={6}
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
                <p className="text-sm text-destructive mt-1">{errors.status}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Link to="/tickets" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
