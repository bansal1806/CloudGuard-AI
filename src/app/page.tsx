'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Cloud, 
  Zap, 
  Shield, 
  TrendingUp, 
  Activity,
  Server,
  Database,
  Network,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Brain,
  Eye,
  Cpu
} from 'lucide-react'

import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { CloudProviderOverview } from '@/components/dashboard/CloudProviderOverview'
import { ResourcesTable } from '@/components/dashboard/ResourcesTable'
import { DigitalTwinVisualization } from '@/components/dashboard/DigitalTwinVisualization'
import { RealTimeMetrics } from '@/components/dashboard/RealTimeMetrics'
import { PredictiveAlerts } from '@/components/dashboard/PredictiveAlerts'
import { CostOptimization } from '@/components/dashboard/CostOptimization'
import { SecurityGuardian } from '@/components/dashboard/SecurityGuardian'

export default function DashboardPage() {
  const [dashboardMetrics, setDashboardMetrics] = useState({
    totalResources: 156,
    activeAlerts: 3,
    costSavings: 42.5,
    uptime: 99.97,
    predictiveAccuracy: 94.2,
    digitalTwins: 12,
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Simulate real-time updates
    const updateInterval = setInterval(() => {
      setDashboardMetrics(prev => ({
        ...prev,
        activeAlerts: Math.floor(Math.random() * 5),
        uptime: 99.9 + Math.random() * 0.09,
        predictiveAccuracy: 90 + Math.random() * 10,
      }))
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(updateInterval)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <Brain className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold ai-gradient-text">Initializing CloudGuard AI</h2>
            <p className="text-muted-foreground">Connecting to Digital Twin ecosystem...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <DashboardHeader />

      {/* Main Dashboard Content */}
      <main className="container-fluid py-6 space-y-6">
        {/* Hero Metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          <MetricCard
            title="Total Resources"
            value={dashboardMetrics.totalResources.toString()}
            icon={<Server className="w-5 h-5" />}
            trend="+12%"
            type="info"
          />
          <MetricCard
            title="Active Alerts"
            value={dashboardMetrics.activeAlerts.toString()}
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="-25%"
            type={dashboardMetrics.activeAlerts > 5 ? "error" : "warning"}
          />
          <MetricCard
            title="Cost Savings"
            value={`$${dashboardMetrics.costSavings}K`}
            icon={<DollarSign className="w-5 h-5" />}
            trend="+18%"
            type="success"
          />
          <MetricCard
            title="Uptime"
            value={`${dashboardMetrics.uptime.toFixed(2)}%`}
            icon={<CheckCircle className="w-5 h-5" />}
            trend="+0.1%"
            type="success"
          />
          <MetricCard
            title="AI Accuracy"
            value={`${dashboardMetrics.predictiveAccuracy.toFixed(1)}%`}
            icon={<Brain className="w-5 h-5" />}
            trend="+2.3%"
            type="info"
          />
          <MetricCard
            title="Digital Twins"
            value={dashboardMetrics.digitalTwins.toString()}
            icon={<Eye className="w-5 h-5" />}
            trend="+3"
            type="info"
          />
        </motion.div>

        {/* Digital Twin Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DigitalTwinVisualization />
        </motion.div>

        {/* Cloud Provider Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CloudProviderOverview />
        </motion.div>

        {/* Real-time Metrics and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <RealTimeMetrics />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PredictiveAlerts />
          </motion.div>
        </div>

        {/* Security and Cost Optimization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SecurityGuardian />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CostOptimization />
          </motion.div>
        </div>

        {/* Resources Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ResourcesTable />
        </motion.div>
      </main>
    </div>
  )
}
