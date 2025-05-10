
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeRangeSelectorProps {
  period: string;
  setPeriod: (period: string) => void;
}

export function TimeRangeSelector({ period, setPeriod }: TimeRangeSelectorProps) {
  return (
    <Tabs
      defaultValue="week"
      value={period}
      onValueChange={setPeriod}
      className="mb-4"
    >
      <TabsList>
        <TabsTrigger value="day">Today</TabsTrigger>
        <TabsTrigger value="week">This Week</TabsTrigger>
        <TabsTrigger value="month">This Month</TabsTrigger>
        <TabsTrigger value="all">All Time</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
