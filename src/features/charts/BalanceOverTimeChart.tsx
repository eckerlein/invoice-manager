import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { format, subMonths, isBefore } from "date-fns";
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
  balanceOverTime: {
    label: "Balance",
    color: "hsl(var(--chart-neutral))",
  },
} satisfies ChartConfig;

type ChartData = {
  month: string;
  displayMonth: string;
  balanceOverTime: number;
};

export function BalanceOverTimeChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [overallBalance, setOverallBalance] = useState(0);

  useEffect(() => {
    async function fetchInvoiceData() {
      const incomingStore = await IncomingInvoiceStore.getInstance();
      const outgoingStore = await OutgoingInvoiceStore.getInstance();

      const incomingEntries = await incomingStore.entries();
      const outgoingEntries = await outgoingStore.entries();

      // Sort all entries by date to calculate a running balance in chronological order
      const allEntries = [
        ...incomingEntries.map(([id, entry]) => ({
          ...entry,
          type: "incoming",
        })),
        ...outgoingEntries.map(([id, entry]) => ({
          ...entry,
          type: "outgoing",
        })),
      ].sort((a, b) => a.documentDate.getTime() - b.documentDate.getTime());

      let cumulativeBalance = 0;
      const balanceHistory: ChartData[] = [];

      allEntries.forEach((entry) => {
        cumulativeBalance +=
          entry.type === "outgoing" ? entry.amount : -entry.amount;

        // Format each month for display
        const month = format(entry.documentDate, "yyyy-MM");
        const displayMonth = format(entry.documentDate, "MMMM", { locale: de });

        // Update the balance for the current month or add a new month if necessary
        const lastRecordedMonth =
          balanceHistory[balanceHistory.length - 1]?.month;
        if (lastRecordedMonth === month) {
          balanceHistory[balanceHistory.length - 1].balanceOverTime =
            cumulativeBalance;
        } else {
          balanceHistory.push({
            month,
            displayMonth,
            balanceOverTime: cumulativeBalance,
          });
        }
      });

      // Filter the last 6 months for display purposes
      const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        const month = format(date, "yyyy-MM");
        const displayMonth = format(date, "MMMM", { locale: de });

        // Find the balance for the given month or default to the last known balance
        const monthlyBalance = balanceHistory.find(
          (data) => data.month === month
        );
        return {
          month,
          displayMonth,
          balanceOverTime: monthlyBalance?.balanceOverTime ?? 0,
        };
      }).reverse();

      setChartData(lastSixMonths);
      setOverallBalance(cumulativeBalance);
    }

    fetchInvoiceData();
  }, []);

  const formattedOverallBalance = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(overallBalance);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldoentwicklung der letzten 6 Monate</CardTitle>
        <CardDescription>Die kumulierte Bilanz über die Monate</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`text-6xl ${
            overallBalance >= 0 ? "text-chart-good" : "text-chart-bad"
          }`}
        >
          {overallBalance >= 0 ? "+" : ""}
          {formattedOverallBalance}
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
              dataKey="balanceOverTime"
              type="monotone"
              stroke="var(--color-balanceOverTime)"
              strokeWidth={2}
              dot={({ cx, cy, payload }) => (
                <GitCommitVertical
                  key={payload.month}
                  x={cx - 12}
                  y={cy - 12}
                  width={24}
                  height={24}
                  fill="hsl(var(--background))"
                  stroke="var(--color-balanceOverTime)"
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Gesamtsaldo nach 6 Monaten
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Die kumulierte Bilanz von Einnahmen und Ausgaben
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
