
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrandVoice } from "@/types";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, CheckCheck, Trash } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";

// Define the form schema with required fields matching BrandVoice type
export const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  toneStyle: z.enum(["cheeky", "grateful", "funny", "professional", "custom"]),
  examples: z.array(z.string()).min(1, { message: "At least one example is required" }),
  customInstructions: z.string().optional(),
});

// Define the type for form values to ensure it matches BrandVoice requirements
export type FormValues = z.infer<typeof formSchema>;

interface BrandVoiceFormProps {
  defaultValues: FormValues;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
  isPending: boolean;
  isEdit: boolean;
}

export const BrandVoiceForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  isEdit,
}: BrandVoiceFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  return (
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
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <CheckCheck className="mr-2 h-4 w-4" />
                {isEdit ? "Update Voice" : "Create Voice"}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
