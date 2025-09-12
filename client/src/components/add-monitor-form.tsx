"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { PlusCircleIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { IMonitorFormData } from "../types";
import { cn } from "@/lib/utils";

// Zod schema for form validation
const monitorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL format"),
  interval: z.string().min(1, "Interval is required")
});

const AddMonitorForm = ({
  style = "default"
}: {
  style?: "default" | "ghost";
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={style}
          className={cn(
            style === "ghost"
              ? "w-full justify-start p-2 font-normal hover:bg-primary/50"
              : ""
          )}
        >
          {style !== "ghost" && <PlusCircleIcon className="mr-2 h-4 w-4" />}
          Add Monitor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add New Monitor
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Fill in the details below to add a new monitor.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <MonitorForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const MonitorForm = React.memo(({ onSuccess }: { onSuccess: () => void }) => {
  const { getToken } = useAuth();
  const form = useForm<IMonitorFormData>({
    resolver: zodResolver(monitorFormSchema),
    defaultValues: {
      name: "",
      url: "",
      interval: "*/10 * * * *"
    }
  });

  const {
    formState: { errors, isSubmitting }
  } = form;

  const onSubmit = async (data: IMonitorFormData) => {
    try {
      const token = await getToken();
      await api.post("/monitors", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Monitor added successfully!");
      onSuccess();
    } catch (error) {
      toast.error("Failed to add monitor. Please try again.");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Website"
                  {...field}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                />
              </FormControl>
              <FormDescription>
                A descriptive name for your monitor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.url}
                />
              </FormControl>
              <FormDescription>
                The URL that you want to monitor.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interval"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check Interval</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Interval</SelectLabel>
                    <SelectItem value="*/10 * * * *">
                      Every 10 minutes
                    </SelectItem>
                    <SelectItem value="*/15 * * * *">
                      Every 15 minutes
                    </SelectItem>
                    <SelectItem value="*/30 * * * *">
                      Every 30 minutes
                    </SelectItem>
                    <SelectItem value="0 * * * *">Every hour</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>How often to check the URL.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Adding..." : "Add Monitor"}
        </Button>
      </form>
    </Form>
  );
});

MonitorForm.displayName = "MonitorForm";

export default AddMonitorForm;
