
import { BrandVoice } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash, MessageSquare } from "lucide-react";

interface BrandVoiceCardProps {
  voice: BrandVoice;
  onEdit: (voice: BrandVoice) => void;
  onDelete: (voice: BrandVoice) => void;
}

export const BrandVoiceCard = ({ voice, onEdit, onDelete }: BrandVoiceCardProps) => {
  return (
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
              <DropdownMenuItem onClick={() => onEdit(voice)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(voice)}
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
  );
};
