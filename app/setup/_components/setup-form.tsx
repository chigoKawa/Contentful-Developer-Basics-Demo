/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { useState } from "react";
import { seedTheSpace } from "../_lib/seeder";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";

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

// env variables code string
const codeString = `NEXT_PUBLIC_CTF_SPACE_ID='your-space-id'
NEXT_PUBLIC_CTF_DELIVERY_TOKEN='your-delivery-access-token'
NEXT_PUBLIC_CTF_PREVIEW_TOKEN='your-preview-access-token'
NEXT_PUBLIC_CTF_PREVIEW_SECRET='a-preview-secret'
NEXT_PUBLIC_CTF_ENVIRONMENT='your-space-environment'
CONTENTFUL_PREVIEW_SECRET='a-preview-secret'
NEXT_PUBLIC_CTF_STUDIO_EXPERIENCE_TYPE_ID="experiencePage"
NEXT_PUBLIC_CTF_HOMEPAGE_SLUG="home"`;

const VERCE_DEPLOY_LINK = `https://vercel.com/new/clone?repository-url=https://github.com/chigoKawa/Contentful-Developer-Basics-Demo&env=NEXT_PUBLIC_CTF_SPACE_ID,NEXT_PUBLIC_CTF_DELIVERY_TOKEN,NEXT_PUBLIC_CTF_PREVIEW_TOKEN,NEXT_PUBLIC_CTF_PREVIEW_SECRET,NEXT_PUBLIC_CTF_ENVIRONMENT`;

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
  const [copiedText, setCopiedText] = useState(false);

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

  const handleCopyText = () => {
    navigator.clipboard
      .writeText(codeString)
      .then(() => {
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000); // Reset the "copied" state after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center  w-full ">
      <div className="max-w-lg  mx-auto p-6  space-y-6">
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Getting Started
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {` To use this project, you'll need to install its content model into
          your Contentful space. This ensures the code works seamlessly with
          your content types and allows you to customize the provided dummy
          content. Simply copy your Contentful Space ID and Management Token,
          enter them into the form, and click "Seed Space" to get started.`}
        </p>
        <div className="space-y-2">
          <div className="mt-10 w-full p-2 flex items-center justify-centerx m-auto">
            {" "}
            <Bean size={70} />
          </div>
          <h2 className=" scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Seed Space
          </h2>

          <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
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
        <div className="flex flex-col gap-2">
          <div className="mt-10 border-y py-4 flex justify-between items-center">
            <h2 className="scroll-m-20   text-3xl font-semibold tracking-tight transition-colors first:mt-0">
              Set up in Vercel
            </h2>
            <a href={`${VERCE_DEPLOY_LINK}`} target="_blank">
              <img src="https://vercel.com/button" alt="Deploy with Vercel" />
            </a>
          </div>

          <p className="">
            To get your project up and running in Vercel, follow these steps:
          </p>
          <ol className="">
            <li className="px-2 leading-7 mt-2 ">
              1. Make sure you have your Contentful <strong>Space ID</strong>{" "}
              and <strong>Delivery Access Token</strong> handy.
            </li>
            <li className="px-2 leading-7 mt-2 ">
              2. Click the button below to deploy your project on Vercel with a
              single click.
            </li>
            <li className="px-2 leading-7 mt-2 ">
              {`3. You can copy the environment variables below and configure them
            in Vercel's environment settings:`}
            </li>
          </ol>

          <a href={`${VERCE_DEPLOY_LINK}`} className="py-4" target="_blank">
            <img src="https://vercel.com/button" alt="Deploy with Vercel" />
          </a>

          <div className="relative">
            <Card className="p-6 shadow-lg bg-black/20  w-full">
              <SyntaxHighlighter
                className="mt-6"
                language="javascript"
                style={docco}
              >
                {codeString}
              </SyntaxHighlighter>

              <Button
                onClick={handleCopyText}
                variant="secondary"
                className="absolute top-2 right-6 text-white bg-gray-600 hover:bg-gray-500"
                size="sm"
                aria-label="Copy code to clipboard"
              >
                <Copy size={16} />
                {copiedText ? " Copied!" : " Copy"}
              </Button>
            </Card>
          </div>
        </div>

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
