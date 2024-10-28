"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
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
import { generateLlama3 } from "@/services/llamaServices";
import { formatPrompt } from "@/ultis/formatPrompt";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  introduction: z.string().min(10, {
    message: "Introduction must be at least 10 characters long",
  }),
});

export const CurriculumForm = () => {
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      introduction: "",
    },
  });

  async function onSubmit({ introduction }: z.infer<typeof FormSchema>) {
    setLoading(true);

    try {
      const formatedPrompt = formatPrompt(introduction);

      const data = await generateLlama3(formatedPrompt);

      setCurriculum(data);
    } catch (error) {
      console.log("Error: ", error);
      toast({ variant: "destructive", title: "Failed to generate curriculum" });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="introduction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introduction</FormLabel>
              <FormControl>
                <Input placeholder="about me..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting || loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate
        </Button>

        {curriculum && (
          <section className={cn("flex flex-col gap-4")}>
            <p className={cn("whitespace-pre-wrap")}>{curriculum}</p>
          </section>
        )}
      </form>
    </Form>
  );
};
