
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrandVoice } from "@/types";
import { BrandVoiceForm, FormValues } from "./BrandVoiceForm";

interface BrandVoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
  currentVoice: BrandVoice | null;
  isPending: boolean;
}

export const BrandVoiceDialog = ({
  open,
  onOpenChange,
  onSubmit,
  currentVoice,
  isPending,
}: BrandVoiceDialogProps) => {
  const defaultValues: FormValues = currentVoice
    ? {
        name: currentVoice.name,
        description: currentVoice.description,
        toneStyle: currentVoice.toneStyle,
        examples: currentVoice.examples,
        customInstructions: currentVoice.customInstructions || "",
      }
    : {
        name: "",
        description: "",
        toneStyle: "professional",
        examples: [""],
        customInstructions: "",
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {currentVoice ? "Edit Brand Voice" : "Create Brand Voice"}
          </DialogTitle>
          <DialogDescription>
            Define how your AI should respond to comments with your brand's unique voice and personality.
          </DialogDescription>
        </DialogHeader>

        <BrandVoiceForm 
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isPending={isPending}
          isEdit={!!currentVoice}
        />
      </DialogContent>
    </Dialog>
  );
};
