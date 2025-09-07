'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Newspaper } from 'lucide-react';
import { DailyStockReportOutput, getDailyStockReport } from '@/ai/flows/get-daily-stock-report';

export function DailyStockReport() {
  const [report, setReport] = useState<DailyStockReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const dailyReport = await getDailyStockReport();
        setReport(dailyReport);
      } catch (error) {
        console.error('Error fetching daily stock report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, []);

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-12" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-primary" />
          <CardTitle>Daily Market Movers</CardTitle>
        </div>
        <CardDescription>A summary of today's top stock market movements.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-green-600">
            <TrendingUp className="h-5 w-5" /> Top Gainers
          </h3>
          {isLoading ? renderSkeleton() : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.topGainers.map((stock) => (
                  <TableRow key={stock.ticker}>
                    <TableCell>
                      <div className="font-medium">{stock.ticker}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{stock.price}</TableCell>
                    <TableCell className="text-right font-mono text-green-600">
                      <div>{stock.percentChange}</div>
                      <div className="text-xs">{stock.change}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2 text-red-600">
            <TrendingDown className="h-5 w-5" /> Top Losers
          </h3>
          {isLoading ? renderSkeleton() : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report?.topLosers.map((stock) => (
                  <TableRow key={stock.ticker}>
                    <TableCell>
                      <div className="font-medium">{stock.ticker}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </TableCell>
                    <TableCell className="text-right font-mono">{stock.price}</TableCell>
                    <TableCell className="text-right font-mono text-red-600">
                      <div>{stock.percentChange}</div>
                      <div className="text-xs">{stock.change}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
