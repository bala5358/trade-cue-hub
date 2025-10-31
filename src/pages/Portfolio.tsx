import { useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Target, Activity, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { portfolioService } from "@/services";
import type { Trade, PortfolioPerformance, WatchlistItem } from "@/types/portfolio.types";
import { SEO } from "@/components/SEO";

const Portfolio = memo(() => {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [performance, setPerformance] = useState<PortfolioPerformance | null>(null);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  
  const [newStock, setNewStock] = useState({ symbol: "", name: "", market: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tradesData, performanceData, watchlistData] = await Promise.all([
        portfolioService.getTrades({ pageSize: 20 }),
        portfolioService.getPerformance(),
        portfolioService.getWatchlist(),
      ]);
      setTrades(tradesData.data);
      setPerformance(performanceData);
      setWatchlist(watchlistData.data);
    } catch (error) {
      console.error('Failed to fetch portfolio data:', error);
      toast({
        title: "Error",
        description: "Failed to load portfolio data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleAddStock = useCallback(async () => {
    if (!newStock.symbol || !newStock.name || !newStock.market) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setAdding(true);
      await portfolioService.addToWatchlist({
        symbol: newStock.symbol,
        name: newStock.name,
        market: newStock.market,
      });
      
      setNewStock({ symbol: "", name: "", market: "" });
      
      // Refresh watchlist
      const watchlistData = await portfolioService.getWatchlist();
      setWatchlist(watchlistData.data);
      
      toast({
        title: "Stock Added",
        description: `${newStock.symbol} added to your watchlist`,
      });
    } catch (error) {
      console.error('Failed to add stock:', error);
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  }, [newStock, toast]);

  const handleRemoveStock = useCallback(async (id: string) => {
    try {
      await portfolioService.removeFromWatchlist(id);
      
      // Refresh watchlist
      const watchlistData = await portfolioService.getWatchlist();
      setWatchlist(watchlistData.data);
      
      toast({
        title: "Stock Removed",
        description: "Stock removed from your watchlist",
      });
    } catch (error) {
      console.error('Failed to remove stock:', error);
      toast({
        title: "Error",
        description: "Failed to remove stock. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-32 bg-muted rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Portfolio & Trading"
        description="Track your trading performance and manage your stock watchlist. View your trade history, profit/loss, and win rate statistics."
        keywords="portfolio tracker, trading history, stock watchlist, P&L, profit loss, trading performance"
      />
      <div className="container mx-auto px-4 py-8" role="main" aria-label="Portfolio and Trading">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Portfolio & Trading</h1>
          <p className="text-muted-foreground">
            Track your performance and manage your watchlist
          </p>
        </header>

        <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="manage">Manage Watchlist</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {performance && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-2xl font-bold">${performance.currentValue.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg p-3 ${performance.totalProfit >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    {performance.totalProfit >= 0 ? (
                      <TrendingUp className="h-6 w-6 text-success" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total P&L</p>
                    <p className={`text-2xl font-bold ${performance.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {performance.totalProfit >= 0 ? '+' : ''}${performance.totalProfit.toFixed(2)}
                    </p>
                    <p className={`text-xs ${performance.totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {performance.totalProfit >= 0 ? '+' : ''}{performance.totalProfitPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent/10 p-3">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold">{performance.winRate.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {performance.winningTrades}W / {performance.losingTrades}L
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Trades</p>
                    <p className="text-2xl font-bold">{performance.totalTrades}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Trade History</h2>
            {trades.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No trades yet.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {trades.map((trade) => (
                  <Card
                    key={trade.id}
                    className={`p-4 md:p-6 shadow-card border-l-4 ${
                      trade.profit >= 0 ? 'border-l-success' : 'border-l-destructive'
                    }`}
                  >
                    <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-6 md:gap-4 md:items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-lg">{trade.stock}</p>
                          <Badge variant="outline" className="text-xs">
                            {trade.market}
                          </Badge>
                        </div>
                        <Badge
                          variant={trade.action === 'BUY' ? 'default' : 'destructive'}
                          className={`text-xs ${
                            trade.action === 'BUY' ? 'bg-success hover:bg-success/90' : ''
                          }`}
                        >
                          {trade.action}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Entry Price</p>
                        <p className="font-semibold">${trade.entryPrice.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Exit Price</p>
                        <p className="font-semibold">${trade.exitPrice.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                        <p className="font-semibold">{trade.quantity.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Investment</p>
                        <p className="font-semibold">
                          ${(trade.quantity * trade.entryPrice).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">P&L</p>
                        <div>
                          <p className={`font-bold ${trade.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}
                          </p>
                          <p className={`text-xs ${trade.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {trade.profit >= 0 ? '+' : ''}{trade.profitPercentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-4">
                      <p className="text-xs text-muted-foreground">
                        {new Date(trade.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Manage Watchlist Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Stock to Watchlist</CardTitle>
                <CardDescription>
                  Add stocks you want to track
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="symbol">Stock Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., AAPL"
                    value={newStock.symbol}
                    onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Apple Inc."
                    value={newStock.name}
                    onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="market">Market</Label>
                  <Input
                    id="market"
                    placeholder="e.g., NASDAQ"
                    value={newStock.market}
                    onChange={(e) => setNewStock({ ...newStock, market: e.target.value.toUpperCase() })}
                  />
                </div>
                <Button onClick={handleAddStock} className="w-full" disabled={adding}>
                  <Plus className="mr-2 h-4 w-4" />
                  {adding ? 'Adding...' : 'Add Stock'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Watchlist ({watchlist.length})</CardTitle>
                <CardDescription>
                  Stocks you're currently tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                {watchlist.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No stocks in watchlist. Add some to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {watchlist.map((stock) => (
                      <div
                        key={stock.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                      >
                        <div>
                          <p className="font-semibold">{stock.symbol}</p>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                          <p className="text-xs text-muted-foreground">{stock.market}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStock(stock.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
});

Portfolio.displayName = 'Portfolio';

export default Portfolio;