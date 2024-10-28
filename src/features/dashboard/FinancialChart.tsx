import { GitCommitVertical, TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import { de } from "date-fns/locale";

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
    color: "hsl(var(--chart-good))",
  },
  ausgaben: {
    label: "Ausgaben",
    color: "hsl(var(--chart-bad))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-neutral))",
  },
} satisfies ChartConfig;

type ChartData = {
  month: string;
  displayMonth: string;
  einnahmen: number;
  ausgaben: number;
  total: number;
};

export function FinancialChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [overallTotal, setOverallTotal] = useState(0);

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
          displayMonth: format(date, "MMMM", { locale: de }),
          einnahmen: 0,
          ausgaben: 0,
          total: 0,
        };
      }).reverse();

      // Helper function to add invoice totals by month
      const addTotals = (
        entries: [string, { documentDate: Date; amount: number }][] | undefined,
        isEinnahmen: boolean
      ) => {
        entries?.forEach(([_, { documentDate, amount }]) => {
          const monthIndex = lastSixMonths.findIndex(
            (data) =>
              format(documentDate, "MMMM yyyy") ===
              format(new Date(data.month), "MMMM yyyy")
          );
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

      // Calculate the overall total of all totals
      const calculatedOverallTotal = lastSixMonths.reduce(
        (acc, month) => acc + month.total,
        0
      );
      setOverallTotal(calculatedOverallTotal);
    }

    fetchInvoiceData();
  }, []);

  // Format the overall total as German currency and add a +/- sign
  const formattedOverallTotal = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(overallTotal);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finanzübersicht der letzten 6 Monate</CardTitle>
        <CardDescription>Einblicke in Einnahmen und Ausgaben</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`text-6xl ${
            overallTotal >= 0 ? "text-chart-good" : "text-chart-bad"
          }`}
        >
          {overallTotal >= 0 ? "+" : "-"}
          {formattedOverallTotal}
        </div>
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
              dataKey="displayMonth"
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
              dot={({ cx, cy, payload }) => {
                const r = 24;
                return (
                  <GitCommitVertical
                    key={payload.month}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-einnahmen)"
                  />
                );
              }}
            />
            <Line
              dataKey="ausgaben"
              type="monotone"
              stroke="var(--color-ausgaben)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24;
                return (
                  <GitCommitVertical
                    key={payload.month}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-ausgaben)"
                  />
                );
              }}
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => {
                const r = 24;
                return (
                  <GitCommitVertical
                    key={payload.month}
                    x={cx - r / 2}
                    y={cy - r / 2}
                    width={r}
                    height={r}
                    fill="hsl(var(--background))"
                    stroke="var(--color-total)"
                  />
                );
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-0 font-medium leading-none">
              Der Umsatz ist in den letzten 6 Monaten{" "}
              {overallTotal >= 0 ? (
                <span className="ml-1 flex items-center gap-1 text-chart-good">
                  gestiegen
                  <TrendingUp className="h-4 w-4" />
                </span>
              ) : (
                <span className="ml-1 flex items-center gap-1 text-chart-bad">
                  gefallen
                  <TrendingDown className="h-4 w-4" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 leading-sm text-muted-foreground">
              Hier sehen Sie, wie sich Ihre Einnahmen und Ausgaben in den
              letzten 6 Monaten entwickelt haben.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
