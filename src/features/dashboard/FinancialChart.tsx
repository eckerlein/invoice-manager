import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import IncomingInvoiceStore from "@/features/invoices/incoming/incomingInvoiceStore";
import OutgoingInvoiceStore from "@/features/invoices/outgoing/outgoingInvoiceStore";

const chartConfig = {
  einnahmen: {
    label: "Einnahmen",
    color: "hsl(var(--chart-1))",
  },
  ausgaben: {
    label: "Ausgaben",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

type ChartData = {
  month: string;
  einnahmen: number;
  ausgaben: number;
  total: number;
};

export function FinancialChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  console.log(chartData);

  useEffect(() => {
    async function fetchInvoiceData() {
      const incomingStore = await IncomingInvoiceStore.getInstance();
      const outgoingStore = await OutgoingInvoiceStore.getInstance();

      const incomingEntries = await incomingStore.entries();
      const outgoingEntries = await outgoingStore.entries();

      // Initialize data structure for the past 6 months
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        return {
          month: format(date, "yyyy-MM"),
          displayMonth: format(date, "MMMM"),
          einnahmen: 0,
          ausgaben: 0,
          total: 0,
        };
      }).reverse();

      console.log("lastSixMonths", lastSixMonths);

      // Helper function to add invoice totals by month
      const addTotals = (
        entries: [string, { documentDate: Date; amount: number }][] | undefined,
        isEinnahmen: boolean
      ) => {
        entries?.forEach(([_, { documentDate, amount }]) => {
          console.log(documentDate, amount);
          const monthIndex = lastSixMonths.findIndex(
            (data) =>
              format(documentDate, "MMMM yyyy") ===
              format(new Date(data.month), "MMMM yyyy")
          );
          console.log(monthIndex);
          if (monthIndex > -1) {
            if (isEinnahmen) {
              lastSixMonths[monthIndex].einnahmen += amount;
            } else {
              lastSixMonths[monthIndex].ausgaben += amount;
            }
            lastSixMonths[monthIndex].total =
              lastSixMonths[monthIndex].einnahmen -
              lastSixMonths[monthIndex].ausgaben;
          }
        });
      };

      // Add incoming and outgoing totals to each month's data
      addTotals(incomingEntries, false); // Ausgaben
      addTotals(outgoingEntries, true); // Einnahmen

      setChartData(lastSixMonths);
    }

    fetchInvoiceData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finanzübersicht der letzten 6 Monate</CardTitle>
        <CardDescription>Einblicke in Einnahmen und Ausgaben</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="einnahmen"
              type="monotone"
              stroke="var(--color-einnahmen)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="ausgaben"
              type="monotone"
              stroke="var(--color-ausgaben)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Umsatz der letzten Monate <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Anzeigen der Einnahmen und Ausgaben für die letzten 6 Monate
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
