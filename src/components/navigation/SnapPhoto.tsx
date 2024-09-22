"use client";

import { Button, LoadingButton } from "@/components/ui/button";
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
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FetchScenariosContext } from "../dashboard/Home";

const formSchema = z.object({
  name: z.string().max(150, "Max 150 characters"),
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

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export default function SnapPhoto({ isMobile }: { isMobile: boolean }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("SpeakEasyUser") as string);
  const user_id = user["uid"];
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      context: "",
    },
  });
  const fetchScenarios = useContext(FetchScenariosContext);

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();

    formData.append("user_id", user_id);
    formData.append("name", data.name);
    formData.append("image", data.image[0]);
    formData.append("context", data.context);

    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/v1/scenarios/`, {
        method: "POST",
        body: formData,
      });
      await response.json(); // wait for backend to return
    } catch (error) {
      console.error("Error:", error);
    }
    fetchScenarios();
    setOpen(false);
    setIsLoading(false);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Context</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name for scenario" {...field} />
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
              <LoadingButton type="submit" loading={isLoading}>
                Create Scenario
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
