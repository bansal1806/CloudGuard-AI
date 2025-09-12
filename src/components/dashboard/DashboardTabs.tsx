'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Shield, 
  Eye, 
  Cloud, 
  Server, 
  DollarSign,
  AlertTriangle,
  BarChart3,
  Database,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import all dashboard components
import { RealTimeMetrics } from './RealTimeMetrics'
import { PredictiveAlerts } from './PredictiveAlerts'
import { CostOptimization } from './CostOptimization'
import { DataSourcesOverview } from './DataSourcesOverview'
import { RealTimeComparison } from './RealTimeComparison'
import { SecurityGuardian } from './SecurityGuardian'
import { DigitalTwinVisualization } from './DigitalTwinVisualization'
import { CloudProviderOverview } from './CloudProviderOverview'
import { ResourcesTable } from './ResourcesTable'

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Activity className="h-4 w-4" />,
      description: 'Real-time metrics and alerts'
    },
    {
      id: 'datasources',
      label: 'Data Sources',
      icon: <Database className="h-4 w-4" />,
      description: 'Real-time data comparison for judges'
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-4 w-4" />,
      description: 'Security monitoring and threats'
    },
    {
      id: 'twins',
      label: 'Digital Twins',
      icon: <Eye className="h-4 w-4" />,
      description: 'Infrastructure digital twins'
    },
    {
      id: 'cloud',
      label: 'Multi-Cloud',
      icon: <Cloud className="h-4 w-4" />,
      description: 'Cloud provider overview'
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <Server className="h-4 w-4" />,
      description: 'Resource management table'
    },
    {
      id: 'cost',
      label: 'Cost Optimization',
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Cost analysis and optimization'
    }
  ]

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>CloudGuard AI - Complete Dashboard</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Navigate through all available sections and components
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto p-1 bg-muted">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center space-y-1 p-3 h-auto data-[state=active]:bg-background"
                >
                  {tab.icon}
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            <div className="mt-6">
              {/* Overview Tab - Real-time Metrics & Alerts */}
              <TabsContent value="overview" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Real-Time Overview</h2>
                  <p className="text-sm text-muted-foreground">Live metrics and predictive alerts</p>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <RealTimeMetrics />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PredictiveAlerts />
                  </motion.div>
                </div>
              </TabsContent>

              {/* Data Sources Tab */}
              <TabsContent value="datasources" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Real-Time Data Sources</h2>
                  <p className="text-sm text-muted-foreground">Live data comparison and sources overview</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <RealTimeComparison />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <DataSourcesOverview />
                </motion.div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Security Guardian</h2>
                  <p className="text-sm text-muted-foreground">AI-powered security monitoring and threat detection</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SecurityGuardian />
                </motion.div>
              </TabsContent>

              {/* Digital Twins Tab */}
              <TabsContent value="twins" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Digital Twin Infrastructure</h2>
                  <p className="text-sm text-muted-foreground">Virtual replicas of your cloud infrastructure</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <DigitalTwinVisualization />
                </motion.div>
              </TabsContent>

              {/* Multi-Cloud Tab */}
              <TabsContent value="cloud" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Multi-Cloud Management</h2>
                  <p className="text-sm text-muted-foreground">Unified cloud provider overview and management</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CloudProviderOverview />
                </motion.div>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Resource Management</h2>
                  <p className="text-sm text-muted-foreground">Comprehensive resource monitoring and control</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ResourcesTable />
                </motion.div>
              </TabsContent>

              {/* Cost Optimization Tab */}
              <TabsContent value="cost" className="space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">Cost Optimization</h2>
                  <p className="text-sm text-muted-foreground">AI-powered cost analysis and optimization recommendations</p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CostOptimization />
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
