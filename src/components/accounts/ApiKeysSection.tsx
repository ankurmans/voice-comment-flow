
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Key, Copy, Check, TrashIcon, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  platform: string;
  key: string;
  created: Date;
  last_used?: Date;
}

export function ApiKeysSection() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      platform: "instagram",
      key: "IGQVxxxxxxxxxxxxxxxxxxxx",
      created: new Date(2023, 9, 15)
    },
    {
      id: "2",
      platform: "facebook",
      key: "EAAGxxxxxxxxxxxxxxx",
      created: new Date(2023, 8, 22),
      last_used: new Date(2023, 10, 5)
    }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newPlatform, setNewPlatform] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Function to handle copying API key to clipboard
  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      
      toast({
        title: "API key copied",
        description: "The API key has been copied to your clipboard."
      });
    });
  };

  // Function to handle deleting an API key
  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    
    toast({
      title: "API key deleted",
      description: "The API key has been permanently removed."
    });
  };

  // Function to handle adding a new API key
  const handleAddKey = () => {
    if (!newPlatform || !newApiKey) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both platform name and API key."
      });
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      platform: newPlatform.toLowerCase(),
      key: newApiKey,
      created: new Date()
    };

    setApiKeys([...apiKeys, newKey]);
    setNewPlatform("");
    setNewApiKey("");
    setIsAdding(false);
    
    toast({
      title: "API key added",
      description: `Your ${newPlatform} API key has been added successfully.`
    });
  };

  // Function to mask API key for display
  const maskApiKey = (key: string) => {
    if (key.length <= 8) return "••••••••";
    return key.substring(0, 4) + "••••••••" + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Key className="h-5 w-5" /> API Keys
          </CardTitle>
          <CardDescription>
            Manage your API keys for different social media platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length > 0 ? (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium capitalize">{apiKey.platform}</TableCell>
                    <TableCell className="font-mono text-xs">{maskApiKey(apiKey.key)}</TableCell>
                    <TableCell>{apiKey.created.toLocaleDateString()}</TableCell>
                    <TableCell>{apiKey.last_used ? apiKey.last_used.toLocaleDateString() : "Never"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyKey(apiKey.id, apiKey.key)}
                        >
                          {copiedId === apiKey.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No API keys found. Add a new API key to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {isAdding ? (
            <div className="mt-6 border rounded-md p-4 space-y-4">
              <h3 className="font-medium">Add New API Key</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input 
                    id="platform" 
                    placeholder="e.g., Instagram, Facebook" 
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    id="apiKey" 
                    placeholder="Paste your API key here" 
                    value={newApiKey}
                    onChange={(e) => setNewApiKey(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddKey}>
                  Add Key
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setIsAdding(true)}
              >
                <PlusCircle className="h-4 w-4" /> Add API Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Getting Your API Keys</CardTitle>
          <CardDescription>
            Instructions on how to obtain API keys for various social platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Instagram</h3>
            <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
              <li>Go to the Facebook Developer Portal</li>
              <li>Create a new app or use an existing app</li>
              <li>Add Instagram to the app</li>
              <li>Complete the Instagram Basic Display setup</li>
              <li>Generate an access token for your Instagram account</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Facebook</h3>
            <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
              <li>Go to the Facebook Developer Portal</li>
              <li>Create a new app or use an existing app</li>
              <li>Navigate to Tools &gt; Graph API Explorer</li>
              <li>Select your app and generate a user or page access token</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Twitter</h3>
            <ol className="list-decimal ml-5 space-y-1 text-sm text-muted-foreground">
              <li>Go to the Twitter Developer Portal</li>
              <li>Create a project and app</li>
              <li>Navigate to the "Keys and tokens" tab</li>
              <li>Generate API keys and access tokens</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
