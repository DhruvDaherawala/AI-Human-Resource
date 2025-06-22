'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Link href="/jobs/new" passHref>
          <Button variant="outline" className="w-full h-full">
            <div className="flex flex-col items-center justify-center p-6">
              <PlusCircle className="h-8 w-8 mb-2" />
              <span>Create New Job</span>
            </div>
          </Button>
        </Link>
        <Link href="/resume" passHref>
          <Button variant="outline" className="w-full h-full">
            <div className="flex flex-col items-center justify-center p-6">
              <UploadCloud className="h-8 w-8 mb-2" />
              <span>Upload Resume</span>
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 