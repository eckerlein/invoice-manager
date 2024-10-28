"use client";

import { GitCommitVertical } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import { de } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardDescription,
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

type BalanceOverTimeChartProps = {
  className?: string;
};

export function BalanceOverTimeBigChart({
  className,
}: BalanceOverTimeChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [overallBalance, setOverallBalance] = useState(0);

  useEffect(() => {
    async function fetchInvoiceData() {
      const incomingStore = await IncomingInvoiceStore.getInstance();
      const outgoingStore = await OutgoingInvoiceStore.getInstance();

      const incomingEntries = await incomingStore.entries();
      const outgoingEntries = await outgoingStore.entries();

      // Sort and accumulate balance
      const allEntries = [
        ...incomingEntries.map(([_, entry]) => ({
          ...entry,
          type: "incoming",
        })),
        ...outgoingEntries.map(([_, entry]) => ({
          ...entry,
          type: "outgoing",
        })),
      ].sort((a, b) => a.documentDate.getTime() - b.documentDate.getTime());

      let cumulativeBalance = 0;
      const balanceHistory: ChartData[] = [];

      allEntries.forEach((entry) => {
        cumulativeBalance +=
          entry.type === "outgoing" ? entry.amount : -entry.amount;
        const month = format(entry.documentDate, "yyyy-MM");
        const displayMonth = format(entry.documentDate, "MMMM", { locale: de });

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

      const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(new Date(), i);
        const month = format(date, "yyyy-MM");
        const displayMonth = format(date, "MMMM", { locale: de });

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
    <Card className={className}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Saldoentwicklung der letzten 6 Monate</CardTitle>
          <CardDescription>
            Die kumulierte Bilanz über die Monate
          </CardDescription>
        </div>
        <div className="flex">
          <button
            className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
            data-active
          >
            <span className="text-xs text-muted-foreground">Balance</span>
            <span
              className={`text-lg font-bold leading-none sm:text-3xl ${overallBalance >= 0 ? "text-chart-good" : "text-chart-bad"}`}
            >
              {overallBalance >= 0 ? "+" : ""}
              {formattedOverallBalance}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[100px] w-full"
        >
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
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("de-DE", {
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              dataKey="balanceOverTime"
              type="monotone"
              stroke="var(--color-balanceOverTime)"
              strokeWidth={2}
              dot={({ cx, cy }) => (
                <GitCommitVertical
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
    </Card>
  );
}
