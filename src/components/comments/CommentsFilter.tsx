
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
  status: string;
  platform: string;
  accountId: string;
  search: string;
  limit: number;
}

export interface CommentsFilterProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  accounts?: SocialAccount[];
  onSync?: () => void;
  isSyncing?: boolean;
}

export const CommentsFilter = ({
  filters,
  onFilterChange,
  accounts,
  onSync,
  isSyncing = false,
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
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        
        <Select
          value={filters.platform}
          onValueChange={(value) => onFilterChange({ ...filters, platform: value })}
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
          onValueChange={(value) => onFilterChange({ ...filters, accountId: value })}
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
          onClick={() => onFilterChange({ ...filters, platform: "all", accountId: "all", search: "" })}
          title="Clear filters"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>

      {onSync && (
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
      )}
    </div>
  );
};

export default CommentsFilter;
