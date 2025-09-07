
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bot, User, CornerDownLeft, Loader2, Send } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ActionResponse, handleUserPrompt } from '@/app/actions';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/use-wallet';

const FormSchema = z.object({
  prompt: z.string().min(1, 'Please enter a prompt.'),
});

type Message = {
  role: 'user' | 'ai';
  content: string;
  transaction?: ActionResponse['transaction'];
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm your StackAI agent. How can I help you today? You can ask me to transfer funds, invest, or check your balance.",
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<ActionResponse['transaction'] | undefined>(undefined);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { stxBalance, handleSendTransaction, stxAddress } = useWallet();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const scrollToBottom = () => {
    setTimeout(() => {
        const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }, 100);
  };

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data) => {
    if (!stxAddress) {
      toast({
        variant: "destructive",
        title: "Wallet not connected",
        description: "Please connect your wallet to interact with the AI agent.",
      });
      return;
    }
    setIsSubmitting(true);
    const userMessage: Message = { role: 'user', content: data.prompt };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();
    scrollToBottom();
    
    try {
      const aiResponse = await handleUserPrompt(data.prompt, stxBalance);
      const aiMessage: Message = { role: 'ai', content: aiResponse.text, transaction: aiResponse.transaction };
      setMessages((prev) => [...prev, aiMessage]);
      if (aiResponse.transaction) {
        setPendingTransaction(aiResponse.transaction);
      }
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      const errorMessage: Message = { role: 'ai', content: "Sorry, I couldn't process that. Please try again." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
      scrollToBottom();
    }
  };

  const onConfirmTransaction = async () => {
    if (!pendingTransaction) return;

    try {
      await handleSendTransaction(pendingTransaction);
      toast({
        title: "Transaction Broadcast!",
        description: "Your transaction has been submitted to the network.",
      });
      const txSuccessMessage: Message = { role: 'ai', content: `I've successfully broadcasted the transaction to send ${pendingTransaction.amount} ${pendingTransaction.asset} to ${pendingTransaction.recipient}.` };
      setMessages((prev) => [...prev, txSuccessMessage]);

    } catch (error: any) {
       let userMessage = "It looks like the transaction was canceled.";
       if (error.message.includes("canceled")) {
         toast({
            title: "Transaction Canceled",
            description: "The transaction was canceled in your wallet.",
          });
       } else {
         toast({
            variant: "destructive",
            title: "Transaction Failed",
            description: error.message || "An unknown error occurred.",
         });
         userMessage = "The transaction failed. Please check your wallet and try again.";
       }
       const txFailMessage: Message = { role: 'ai', content: userMessage };
       setMessages((prev) => [...prev, txFailMessage]);
    } finally {
      setPendingTransaction(undefined);
      scrollToBottom();
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>AI Agent</CardTitle>
          <CardDescription>Interact with your wallet using natural language.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
              <div className="space-y-6">
              {messages.map((message, index) => (
                  <div key={index} className={cn('flex items-start gap-4', message.role === 'user' && 'justify-end')}>
                  {message.role === 'ai' && (
                      <Avatar className="w-8 h-8 border">
                      <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                  )}
                  <div className={cn(
                      'max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap',
                      message.role === 'ai' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                  )}>
                      <p>{message.content}</p>
                      {message.transaction && (
                        <div className="mt-4">
                          <Button onClick={() => setPendingTransaction(message.transaction)}>
                            <Send className="mr-2" />
                            Confirm Transaction
                          </Button>
                        </div>
                      )}
                  </div>
                  {message.role === 'user' && (
                      <Avatar className="w-8 h-8 border">
                          <AvatarImage src="https://picsum.photos/50" data-ai-hint="person" alt="User" />
                          <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                  )}
                  </div>
              ))}
              {isSubmitting && (
                   <div className="flex items-start gap-4">
                      <Avatar className="w-8 h-8 border">
                          <AvatarFallback><Bot className="w-5 h-5" /></AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                      </div>
                  </div>
              )}
              </div>
          </ScrollArea>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="relative overflow-hidden rounded-lg border bg-card focus-within:ring-1 focus-within:ring-ring">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="e.g., Send 0.1 BTC to my friend"
                        className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                        disabled={isSubmitting || !stxAddress}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center p-3 pt-0">
                 <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isSubmitting || !stxAddress}>
                  Send
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={!!pendingTransaction} onOpenChange={(open) => !open && setPendingTransaction(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the transaction details below. Clicking 'Confirm' will open your wallet to approve the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {pendingTransaction && (
            <div className="text-sm bg-muted/50 rounded-lg p-4 space-y-2">
              <p><strong>Action:</strong> Send</p>
              <p><strong>Amount:</strong> {pendingTransaction.amount} {pendingTransaction.asset}</p>
              <p><strong>Recipient:</strong> <span className="font-mono text-xs break-all">{pendingTransaction.recipient}</span></p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTransaction(undefined)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmTransaction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
