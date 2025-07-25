import React from 'react';

export default function DebugTest() {
  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold">Background Debug Test</h2>
      
      {/* Test CSS variables directly */}
      <div style={{ backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }} className="p-4 border">
        Direct CSS variable: var(--card)
      </div>
      
      {/* Test Tailwind classes */}
      <div className="bg-card text-card-foreground p-4 border border-border">
        Tailwind bg-card class
      </div>
      
      {/* Test with fixed colors */}
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 border">
        Fixed colors (white/gray-800)
      </div>
      
      {/* Test other semantic colors */}
      <div className="bg-background text-foreground p-4 border border-border">
        bg-background
      </div>
      
      <div className="bg-muted text-muted-foreground p-4 border border-border">
        bg-muted
      </div>
      
      {/* Simulated Card component */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-sm text-muted-foreground">This should have a solid background</p>
      </div>
      
      {/* Check if CSS variables are loaded */}
      <div className="text-sm font-mono">
        <div style={{
  '--card': '0 0% 100%',
  '--card-foreground': '230 15% 13%',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))'
}} className="p-4">
  Inline CSS variables test
</div>
<div className="p-4 bg-red-500 text-white">
  Basic Tailwind test - should be red
</div>

<div className="p-4 bg-card text-card-foreground border">
  CSS variable test - should have white background
</div>
        <div>CSS Variable Values:</div>
        <div>--card: <span style={{backgroundColor: 'var(--card)'}} className="inline-block w-4 h-4 border"></span></div>
        <div>--background: <span style={{backgroundColor: 'var(--background)'}} className="inline-block w-4 h-4 border"></span></div>
        <div>--muted: <span style={{backgroundColor: 'var(--muted)'}} className="inline-block w-4 h-4 border"></span></div>
      </div>
    </div>
    
  );
}