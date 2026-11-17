"use client";

import { Download, Heart, Plus, Settings, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Dropdown } from "@/components/ui/Dropdown";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

export function DesignShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-10 border-t border-border py-10">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Components</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Shared building blocks with variants, states, and accessible markup.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-subtle-foreground">
          Buttons
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Delete</Button>
          <Button loading>Saving</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add item">
            <Plus className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Form controls</CardTitle>
            <CardDescription>
              Labels, hints, errors, and focus states.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Email address" htmlFor="design-email" hint="We never share your email.">
              <Input
                id="design-email"
                type="email"
                placeholder="you@example.com"
                aria-describedby="design-email-hint"
              />
            </Field>
            <Field label="Category" htmlFor="design-category">
              <Select id="design-category" defaultValue="developer">
                <option value="developer">Developer</option>
                <option value="image">Image &amp; Design</option>
                <option value="student">Student &amp; Education</option>
              </Select>
            </Field>
            <Field
              label="Password"
              htmlFor="design-password"
              error="Use at least 12 characters."
            >
              <Input
                id="design-password"
                type="password"
                defaultValue="short"
                aria-invalid
                aria-describedby="design-password-error"
              />
            </Field>
            <Field label="Message" htmlFor="design-message">
              <Textarea id="design-message" placeholder="Write something..." rows={4} />
            </Field>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
            <Button variant="ghost">Cancel</Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <div className="rounded-card border border-border bg-surface p-5 shadow-soft">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-subtle-foreground">
              Overlays
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                Open modal
              </Button>
              <Dropdown
                label="Options"
                items={[
                  { label: "Download", icon: Download },
                  { label: "Duplicate", icon: Plus },
                  { label: "Settings", icon: Settings },
                  { label: "Remove", icon: Trash2, danger: true },
                ]}
              />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  toast({ title: "Copied to clipboard", variant: "success" })
                }
              >
                Success toast
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "Could not process file",
                    description: "Try a JPG, PNG, or WebP under 20 MB.",
                    variant: "error",
                  })
                }
              >
                Error toast
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  toast({
                    title: "All changes saved",
                    description: "Your document stays on this device.",
                    variant: "info",
                  })
                }
              >
                Info toast
              </Button>
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-5 shadow-soft">
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-subtle-foreground">
              Loading skeletons
            </h3>
            <div className="mt-4 flex items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyState
          title="No tools here yet"
          description="Tools in this category are still being built. Nothing fake will be shown in the meantime."
          icon={Heart}
        />
        <ErrorState
          title="That file is too large"
          description="The maximum upload size is 20 MB. Choose a smaller image and try again."
          action={<Button variant="outline">Choose another file</Button>}
        />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Delete this item?"
        description="This action is a demo. Nothing is actually deleted."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setModalOpen(false);
                toast({ title: "Item deleted", variant: "success" });
              }}
            >
              Delete item
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          A native dialog handles focus trapping, Escape, and backdrop clicks so
          modal interactions stay accessible.
        </p>
      </Modal>
    </div>
  );
}
