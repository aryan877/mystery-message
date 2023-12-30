'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Message } from '@/model/User';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast'; 
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void; 
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id); 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter className="text-right">
        {isLoading ? (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting...
          </Button>
        ) : (
          <Button variant='destructive' onClick={handleDelete}>
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
