import { useState, useEffect } from "react";


const messages = [
  "Looking at your growth…",
  "Understanding your team…",
  "Reviewing your systems…",
  "Checking your workload…",
  "Measuring clarity & alignment…",
  "Putting it all together…",
];

const AnalyzingScreen = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <div className="text-center space-y-8">
        {/* Logo */}


        <div className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground">
            Getting your results ready…
          </h2>
          <p className="text-muted-foreground text-sm animate-in fade-in duration-500" key={msgIndex}>
            {messages[msgIndex]}
          </p>
        </div>

        {/* Scanning bar */}
        <div className="w-64 mx-auto h-1 bg-secondary rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-primary rounded-full animate-scan-line" />
        </div>
      </div>
    </div>
  );
};

export default AnalyzingScreen;
