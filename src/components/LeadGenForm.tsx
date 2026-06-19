import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty({ message: "Please enter your name" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email" })
    .max(255, { message: "Email must be less than 255 characters" }),
  company: z
    .string()
    .trim()
    .max(150, { message: "Company name must be less than 150 characters" })
    .optional(),
});

interface LeadGenFormProps {
  onComplete: () => void;
}

const LeadGenForm = ({ onComplete }: LeadGenFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = leadSchema.safeParse({ name, email, company });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company || null,
      });

      if (error) {
        toast.error("Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      onComplete();
    } catch {
      toast.error("Failed to connect. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <img src="/logo.png" alt="Scale & Clarity OS" className="h-12 w-auto object-contain" />
        </div>

        <div className="text-center space-y-3">
          <p className="text-xs font-display uppercase tracking-[0.3em] text-primary">
            One last step
          </p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Your reflection is ready
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
            Share a few details and your personalized reflection will appear.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="lead-name">Name</Label>
            <Input
              id="lead-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              maxLength={100}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-email">Email</Label>
            <Input
              id="lead-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              maxLength={255}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lead-company">Company / Business</Label>
            <Input
              id="lead-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your business name"
              maxLength={150}
              autoComplete="organization"
            />
          </div>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full py-6 text-base"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Loading your reflection...
              </>
            ) : (
              "View My Reflection"
            )}
          </Button>

          <p className="text-xs text-muted-foreground/60 text-center leading-relaxed">
            Your details are kept private and used only to share your reflection.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LeadGenForm;
