
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCheck, Loader2 } from "lucide-react";

const autoReplyFormSchema = z.object({
  enabled: z.boolean().default(false),
  confidenceThreshold: z.string().default("0.8"),
  autoReplyCategories: z.array(z.string()).default([]),
  maxTimeInQueue: z.string().default("60"),
  workingHoursOnly: z.boolean().default(true),
  maxDailyAutoReplies: z.string().default("50"),
});

type AutoReplySettings = z.infer<typeof autoReplyFormSchema>;

interface AutoReplySettingsProps {
  initialSettings?: AutoReplySettings;
  onSave: (settings: AutoReplySettings) => Promise<void>;
}

const AutoReplySettings = ({ initialSettings, onSave }: AutoReplySettingsProps) => {
  const [isUpdating, setIsUpdating] = React.useState(false);

  const form = useForm<AutoReplySettings>({
    resolver: zodResolver(autoReplyFormSchema),
    defaultValues: initialSettings || {
      enabled: false,
      confidenceThreshold: "0.8",
      autoReplyCategories: ["thank_you", "simple_question"],
      maxTimeInQueue: "60",
      workingHoursOnly: true,
      maxDailyAutoReplies: "50",
    },
  });

  const handleSubmit = async (values: AutoReplySettings) => {
    setIsUpdating(true);
    await onSave(values);
    setIsUpdating(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auto-Reply Configuration</CardTitle>
        <CardDescription>
          Configure rules for automatic comment replies without manual review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Enable Auto-Replies
                    </FormLabel>
                    <FormDescription>
                      Automatically respond to comments based on your configured rules
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

            {form.watch("enabled") && (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="confidenceThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confidence Threshold</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            max="1"
                            step="0.05"
                          />
                        </FormControl>
                        <FormDescription>
                          Only auto-reply when AI confidence is above this threshold (0-1)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxTimeInQueue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Time in Queue (minutes)</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" min="5" />
                        </FormControl>
                        <FormDescription>
                          Auto-reply if no manual response after this time
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="maxDailyAutoReplies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Daily Auto-Replies</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1" />
                      </FormControl>
                      <FormDescription>
                        Safety limit on auto-replies per day (0 for unlimited)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workingHoursOnly"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Working Hours Only
                        </FormLabel>
                        <FormDescription>
                          Only auto-reply during business hours (9 AM - 5 PM)
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

                <div>
                  <FormLabel>Auto-Reply Categories</FormLabel>
                  <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Switch 
                        id="thank_you" 
                        checked={form.watch("autoReplyCategories").includes("thank_you")}
                        onCheckedChange={(checked) => {
                          const current = form.watch("autoReplyCategories");
                          if (checked) {
                            form.setValue("autoReplyCategories", [...current, "thank_you"]);
                          } else {
                            form.setValue("autoReplyCategories", 
                              current.filter(cat => cat !== "thank_you")
                            );
                          }
                        }}
                      />
                      <label htmlFor="thank_you" className="text-sm font-medium cursor-pointer flex-1">
                        Thank You Messages
                        <p className="text-xs text-muted-foreground">Auto-reply to simple thank you comments</p>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Switch 
                        id="simple_question" 
                        checked={form.watch("autoReplyCategories").includes("simple_question")}
                        onCheckedChange={(checked) => {
                          const current = form.watch("autoReplyCategories");
                          if (checked) {
                            form.setValue("autoReplyCategories", [...current, "simple_question"]);
                          } else {
                            form.setValue("autoReplyCategories", 
                              current.filter(cat => cat !== "simple_question")
                            );
                          }
                        }}
                      />
                      <label htmlFor="simple_question" className="text-sm font-medium cursor-pointer flex-1">
                        Simple Questions
                        <p className="text-xs text-muted-foreground">Auto-reply to basic product/service questions</p>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Switch 
                        id="compliment" 
                        checked={form.watch("autoReplyCategories").includes("compliment")}
                        onCheckedChange={(checked) => {
                          const current = form.watch("autoReplyCategories");
                          if (checked) {
                            form.setValue("autoReplyCategories", [...current, "compliment"]);
                          } else {
                            form.setValue("autoReplyCategories", 
                              current.filter(cat => cat !== "compliment")
                            );
                          }
                        }}
                      />
                      <label htmlFor="compliment" className="text-sm font-medium cursor-pointer flex-1">
                        Compliments
                        <p className="text-xs text-muted-foreground">Auto-reply to positive comments and praise</p>
                      </label>
                    </div>

                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <Switch 
                        id="availability" 
                        checked={form.watch("autoReplyCategories").includes("availability")}
                        onCheckedChange={(checked) => {
                          const current = form.watch("autoReplyCategories");
                          if (checked) {
                            form.setValue("autoReplyCategories", [...current, "availability"]);
                          } else {
                            form.setValue("autoReplyCategories", 
                              current.filter(cat => cat !== "availability")
                            );
                          }
                        }}
                      />
                      <label htmlFor="availability" className="text-sm font-medium cursor-pointer flex-1">
                        Availability Questions
                        <p className="text-xs text-muted-foreground">Auto-reply to questions about hours, stock, etc.</p>
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Comments matching these categories will be eligible for auto-replies
                  </p>
                </div>
              </>
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
                  Save Settings
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AutoReplySettings;
