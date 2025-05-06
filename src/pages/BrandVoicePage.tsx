
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandVoiceApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { BrandVoice } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, MoreVertical, Edit, Trash, MessageSquare, CheckCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Define the form schema with required fields matching BrandVoice type
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  toneStyle: z.enum(["cheeky", "grateful", "funny", "professional", "custom"]),
  examples: z.array(z.string()).min(1, { message: "At least one example is required" }),
  customInstructions: z.string().optional(),
});

// Define the type for form values to ensure it matches BrandVoice requirements
type FormValues = z.infer<typeof formSchema>;

const BrandVoicePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<BrandVoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voiceToDelete, setVoiceToDelete] = useState<BrandVoice | null>(null);

  // Query brand voices
  const { data: brandVoices, isLoading } = useQuery({
    queryKey: ["brand-voices"],
    queryFn: async () => {
      const response = await brandVoiceApi.getAll();
      return response.data || [];
    },
  });

  // Mutations
  const createVoiceMutation = useMutation({
    mutationFn: (data: Omit<BrandVoice, "id" | "userId" | "createdAt" | "updatedAt">) => {
      return brandVoiceApi.create(data);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice created",
        description: "Your new brand voice has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-voices"] });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to create",
        description: "There was an error creating your brand voice",
      });
    },
  });

  const updateVoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<BrandVoice, "id" | "userId" | "createdAt" | "updatedAt"> }) => {
      return brandVoiceApi.update(id, data);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice updated",
        description: "Your brand voice has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-voices"] });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to update",
        description: "There was an error updating your brand voice",
      });
    },
  });

  const deleteVoiceMutation = useMutation({
    mutationFn: (id: string) => {
      return brandVoiceApi.delete(id);
    },
    onSuccess: () => {
      toast({
        title: "Brand voice deleted",
        description: "The brand voice has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["brand-voices"] });
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "There was an error deleting the brand voice",
      });
    },
  });

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      toneStyle: "professional",
      examples: [""],
      customInstructions: "",
    },
  });

  const openCreateDialog = () => {
    form.reset({
      name: "",
      description: "",
      toneStyle: "professional",
      examples: [""],
      customInstructions: "",
    });
    setCurrentVoice(null);
    setDialogOpen(true);
  };

  const openEditDialog = (voice: BrandVoice) => {
    form.reset({
      name: voice.name,
      description: voice.description,
      toneStyle: voice.toneStyle,
      examples: voice.examples,
      customInstructions: voice.customInstructions || "",
    });
    setCurrentVoice(voice);
    setDialogOpen(true);
  };

  const openDeleteDialog = (voice: BrandVoice) => {
    setVoiceToDelete(voice);
    setDeleteDialogOpen(true);
  };

  const onSubmit = (values: FormValues) => {
    // Ensure values match required structure before passing to mutations
    const brandVoiceData: Omit<BrandVoice, "id" | "userId" | "createdAt" | "updatedAt"> = {
      name: values.name,
      description: values.description,
      toneStyle: values.toneStyle,
      examples: values.examples,
      customInstructions: values.customInstructions,
    };

    if (currentVoice) {
      updateVoiceMutation.mutate({
        id: currentVoice.id,
        data: brandVoiceData,
      });
    } else {
      createVoiceMutation.mutate(brandVoiceData);
    }
  };

  const handleDeleteConfirm = () => {
    if (voiceToDelete) {
      deleteVoiceMutation.mutate(voiceToDelete.id);
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Brand Voice</h1>
            <p className="text-muted-foreground">
              Define your brand's tone and personality for AI-generated responses
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Voice
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[320px] w-full" />
          <Skeleton className="h-[320px] w-full" />
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : brandVoices && brandVoices.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brandVoices.map((voice: BrandVoice) => (
            <Card key={voice.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{voice.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEditDialog(voice)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => openDeleteDialog(voice)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2">
                  {voice.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="bg-primary/10 text-primary text-xs rounded-full px-2 py-1 font-medium">
                      {voice.toneStyle.charAt(0).toUpperCase() + voice.toneStyle.slice(1)}
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-2 bg-muted/30 h-32 overflow-auto">
                    <p className="text-xs text-muted-foreground mb-1">Example replies:</p>
                    <ul className="text-sm space-y-2">
                      {voice.examples.map((example, index) => (
                        <li key={index} className="flex items-start">
                          <MessageSquare className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <span className="line-clamp-2">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(voice.createdAt).toLocaleDateString()}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 mt-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No brand voices</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
            Create a brand voice to define how your AI should respond to comments. Your brand voice guides the tone and personality of generated replies.
          </p>
          <Button className="mt-4" onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Brand Voice
          </Button>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {currentVoice ? "Edit Brand Voice" : "Create Brand Voice"}
            </DialogTitle>
            <DialogDescription>
              Define how your AI should respond to comments with your brand's unique voice and personality.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Friendly Customer Service" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toneStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone Style</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tone style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cheeky">Cheeky & Playful</SelectItem>
                          <SelectItem value="grateful">Grateful & Appreciative</SelectItem>
                          <SelectItem value="funny">Funny & Humorous</SelectItem>
                          <SelectItem value="professional">Professional & Formal</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your brand voice in detail..." 
                        {...field} 
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Explain how your brand typically communicates with customers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Example Replies</FormLabel>
                <FormDescription className="mb-2">
                  Provide examples of how you'd like to respond to comments
                </FormDescription>

                {form.watch("examples").map((_, index) => (
                  <div key={index} className="flex items-start mb-2">
                    <FormField
                      control={form.control}
                      name={`examples.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1 mr-2">
                          <FormControl>
                            <Textarea 
                              placeholder="Example reply..." 
                              {...field} 
                              className="min-h-[80px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const examples = form.getValues("examples");
                        if (examples.length > 1) {
                          const newExamples = examples.filter((_, i) => i !== index);
                          form.setValue("examples", newExamples);
                        }
                      }}
                      disabled={form.watch("examples").length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    const examples = form.getValues("examples");
                    form.setValue("examples", [...examples, ""]);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Example
                </Button>
              </div>

              {form.watch("toneStyle") === "custom" && (
                <FormField
                  control={form.control}
                  name="customInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide specific instructions for AI responses..." 
                          {...field} 
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Add detailed instructions about your brand's unique voice
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createVoiceMutation.isPending || updateVoiceMutation.isPending
                  }
                >
                  {(createVoiceMutation.isPending || updateVoiceMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {currentVoice ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      {currentVoice ? "Update Voice" : "Create Voice"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Brand Voice</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{voiceToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteVoiceMutation.isPending}
            >
              {deleteVoiceMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BrandVoicePage;
