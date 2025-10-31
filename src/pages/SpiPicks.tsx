import { useState, useEffect, useCallback, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { stockPicksService } from "@/services";
import type { StockPick } from "@/types/stock-picks.types";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";

const SpiPicks = memo(() => {
  const { toast } = useToast();
  const [picks, setPicks] = useState<StockPick[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgReturn, setAvgReturn] = useState(0);
  const [highConfidenceCount, setHighConfidenceCount] = useState(0);

  useEffect(() => {
    const fetchPicks = async () => {
      try {
        setLoading(true);
        const response = await stockPicksService.getStockPicks({ pageSize: 20 });
        setPicks(response.data);
        setAvgReturn(response.summary.avgPotentialReturn);
        setHighConfidenceCount(response.summary.highConfidenceCount);
      } catch (error) {
        console.error('Failed to fetch stock picks:', error);
        toast({
          title: "Error",
          description: "Failed to load stock picks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPicks();
  }, [toast]);

  const getRecommendationColor = useCallback((rec: string) => {
    switch (rec) {
      case "Buy":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Sell":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Hold":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      default:
        return "";
    }
  }, []);

  const getConfidenceBadge = useCallback((confidence: string) => {
    const stars = confidence === "High" ? 3 : confidence === "Medium" ? 2 : 1;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
        ))}
      </div>
    );
  }, []);

  return (
    <>
      <SEO
        title="SPi Picks"
        description="Expert-curated stock recommendations from our team of analysts. Get high-confidence stock picks with detailed analysis for India and US markets."
        keywords="stock picks, stock recommendations, buy recommendations, expert analysis, stock analysis"
      />
      <div className="container mx-auto p-6 max-w-7xl" role="main" aria-label="Stock Picks">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">SPi Picks</h1>
        <p className="text-muted-foreground">
          Expert-curated stock recommendations from our team of analysts
        </p>
      </div>

      {/* Summary Stats */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Picks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{picks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Potential Return
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {avgReturn.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{highConfidenceCount}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Picks List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <CardHeader>
                <div className="h-24 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : picks.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No stock picks available at the moment.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {picks.map((pick) => (
            <Card key={pick.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl">{pick.symbol}</CardTitle>
                      <Badge className={getRecommendationColor(pick.recommendation)}>
                        {pick.recommendation}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {pick.name} • {pick.market}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      {getConfidenceBadge(pick.confidence)}
                    </div>
                    <p className="text-xs text-muted-foreground">{pick.confidence} Confidence</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Price</p>
                    <p className="text-lg font-semibold">${pick.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Target Price</p>
                    <p className="text-lg font-semibold">${pick.targetPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Potential Return</p>
                    <div className="flex items-center gap-1">
                      {pick.potentialReturn > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <p className={`text-lg font-semibold ${
                        pick.potentialReturn > 0 ? "text-green-500" : "text-red-500"
                      }`}>
                        {pick.potentialReturn > 0 ? "+" : ""}{pick.potentialReturn.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(pick.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Analysis</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {pick.reasoning}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  );
});

SpiPicks.displayName = 'SpiPicks';

export default SpiPicks;