/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useState } from "react";
import { seedTheSpace } from "../_lib/seeder";

import { AlertCircle, Loader2, Bean } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Define the form schema with validation
const formSchema = z.object({
  space_id: z.string().min(1, "Space ID is required"),
  mgt_access_token: z.string().min(1, "Management token is required"),
  env_id: z.string().min(1, "Environment ID is required"),
});

type FormValues = z.infer<typeof formSchema>;

// This function would be your actual API call

const SetupForm = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      space_id: "",
      mgt_access_token: "",
      env_id: "",
    },
  });

  // Handle form submission

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = (values: FormValues) => {
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  // Handle the actual submission after confirmation
  const handleConfirmedSubmit = async () => {
    setShowConfirmDialog(false);
    setIsProcessing(true);
    setErrorMsg("");
    setErrorMsgs([]);
    setHasError(false);

    try {
      const result: any = await seedTheSpace({
        spaceId: form.getValues("space_id"),
        managementToken: form.getValues("mgt_access_token"),
        envId: form.getValues("env_id"),
      });

      setHasError(result?.hasError || false);
      setErrorMsgs(result?.messages || []);

      setErrorMsg(result?.message || "");

      if (!result?.hasError) {
        toast("Space has been seeded successfully.");
      }
    } catch (err: any) {
      setHasError(true);
      setErrorMsg(err.message || "An unexpected error occurred");

      toast("Failed to seed the space. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center  w-full ">
      <div className="max-w-md  mx-auto p-6 py-20x space-y-6">
        <div className="space-y-2">
          <div className="w-full p-2 flex items-center justify-centerx m-auto">
            {" "}
            <Bean size={70} />
          </div>

          <h2 className="text-2xl font-bold">Seed Space</h2>
          <p className="text-muted-foreground">
            Enter your space details to seed it with initial data.
          </p>
        </div>

        {hasError && (errorMsg || errorMsgs.length > 0) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className=" w-full overflow-auto">
              {errorMsg && <p>{errorMsg}</p>}
              {errorMsgs.length > 0 && (
                <ul className="list-disc pl-5 mt-2">
                  {errorMsgs.map((msg: any, index) => (
                    <li className="" key={index}>
                      {msg?.details?.message}
                    </li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="space_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Space ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter space ID"
                      {...field}
                      disabled={isProcessing}
                    />
                  </FormControl>
                  <FormDescription>
                    The unique identifier for your space.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mgt_access_token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Management Access Token</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter management token"
                      {...field}
                      disabled={isProcessing}
                    />
                  </FormControl>
                  <FormDescription>
                    Your management access token with write permissions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="env_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Environment ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter environment ID"
                      {...field}
                      disabled={isProcessing}
                    />
                  </FormControl>
                  <FormDescription>
                    The environment to seed (e.g., master, development).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Seed Space"
              )}
            </Button>
          </form>
        </Form>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Warning: This action cannot be undone</DialogTitle>
              <DialogDescription>
                This will wipe clean the selected space and replace all content.
                Are you sure you want to proceed?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmedSubmit}>
                Yes, Proceed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SetupForm;
