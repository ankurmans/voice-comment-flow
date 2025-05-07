
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const aiSettingsFormSchema = z.object({
  model: z.string().default("gpt-4"),
  temperature: z.string().default("0.7"),
  maxTokens: z.string().default("250"),
  autoApprove: z.boolean().default(false),
  autoApproveThreshold: z.string().default("0.9"),
});

type AISettingsFormValues = z.infer<typeof aiSettingsFormSchema>;

export function AISettings() {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm<AISettingsFormValues>({
    resolver: zodResolver(aiSettingsFormSchema),
    defaultValues: {
      model: "gpt-4",
      temperature: "0.7",
      maxTokens: "250",
      autoApprove: false,
      autoApproveThreshold: "0.9",
    },
  });

  const onSubmit = async (values: AISettingsFormValues) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
    toast({
      title: "AI settings updated",
      description: "Your AI configuration has been saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
        <CardDescription>
          Configure how the AI generates replies to comments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an AI model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (Higher Quality)</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini (Balanced)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the AI model that will generate your replies
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="1" step="0.1" />
                    </FormControl>
                    <FormDescription>
                      Controls randomness: 0 is focused, 1 is creative (0.7 recommended)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Response Length</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="50" max="500" />
                    </FormControl>
                    <FormDescription>
                      Maximum length of generated replies (250 recommended)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="autoApprove"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Auto-Approve Replies
                    </FormLabel>
                    <FormDescription>
                      Automatically post high-confidence AI replies
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("autoApprove") && (
              <FormField
                control={form.control}
                name="autoApproveThreshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto-Approve Confidence Threshold</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" max="1" step="0.1" />
                    </FormControl>
                    <FormDescription>
                      Only auto-approve replies with this confidence level or higher (0.9 recommended)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
