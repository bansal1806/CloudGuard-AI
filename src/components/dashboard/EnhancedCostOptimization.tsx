'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DollarSign, TrendingUp, TrendingDown, Zap, Target, Brain, BarChart3,
  AlertCircle, CheckCircle2, Clock, Settings, RefreshCw, Play, Pause,
  ArrowUpRight, ArrowDownRight, Download, Calendar, Award, Shield,
  Activity, Gauge, PieChart, LineChart, Timer, Users, Server, Database
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

// Enhanced Cost Optimization interfaces
interface CostOptimizationRecommendation {
  id: string
  title: string
  description: string
  type: 'rightsizing' | 'reserved' | 'spot' | 'storage' | 'scheduling' | 'migration'
  status: 'available' | 'applied' | 'scheduled' | 'in_progress' | 'rejected'
  impact: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  savings: {
    current: number
    optimized: number
    monthly: number
    annual: number
  }
  resources: string[]
  timeToImplement: number // hours
  riskLevel: 'low' | 'medium' | 'high'
  automationAvailable: boolean
  createdAt: Date
  lastUpdated: Date
}

interface CostMetrics {
  currentSpend: number
  budgetTotal: number
  budgetUsed: number
  totalSaved: number
  savingsGrowth: number
  potentialSavings: number
  optimizationScore: number
  efficencyRating: string
}

interface CostAIStatus {
  status: 'optimizing' | 'analyzing' | 'idle' | 'error'
  activeOptimizations: number
  readyOptimizations: number
  nextScanTime: Date
  analysisProgress: number
}

export function EnhancedCostOptimization() {
  const [recommendations, setRecommendations] = useState<CostOptimizationRecommendation[]>([])
  const [costMetrics, setCostMetrics] = useState<CostMetrics>({
    currentSpend: 7235,
    budgetTotal: 8500,
    budgetUsed: 85.1,
    totalSaved: 1309,
    savingsGrowth: 18,
    potentialSavings: 701.71,
    optimizationScore: 87.4,
    efficencyRating: 'Excellent'
  })
  const [aiStatus, setAiStatus] = useState<CostAIStatus>({
    status: 'optimizing',
    activeOptimizations: 4,
    readyOptimizations: 2,
    nextScanTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    analysisProgress: 73
  })
  const [isLoading, setIsLoading] = useState(true)
  const [autoOptimize, setAutoOptimize] = useState(false)
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Initialize cost optimization data
  const initializeCostData = useCallback(() => {
    const initialRecommendations: CostOptimizationRecommendation[] = [
      {
        id: 'rec-rightsizing-ec2',
        title: 'Rightsize EC2 Instances',
        description: 'Downsize 3 underutilized t3.large instances to t3.medium based on 30-day usage analysis',
        type: 'rightsizing',
        status: 'available',
        impact: 'medium',
        confidence: 94.3,
        savings: {
          current: 446.39,
          optimized: 228.15,
          monthly: 218.24,
          annual: 2618.88
        },
        resources: ['i-1234567890abcdef0', 'i-abcdef1234567890', 'i-567890abcdef1234'],
        timeToImplement: 2,
        riskLevel: 'low',
        automationAvailable: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'rec-storage-tiers',
        title: 'Optimize Storage Tiers',
        description: 'Move 500GB of infrequently accessed data to cheaper storage classes',
        type: 'storage',
        status: 'applied',
        impact: 'high',
        confidence: 88.1,
        savings: {
          current: 225.37,
          optimized: 87.20,
          monthly: 138.17,
          annual: 1658.04
        },
        resources: ['s3-bucket-logs', 's3-bucket-backups'],
        timeToImplement: 1,
        riskLevel: 'low',
        automationAvailable: true,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'rec-spot-instances',
        title: 'Use Spot Instances',
        description: 'Replace 5 on-demand instances with spot instances for development workloads',
        type: 'spot',
        status: 'scheduled',
        impact: 'high',
        confidence: 90.3,
        savings: {
          current: 671.47,
          optimized: 203.67,
          monthly: 467.80,
          annual: 5613.60
        },
        resources: ['i-dev-001', 'i-dev-002', 'i-dev-003', 'i-dev-004', 'i-dev-005'],
        timeToImplement: 4,
        riskLevel: 'medium',
        automationAvailable: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: 'rec-reserved-instances',
        title: 'Purchase Reserved Instances',
        description: 'Buy 1-year reserved instances for consistent production workloads',
        type: 'reserved',
        status: 'available',
        impact: 'high',
        confidence: 96.5,
        savings: {
          current: 1189.45,
          optimized: 720.00,
          monthly: 469.45,
          annual: 5633.40
        },
        resources: ['i-prod-web-01', 'i-prod-web-02', 'i-prod-api-01'],
        timeToImplement: 0.5,
        riskLevel: 'low',
        automationAvailable: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 15 * 60 * 1000)
      },
      {
        id: 'rec-scheduled-scaling',
        title: 'Implement Scheduled Scaling',
        description: 'Automatically scale down non-production resources during off-hours',
        type: 'scheduling',
        status: 'in_progress',
        impact: 'medium',
        confidence: 85.7,
        savings: {
          current: 234.56,
          optimized: 156.78,
          monthly: 77.78,
          annual: 933.36
        },
        resources: ['asg-dev-cluster', 'asg-staging-cluster'],
        timeToImplement: 3,
        riskLevel: 'low',
        automationAvailable: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        lastUpdated: new Date(Date.now() - 5 * 60 * 1000)
      }
    ]

    setRecommendations(initialRecommendations)
    setIsLoading(false)
    setLastUpdate(new Date())
  }, [])

  // Real-time cost metrics update
  const updateCostMetrics = useCallback(() => {
    setCostMetrics(prev => {
      const timeVariation = Math.sin(Date.now() / 30000) * 50 // 30-second cycles
      const randomFactor = (Math.random() - 0.5) * 20

      return {
        ...prev,
        currentSpend: Math.max(6000, Math.min(8000, prev.currentSpend + timeVariation + randomFactor)),
        totalSaved: Math.max(1000, prev.totalSaved + Math.floor((Math.random() - 0.3) * 50)),
        potentialSavings: Math.max(500, Math.min(1000, prev.potentialSavings + (Math.random() - 0.5) * 100)),
        optimizationScore: Math.max(80, Math.min(95, prev.optimizationScore + (Math.random() - 0.5) * 2))
      }
    })

    setAiStatus(prev => ({
      ...prev,
      analysisProgress: Math.min(100, prev.analysisProgress + Math.floor(Math.random() * 5)),
      activeOptimizations: Math.max(2, prev.activeOptimizations + Math.floor((Math.random() - 0.5) * 2))
    }))

    setLastUpdate(new Date())
  }, [])

  // Apply recommendation
  const applyRecommendation = async (recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId)
    if (!recommendation) return

    setRecommendations(prev => prev.map(r => 
      r.id === recommendationId 
        ? { ...r, status: 'in_progress' }
        : r
    ))

    toast.info(`Applying ${recommendation.title}...`)

    // Simulate application process
    setTimeout(() => {
      setRecommendations(prev => prev.map(r => 
        r.id === recommendationId 
          ? { ...r, status: 'applied', lastUpdated: new Date() }
          : r
      ))
      
      // Update cost metrics
      setCostMetrics(prev => ({
        ...prev,
        totalSaved: prev.totalSaved + recommendation.savings.monthly,
        potentialSavings: prev.potentialSavings - recommendation.savings.monthly
      }))

      toast.success(`${recommendation.title} applied successfully! Saved ${recommendation.savings.monthly.toFixed(2)}/month`)
    }, 3000)
  }

  // Schedule recommendation
  const scheduleRecommendation = async (recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId)
    if (!recommendation) return

    setRecommendations(prev => prev.map(r => 
      r.id === recommendationId 
        ? { ...r, status: 'scheduled', lastUpdated: new Date() }
        : r
    ))

    toast.success(`${recommendation.title} scheduled for implementation`)
  }

  // Auto-optimize function
  const runAutoOptimization = async () => {
    setAutoOptimize(true)
    toast.info('Starting auto-optimization process...')

    const availableRecommendations = recommendations.filter(r => 
      r.status === 'available' && 
      r.automationAvailable && 
      r.riskLevel === 'low' &&
      r.confidence > 90
    )

    for (const rec of availableRecommendations) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await applyRecommendation(rec.id)
    }

    setAutoOptimize(false)
    toast.success(`Auto-optimization complete! Applied ${availableRecommendations.length} recommendations`)
  }

  // Generate cost report
  const generateCostReport = async () => {
    toast.info('Generating comprehensive cost report...')
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate report generation and download
    const reportData = {
      generatedAt: new Date(),
      metrics: costMetrics,
      recommendations: recommendations,
      savings: recommendations.reduce((sum, r) => sum + (r.status === 'applied' ? r.savings.monthly : 0), 0)
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cost-optimization-report-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Cost report downloaded successfully!')
  }

  // Initialize on mount
  useEffect(() => {
    initializeCostData()
  }, [initializeCostData])

  // Auto-update metrics every 5 seconds
  useEffect(() => {
    const interval = setInterval(updateCostMetrics, 5000)
    return () => clearInterval(interval)
  }, [updateCostMetrics])

  // Calculated values
  const budgetRemaining = costMetrics.budgetTotal - costMetrics.currentSpend
  const savingsPercentage = (costMetrics.totalSaved / costMetrics.currentSpend) * 100

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'rightsizing': return <Server className="w-5 h-5" />
      case 'reserved': return <Award className="w-5 h-5" />
      case 'spot': return <Zap className="w-5 h-5" />
      case 'storage': return <Database className="w-5 h-5" />
      case 'scheduling': return <Clock className="w-5 h-5" />
      case 'migration': return <Target className="w-5 h-5" />
      default: return <BarChart3 className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'applied': return 'bg-green-100 text-green-700 border-green-200'
      case 'scheduled': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'in_progress': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low': return 'text-blue-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-orange-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-orange-600" />
              <CardTitle className="text-xl">Cost Optimization</CardTitle>
              <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                AI-powered cost analysis and optimization recommendations
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateCostReport}
              >
                <Download className="w-4 h-4 mr-1" />
                Cost Report
              </Button>
              <Button
                onClick={runAutoOptimization}
                disabled={autoOptimize}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Zap className={`w-4 h-4 mr-1 ${autoOptimize ? 'animate-pulse' : ''}`} />
                {autoOptimize ? 'Auto-Optimizing...' : 'Auto-Optimize'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {formatCurrency(costMetrics.potentialSavings)}
              </div>
              <div className="text-sm text-muted-foreground">Potential Savings</div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(costMetrics.currentSpend)}</div>
                <div className="text-sm text-muted-foreground">Current Spend</div>
                <div className="text-xs text-orange-600">{costMetrics.budgetUsed}% of budget</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(costMetrics.totalSaved)}
                </div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
                <div className="text-xs text-green-600">+{costMetrics.savingsGrowth}% this month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(budgetRemaining)}
                </div>
                <div className="text-sm text-muted-foreground">Budget Remaining</div>
                <div className="text-xs text-blue-600">{(100 - costMetrics.budgetUsed).toFixed(1)}% left</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Status Card */}
      <Card className="border-purple-500/20 bg-purple-500/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <span>Cost AI Status</span>
            <Badge className={`${
              aiStatus.status === 'optimizing' ? 'bg-green-100 text-green-700' :
              aiStatus.status === 'analyzing' ? 'bg-blue-100 text-blue-700' :
              aiStatus.status === 'error' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {aiStatus.status.charAt(0).toUpperCase() + aiStatus.status.slice(1)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-600">{aiStatus.activeOptimizations}</div>
              <div className="text-sm text-blue-700">Analyzing resources</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">{aiStatus.readyOptimizations}</div>
              <div className="text-sm text-green-700">Optimizations ready</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-bold text-orange-600">
                {Math.floor((aiStatus.nextScanTime.getTime() - Date.now()) / (60 * 60 * 1000))}h
              </div>
              <div className="text-sm text-orange-700">Next scan in</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-600">{costMetrics.optimizationScore.toFixed(1)}</div>
              <div className="text-sm text-purple-700">Optimization Score</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Analysis Progress:</span>
              <span>{aiStatus.analysisProgress}%</span>
            </div>
            <Progress value={aiStatus.analysisProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Recommendations</span>
            <Badge variant="outline">
              {recommendations.filter(r => r.status === 'available').length} Available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                          <Badge className={getStatusColor(recommendation.status)}>
                            {recommendation.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{recommendation.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div className="text-center p-2 bg-red-50 rounded border border-red-200">
                            <div className="font-bold text-red-600">
                              {formatCurrency(recommendation.savings.current)}
                            </div>
                            <div className="text-xs text-red-700">Current</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                            <div className="font-bold text-green-600">
                              {formatCurrency(recommendation.savings.optimized)}
                            </div>
                            <div className="text-xs text-green-700">Optimized</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                            <div className="font-bold text-blue-600">
                              {formatCurrency(recommendation.savings.monthly)}
                            </div>
                            <div className="text-xs text-blue-700">Monthly Savings</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded border border-purple-200">
                            <div className={`font-bold ${getImpactColor(recommendation.impact)}`}>
                              {recommendation.impact.toUpperCase()}
                            </div>
                            <div className="text-xs text-purple-700">Impact</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-muted-foreground">
                              Confidence: <span className="font-mono text-green-600">{recommendation.confidence.toFixed(1)}%</span>
                            </span>
                            <span className="text-muted-foreground">
                              Risk: <span className={`font-medium ${
                                recommendation.riskLevel === 'low' ? 'text-green-600' :
                                recommendation.riskLevel === 'medium' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>{recommendation.riskLevel}</span>
                            </span>
                            <span className="text-muted-foreground">
                              Time: <span className="font-mono">{recommendation.timeToImplement}h</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {recommendation.automationAvailable && (
                              <Badge variant="outline" className="text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Auto-Available
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {recommendation.status === 'available' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          onClick={() => applyRecommendation(recommendation.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Apply Now
                        </Button>
                        <Button
                          onClick={() => scheduleRecommendation(recommendation.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Calendar className="w-4 h-4 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
