"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  image: z
    .custom<FileList>((value) => value instanceof FileList, {
      message: "Image is required.",
    })
    .refine((files) => files.length > 0, "Please upload an image.")
    .refine(
      (files) => files[0]?.type.startsWith("image/"),
      "File must be an image."
    ),
  context: z
    .string()
    .min(1, "Context is required.")
    .max(100, "Context must be 100 characters or less."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SnapPhoto({ isMobile }: { isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // TODO: Make POST call to API
    console.log(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <div className="flex flex-col items-center space-y-1 text-foreground cursor-pointer hover:text-primary">
            <Camera size={14} />
            <span className="text-xs">Snap Photo</span>
          </div>
        ) : (
          <Button className="flex items-center">
            <Camera size={16} className="mr-2" />
            <span>Snap Photo</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Take a Photo or Upload One</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormLabel>Upload Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="context"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter image context"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Create Scenario</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
