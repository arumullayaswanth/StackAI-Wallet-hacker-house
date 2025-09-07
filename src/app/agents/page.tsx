'use client';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  AutomatedStockInvestmentDecisionsInput,
  automatedStockInvestmentDecisions,
} from '@/ai/flows/automated-stock-investment-decisions';

const formSchema = z.object({
  investmentAmount: z.coerce
    .number()
    .min(1, 'Investment amount must be greater than 0.'),
  rules: z.string().min(10, 'Please provide more detailed investment rules.'),
  stockDataApiType: z.enum(['YahooFinance', 'AlphaVantage']),
});

export default function AgentsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investmentAmount: 1000,
      rules:
        'Invest in tech stocks with a high growth potential. Prioritize companies with recent positive news and a strong market position. Allocate a maximum of 20% of the investment amount to any single stock.',
      stockDataApiType: 'YahooFinance',
    },
  });

  const onSubmit: SubmitHandler<
    AutomatedStockInvestmentDecisionsInput
  > = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await automatedStockInvestmentDecisions(data);
      setResult(response);
      toast({
        title: 'Investment Decision Processed',
        description:
          'The AI agent has successfully processed the investment decision.',
      });
    } catch (error) {
      console.error('Error processing investment decision:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'There was an error processing the investment decision. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid w-full max-w-4xl flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Automated Investment Agent
            </h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Investment Agent Configuration</CardTitle>
              <CardDescription>
                Configure the AI agent to make automated investment decisions
                based on your rules.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="investmentAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Amount ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 10000"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rules"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Investment Rules</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., Invest in tech stocks with high growth potential."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stockDataApiType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Data API</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an API" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="YahooFinance">
                                Yahoo Finance
                              </SelectItem>
                              <SelectItem value="AlphaVantage">
                                Alpha Vantage
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Run Agent
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Output</CardTitle>
                <CardDescription>
                  The following is the decision from the AI agent based on your
                  configuration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Investment Decision</h3>
                    <p className="text-muted-foreground">
                      {result.investmentDecision}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Transactions</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Ticker
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Action
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {result.transactions.map(
                            (tx: any, index: number) => (
                              <tr key={index}>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {tx.ticker}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 capitalize">
                                  {tx.action}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  {tx.quantity}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                  ${tx.price.toFixed(2)}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
