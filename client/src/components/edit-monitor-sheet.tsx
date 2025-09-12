"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { IMonitor, IMonitorFormData } from "@/types";
import { useMonitorStore } from "@/store/monitor-store";

const monitorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL format"),
  interval: z.string().min(1, "Interval is required")
});

const EditMonitorSheet = ({ monitor }: { monitor: IMonitor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>Edit Monitor</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Monitor</SheetTitle>
          <SheetDescription>
            Update the details of your monitor below.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        <MonitorForm monitor={monitor} onSuccess={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  );
};

const MonitorForm = ({
  monitor,
  onSuccess
}: {
  monitor: IMonitor;
  onSuccess: () => void;
}) => {
  const { getToken } = useAuth();
  const { updateMonitor } = useMonitorStore();
  const form = useForm<IMonitorFormData>({
    resolver: zodResolver(monitorFormSchema),
    defaultValues: {
      name: monitor.name,
      url: monitor.url,
      interval: monitor.interval
    }
  });

  useEffect(() => {
    form.reset({
      name: monitor.name,
      url: monitor.url,
      interval: monitor.interval
    });
  }, [monitor, form]);

  const {
    formState: { isSubmitting }
  } = form;

  const onSubmit = async (data: IMonitorFormData) => {
    const token = await getToken();
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }
    await updateMonitor(monitor.id, data, token);
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Website" {...field} />
              </FormControl>
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
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
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
              <Select onValueChange={field.onChange} value={field.value}>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditMonitorSheet;
