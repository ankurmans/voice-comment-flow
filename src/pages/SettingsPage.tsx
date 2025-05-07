import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  SettingsIcon,
  ShieldCheck,
  Lock,
  BellRing,
  CreditCard,
  Loader2,
  CheckCheck,
  User,
  MessageSquare,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import AutoReplySettings from "@/components/settings/AutoReplySettings";
import { userDataApi } from "@/services/api";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email(),
  company: z.string().optional(),
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  commentAlerts: z.boolean().default(true),
  weeklyDigest: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
});

const aiSettingsFormSchema = z.object({
  model: z.string().default("gpt-4"),
  temperature: z.string().default("0.7"),
  maxTokens: z.string().default("250"),
  autoApprove: z.boolean().default(false),
  autoApproveThreshold: z.string().default("0.9"),
});

const SettingsPage = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Jane Smith",
      email: "jane@example.com",
      company: "Acme Inc.",
    },
  });

  const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated.",
    });
  };

  // Notifications form
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      commentAlerts: true,
      weeklyDigest: true,
      marketingEmails: false,
    },
  });

  const onNotificationsSubmit = async (values: z.infer<typeof notificationsFormSchema>) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  // AI Settings form
  const aiSettingsForm = useForm<z.infer<typeof aiSettingsFormSchema>>({
    resolver: zodResolver(aiSettingsFormSchema),
    defaultValues: {
      model: "gpt-4",
      temperature: "0.7",
      maxTokens: "250",
      autoApprove: false,
      autoApproveThreshold: "0.9",
    },
  });

  const onAISettingsSubmit = async (values: z.infer<typeof aiSettingsFormSchema>) => {
    setIsUpdating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsUpdating(false);
    toast({
      title: "AI settings updated",
      description: "Your AI configuration has been saved.",
    });
  };

  // Auto-Reply Settings handler
  const handleAutoReplySettingsSave = async (settings: any) => {
    try {
      // In production, this would call an API to save the settings
      await userDataApi.saveAutoReplySettings(settings);
      
      toast({
        title: "Auto-reply settings updated",
        description: "Your auto-reply configuration has been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "There was an error saving your auto-reply settings."
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and application settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-5 md:grid-cols-none md:flex">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <BellRing className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="ai-settings" className="flex items-center">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>AI Settings</span>
          </TabsTrigger>
          <TabsTrigger value="auto-reply" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Auto-Reply</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormDescription>
                          We'll use this email for account-related communications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Optional: Your company or organization name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your security settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Update your account password
                  </p>
                </div>
                <Button variant="outline">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationsForm}>
                <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-8">
                  <div className="space-y-4">
                    <FormField
                      control={notificationsForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications via email
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
                    <FormField
                      control={notificationsForm.control}
                      name="commentAlerts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              New Comment Alerts
                            </FormLabel>
                            <FormDescription>
                              Get notified when new comments are received
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
                    <FormField
                      control={notificationsForm.control}
                      name="weeklyDigest"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Weekly Digest
                            </FormLabel>
                            <FormDescription>
                              Receive a weekly summary of your engagement metrics
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
                    <FormField
                      control={notificationsForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Marketing Emails
                            </FormLabel>
                            <FormDescription>
                              Receive emails about new features and offers
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
                  </div>
                  <Button type="submit"disabled={isUpdating}>
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
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai-settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>
                Configure how the AI generates replies to comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...aiSettingsForm}>
                <form onSubmit={aiSettingsForm.handleSubmit(onAISettingsSubmit)} className="space-y-8">
                  <FormField
                    control={aiSettingsForm.control}
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
                      control={aiSettingsForm.control}
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
                      control={aiSettingsForm.control}
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
                    control={aiSettingsForm.control}
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

                  {aiSettingsForm.watch("autoApprove") && (
                    <FormField
                      control={aiSettingsForm.control}
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
        </TabsContent>

        {/* New Auto-Reply Tab */}
        <TabsContent value="auto-reply" className="mt-6">
          <AutoReplySettings onSave={handleAutoReplySettingsSave} />
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription, payment methods, and billing history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">Pro Plan</p>
                    <p className="text-sm text-muted-foreground">$49/month, billed monthly</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
                    <span className="text-sm">Unlimited comments</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
                    <span className="text-sm">Premium AI model access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="text-green-500 mr-2 h-4 w-4" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <div className="mt-2 flex items-center">
                  <svg className="h-8 w-auto mr-2" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="40" rx="4" fill="#EEF0F3"/>
                    <path d="M18.3 25.5H15L12.3 17.6C12.2336 17.3881 12.1195 17.1939 11.9665 17.0336C11.8135 16.8733 11.6262 16.7513 11.4212 16.6785C11.2162 16.6057 10.9986 16.5841 10.785 16.6151C10.5714 16.6462 10.3677 16.7291 10.19 16.857V16.5H5.75V25.5H9.025V18.275H10.832L13.985 25.5H18.3Z" fill="#3C4043"/>
                    <path d="M19.4749 20.1502C19.4749 23.1252 21.7999 25.7252 24.9999 25.7252C27.0749 25.7252 28.3249 24.6502 28.3249 24.6502L27.4999 22.0252C27.4999 22.0252 26.5499 22.7752 25.3749 22.7752C24.1999 22.7752 23.1999 21.8752 23.1999 20.1502C23.1999 18.4252 24.1499 17.5252 25.3749 17.5252C26.5999 17.5252 27.4249 18.3002 27.4249 18.3002L28.2499 15.6252C28.2499 15.6252 27.0249 14.5752 24.9499 14.5752C21.7999 14.6002 19.4749 17.2002 19.4749 20.1502Z" fill="#3C4043"/>
                    <path d="M35.2248 14.5752C32.0248 14.5752 29.6748 17.3002 29.6748 20.1502C29.6748 23.0002 32.0248 25.7252 35.2248 25.7252C38.4248 25.7252 40.7748 23.0002 40.7748 20.1502C40.7748 17.3002 38.4248 14.5752 35.2248 14.5752ZM35.2248 22.7252C33.9748 22.7252 33.0248 21.7002 33.0248 20.1502C33.0248 18.6002 33.9748 17.5752 35.2248 17.5752C36.4748 17.5752 37.4248 18.6002 37.4248 20.1502C37.4248 21.7002 36.4748 22.7252 35.2248 22.7252Z" fill="#3C4043"/>
                    <path d="M53.9001 25.5V14.8252H51.1251L48.2751 21.0002H48.2001L45.3251 14.8252H42.5001V25.5H45.7751V20.5252H45.8251L48.1751 25.5H48.2501L50.6251 20.5252H50.6751V25.5H53.9001Z" fill="#3C4043"/>
                  </svg>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-xs text-muted-foreground">Expires 04/2025</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Edit
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">Billing History</h3>
                <div className="mt-2">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground border-b">
                      <tr>
                        <th className="py-2 text-left">Date</th>
                        <th className="py-2 text-left">Description</th>
                        <th className="py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">May 1, 2023</td>
                        <td className="py-3">Pro Plan - Monthly</td>
                        <td className="py-3 text-right">$49.00</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">Apr 1, 2023</td>
                        <td className="py-3">Pro Plan - Monthly</td>
                        <td className="py-3 text-right">$49.00</td>
                      </tr>
                      <tr>
                        <td className="py-3">Mar 1, 2023</td>
                        <td className="py-3">Pro Plan - Monthly</td>
                        <td className="py-3 text-right">$49.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-center">
                  <Button variant="link">View All Invoices</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
