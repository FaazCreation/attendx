'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Reports
        </h1>
        <Button>
            <Download className="mr-2 h-4 w-4" />
            Export All Data
          </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Reporting features are coming soon. You'll be able to generate detailed reports on member attendance and engagement.</p>
        </CardContent>
      </Card>
    </div>
  );
}
