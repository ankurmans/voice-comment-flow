
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BrandVoice } from "@/types";
import { BrandVoiceCard } from "@/components/brand-voice/BrandVoiceCard";
import { BrandVoiceDialog } from "@/components/brand-voice/BrandVoiceDialog";
import { DeleteBrandVoiceDialog } from "@/components/brand-voice/DeleteBrandVoiceDialog";
import { EmptyBrandVoices } from "@/components/brand-voice/EmptyBrandVoices";
import { FormValues } from "@/components/brand-voice/BrandVoiceForm";
import { useBrandVoices } from "@/hooks/useBrandVoices";

const BrandVoicePage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentVoice, setCurrentVoice] = useState<BrandVoice | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voiceToDelete, setVoiceToDelete] = useState<BrandVoice | null>(null);
  
  const {
    brandVoices,
    isLoading,
    createVoiceMutation,
    updateVoiceMutation,
    deleteVoiceMutation,
  } = useBrandVoices();

  const openCreateDialog = () => {
    setCurrentVoice(null);
    setDialogOpen(true);
  };

  const openEditDialog = (voice: BrandVoice) => {
    setCurrentVoice(voice);
    setDialogOpen(true);
  };

  const openDeleteDialog = (voice: BrandVoice) => {
    setVoiceToDelete(voice);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = (values: FormValues) => {
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
            <BrandVoiceCard
              key={voice.id}
              voice={voice}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ))}
        </div>
      ) : (
        <EmptyBrandVoices onCreateClick={openCreateDialog} />
      )}

      {/* Create/Edit Dialog */}
      <BrandVoiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
        currentVoice={currentVoice}
        isPending={createVoiceMutation.isPending || updateVoiceMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBrandVoiceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isPending={deleteVoiceMutation.isPending}
        voice={voiceToDelete}
      />
    </div>
  );
};

export default BrandVoicePage;
