'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function CustomAnalyticsPlaceholder() {
  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="text-center">
        <CardTitle>Custom Analytical Tools</CardTitle>
        <CardDescription>
          This space is reserved for your custom-built analytical components.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 h-48">
        <PlusCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">You can add your own charts and tools here.</p>
        <Button variant="outline">Add Custom Tool</Button>
      </CardContent>
    </Card>
  );
} 