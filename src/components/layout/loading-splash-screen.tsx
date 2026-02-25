
'use client';

import { DocXIcon } from '../icons';

export function LoadingSplashScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <DocXIcon className="h-20 w-20 text-primary animate-bounce" />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-primary/20 rounded-full blur-sm animate-pulse" />
        </div>
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-4xl font-bold font-headline text-foreground tracking-tight">
            DocX
          </h1>
          <div className="mt-2 flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
