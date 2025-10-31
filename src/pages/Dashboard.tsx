import { useState, useEffect, useMemo, memo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { signalsService } from "@/services";
import type { Signal, SignalStatistics } from "@/types/signals.types";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const Dashboard = memo(() => {
  const { toast } = useToast();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [stats, setStats] = useState<SignalStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [signalsResponse, statsResponse] = await Promise.all([
          signalsService.getSignals({ status: 'active', pageSize: 10 }),
          signalsService.getStatistics(),
        ]);
        setSignals(signalsResponse.data);
        setStats(statsResponse);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const signalDate = new Date(dateString);
    const diffMs = now.getTime() - signalDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <>
      <SEO
        title="Signal Dashboard"
        description="View real-time buy and sell signal recommendations for India and US equity markets. Track your active signals and trading statistics."
        keywords="trading dashboard, signal dashboard, buy signals, sell signals, equity signals, stock signals"
      />
      <div className="min-h-screen py-8" role="main" aria-label="Signal Dashboard">
        <div className="container mx-auto px-4 space-y-8">
          {/* Header */}
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Signal Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time buy and sell signal recommendations for India and US equity markets
          </p>
          </header>

          {/* Stats Cards */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6 shadow-card animate-pulse">
                  <div className="h-16 bg-muted rounded"></div>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" aria-label="Statistics Overview">
            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-success/10 p-3">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Signals</p>
                  <p className="text-2xl font-bold">{stats.activeSignals}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Profit</p>
                  <p className={`text-2xl font-bold ${stats.todayProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {stats.todayProfit >= 0 ? '+' : ''}₹{stats.todayProfit.toFixed(0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-destructive/10 p-3">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{stats.winRate.toFixed(0)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-accent/10 p-3">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{stats.avgResponseTime.toFixed(1)}s</p>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        {/* Signals List */}
        <section className="space-y-4" aria-label="Recent Trading Signals">
          <h2 className="text-2xl font-bold">Recent Signals</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6 shadow-card animate-pulse">
                  <div className="h-20 bg-muted rounded"></div>
                </Card>
              ))}
            </div>
          ) : signals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No active signals at the moment.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {signals.map((signal) => (
                <Card
                  key={signal.id}
                  className={`p-4 md:p-6 shadow-card hover:shadow-elevated transition-all border-l-4 ${
                    signal.action === "BUY"
                      ? "border-l-success"
                      : "border-l-destructive"
                  }`}
                >
                  <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4 md:items-center">
                    <div className="flex items-center justify-between md:block md:space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg">{signal.stock}</p>
                        <Badge variant="outline" className="text-xs">
                          {signal.market}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 md:mt-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(signal.createdAt)}
                      </p>
                    </div>

                  <div className="flex justify-center md:text-center">
                    <Badge
                      variant={signal.action === "BUY" ? "default" : "destructive"}
                      className={`text-sm px-4 py-1 ${
                        signal.action === "BUY"
                          ? "bg-success hover:bg-success/90"
                          : ""
                      }`}
                    >
                      {signal.action}
                    </Badge>
                  </div>

                    <div className="grid grid-cols-3 gap-4 md:contents">
                      <div>
                        <p className="text-xs text-muted-foreground">Entry Price</p>
                        <p className="font-semibold">
                          {signal.market === "India" ? "₹" : "$"}
                          {signal.price.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-semibold text-success">
                          {signal.market === "India" ? "₹" : "$"}
                          {signal.target.toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Stop Loss</p>
                        <p className="font-semibold text-destructive">
                          {signal.market === "India" ? "₹" : "$"}
                          {signal.stopLoss.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    </>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
