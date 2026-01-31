"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function WaitlistDialog() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) {
      setEmail("");
      setStatus("idle");
      setErrorMessage("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong");
        return;
      }

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Create market
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a market</DialogTitle>
          <DialogDescription>
            Market creation is coming soon. Join the waitlist and we&apos;ll
            notify you when it&apos;s ready.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="text-center py-4">
            <p className="text-green-500 font-medium mb-1">
              You&apos;re on the list!
            </p>
            <p className="text-sm text-muted-foreground">
              We&apos;ll email you when market creation is live.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
              {status === "error" && (
                <p className="text-xs text-destructive mt-1.5">
                  {errorMessage}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full"
            >
              {status === "loading" ? "Joining..." : "Join waitlist"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
