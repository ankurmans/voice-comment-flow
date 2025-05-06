
import { Dispatch, SetStateAction } from "react";
import { SocialAccount } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX, Loader2, RefreshCcw } from "lucide-react";

interface FilterState {
  platform: string;
  accountId: string;
  search: string;
}

interface CommentsFilterProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  accounts?: SocialAccount[];
  onSync: () => void;
  isSyncing: boolean;
}

export const CommentsFilter = ({
  filters,
  setFilters,
  accounts,
  onSync,
  isSyncing,
}: CommentsFilterProps) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search comments..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        
        <Select
          value={filters.platform}
          onValueChange={(value) => setFilters({ ...filters, platform: value })}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Platforms</SelectLabel>
              <SelectItem value="all">All platforms</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="google">Google</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Select
          value={filters.accountId}
          onValueChange={(value) => setFilters({ ...filters, accountId: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Accounts</SelectLabel>
              <SelectItem value="all">All accounts</SelectItem>
              {accounts?.map((account: SocialAccount) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.accountName}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => setFilters({ platform: "", accountId: "", search: "" })}
          title="Clear filters"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="default"
        onClick={onSync}
        disabled={isSyncing}
      >
        {isSyncing ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 h-4 w-4" />
        )}
        Sync Comments
      </Button>
    </div>
  );
};

export default CommentsFilter;
