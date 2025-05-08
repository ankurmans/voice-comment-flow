
import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommentsFilterProps {
  filters: {
    status: string;
    platform: string;
    accountId: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function CommentsFilter({ 
  filters, 
  onFilterChange,
}: CommentsFilterProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({ search: searchValue });
  };

  const handleClearSearch = () => {
    setSearchValue("");
    onFilterChange({ search: "" });
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange({ status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Comments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="ignored">Ignored</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.platform}
          onValueChange={(value) => onFilterChange({ platform: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.accountId}
          onValueChange={(value) => onFilterChange({ accountId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Accounts</SelectItem>
            <SelectItem value="1">@brandaccount</SelectItem>
            <SelectItem value="2">@personalaccount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search comments..."
          className="pl-8"
          value={searchValue}
          onChange={handleSearchChange}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-2.5"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </button>
        )}
      </form>
    </div>
  );
}
