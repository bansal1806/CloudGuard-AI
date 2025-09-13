'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Server, Database, HardDrive, Network, RefreshCw, Play, Pause, Square,
  MoreHorizontal, Eye, Settings, TrendingUp, Activity, AlertCircle,
  CheckCircle2, Clock, DollarSign, Gauge, BarChart3, Filter, Search,
  Download, Upload, Zap, Brain, Shield, Globe, Monitor, Layers
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

// Enhanced Resource Management interfaces
interface CloudResourceDetails {
  id: string
  externalId: string
  name: string
  type: 'compute' | 'database' | 'storage' | 'network' | 'container' | 'serverless'
  provider: 'aws' | 'azure' | 'gcp'
  status: 'running' | 'stopped' | 'pending' | 'error' | 'maintenance'
  region: string
  cost: {
    monthly: number
    daily: number
    hourly: number
  }
  utilization: {
    cpu: number
    memory: number
    disk: number
    network: {
      incoming: number
      outgoing: number
    }
  }
  digitalTwin: {
    enabled: boolean
    status: 'active' | 'inactive' | 'syncing'
    accuracy: number
    predictions: number
    lastSync: Date
  }
  performance: {
    responseTime: number
    uptime: number
    errorRate: number
    throughput: number
  }
  security: {
    score: number
    vulnerabilities: number
    lastScan: Date
  }
  tags: Record<string, string>
  lastSync: Date
  createdAt: Date
}

interface ResourceMetrics {
  totalResources: number
  runningResources: number
  digitalTwinsActive: number
  totalMonthlyCost: number
  averageUtilization: number
  securityScore: number
}

export function EnhancedResourceManagement() {
  const [resources, setResources] = useState<CloudResourceDetails[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedResource, setSelectedResource] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProvider, setFilterProvider] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Initialize resources
  const initializeResources = useCallback(() => {
    const initialResources: CloudResourceDetails[] = [
      {
        id: 'res-web-server-01',
        externalId: 'i-1234567890abcdef0',
        name: 'web-server-01',
        type: 'compute',
        provider: 'aws',
        status: 'running',
        region: 'us-east-1',
        cost: {
          monthly: 45.30,
          daily: 1.51,
          hourly: 0.063
        },
        utilization: {
          cpu: 67.2,
          memory: 72.8,
          disk: 34.5,
          network: {
            incoming: 125.4,
            outgoing: 89.7
          }
        },
        digitalTwin: {
          enabled: false,
          status: 'inactive',
          accuracy: 0,
          predictions: 0,
          lastSync: new Date()
        },
        performance: {
          responseTime: 45,
          uptime: 99.95,
          errorRate: 0.02,
          throughput: 1250
        },
        security: {
          score: 87,
          vulnerabilities: 2,
          lastScan: new Date(Date.now() - 2 * 60 * 1000)
        },
        tags: {
          environment: 'production',
          team: 'frontend',
          project: 'cloudguard'
        },
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'res-production-database',
        externalId: 'db-prod-mysql-01',
        name: 'production-database',
        type: 'database',
        provider: 'aws',
        status: 'running',
        region: 'us-east-1',
        cost: {
          monthly: 127.50,
          daily: 4.25,
          hourly: 0.177
        },
        utilization: {
          cpu: 89.3,
          memory: 78.6,
          disk: 67.2,
          network: {
            incoming: 89.3,
            outgoing: 156.7
          }
        },
        digitalTwin: {
          enabled: true,
          status: 'active',
          accuracy: 94.2,
          predictions: 15,
          lastSync: new Date(Date.now() - 4 * 60 * 1000)
        },
        performance: {
          responseTime: 12,
          uptime: 99.98,
          errorRate: 0.001,
          throughput: 890
        },
        security: {
          score: 94,
          vulnerabilities: 0,
          lastScan: new Date(Date.now() - 15 * 60 * 1000)
        },
        tags: {
          environment: 'production',
          team: 'backend',
          backup: 'enabled'
        },
        lastSync: new Date(Date.now() - 4 * 60 * 1000),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'res-app-server-02',
        externalId: 'vm-app-server-02',
        name: 'app-server-02',
        type: 'compute',
        provider: 'azure',
        status: 'running',
        region: 'eastus',
        cost: {
          monthly: 67.80,
          daily: 2.26,
          hourly: 0.094
        },
        utilization: {
          cpu: 45.7,
          memory: 58.3,
          disk: 28.9,
          network: {
            incoming: 67.8,
            outgoing: 92.1
          }
        },
        digitalTwin: {
          enabled: true,
          status: 'active',
          accuracy: 91.8,
          predictions: 8,
          lastSync: new Date(Date.now() - 4 * 60 * 1000)
        },
        performance: {
          responseTime: 38,
          uptime: 99.92,
          errorRate: 0.015,
          throughput: 745
        },
        security: {
          score: 89,
          vulnerabilities: 1,
          lastScan: new Date(Date.now() - 10 * 60 * 1000)
        },
        tags: {
          environment: 'production',
          team: 'backend',
          region: 'east'
        },
        lastSync: new Date(Date.now() - 4 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'res-backup-storage',
        externalId: 'storage-backup-01',
        name: 'backup-storage',
        type: 'storage',
        provider: 'gcp',
        status: 'running',
        region: 'us-central1',
        cost: {
          monthly: 23.45,
          daily: 0.78,
          hourly: 0.033
        },
        utilization: {
          cpu: 5.2,
          memory: 12.8,
          disk: 78.4,
          network: {
            incoming: 12.3,
            outgoing: 89.6
          }
        },
        digitalTwin: {
          enabled: false,
          status: 'inactive',
          accuracy: 0,
          predictions: 0,
          lastSync: new Date()
        },
        performance: {
          responseTime: 8,
          uptime: 99.99,
          errorRate: 0.0001,
          throughput: 234
        },
        security: {
          score: 96,
          vulnerabilities: 0,
          lastScan: new Date(Date.now() - 5 * 60 * 1000)
        },
        tags: {
          environment: 'production',
          type: 'backup',
          retention: '7-years'
        },
        lastSync: new Date(Date.now() - 3 * 60 * 1000),
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'res-main-load-balancer',
        externalId: 'lb-main-01',
        name: 'main-load-balancer',
        type: 'network',
        provider: 'aws',
        status: 'running',
        region: 'us-east-1',
        cost: {
          monthly: 18.90,
          daily: 0.63,
          hourly: 0.026
        },
        utilization: {
          cpu: 23.4,
          memory: 35.7,
          disk: 15.2,
          network: {
            incoming: 234.5,
            outgoing: 198.3
          }
        },
        digitalTwin: {
          enabled: false,
          status: 'inactive',
          accuracy: 0,
          predictions: 0,
          lastSync: new Date()
        },
        performance: {
          responseTime: 3,
          uptime: 99.97,
          errorRate: 0.005,
          throughput: 2100
        },
        security: {
          score: 92,
          vulnerabilities: 0,
          lastScan: new Date(Date.now() - 8 * 60 * 1000)
        },
        tags: {
          environment: 'production',
          type: 'load-balancer',
          ssl: 'enabled'
        },
        lastSync: new Date(Date.now() - 1 * 60 * 1000),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      }
    ]

    setResources(initialResources)
    setIsLoading(false)
    setLastUpdate(new Date())
  }, [])

  // Real-time metrics update
  const updateResourceMetrics = useCallback(() => {
    if (!autoRefresh) return

    setResources(prev => prev.map(resource => {
      const now = Date.now()
      const timeVariation = Math.sin(now / 20000) * 10 // 20-second cycles
      const randomFactor = (Math.random() - 0.5) * 8

      const updatedUtilization = {
        cpu: Math.max(5, Math.min(95, resource.utilization.cpu + timeVariation + randomFactor)),
        memory: Math.max(10, Math.min(90, resource.utilization.memory + timeVariation * 0.8 + randomFactor * 0.6)),
        disk: Math.max(5, Math.min(85, resource.utilization.disk + (Math.random() - 0.5) * 1)),
        network: {
          incoming: Math.max(0, resource.utilization.network.incoming + (Math.random() - 0.5) * 30),
          outgoing: Math.max(0, resource.utilization.network.outgoing + (Math.random() - 0.5) * 25)
        }
      }

      const updatedPerformance = {
        responseTime: Math.max(1, Math.min(200, resource.performance.responseTime + (Math.random() - 0.5) * 5)),
        uptime: Math.max(99.5, Math.min(100, resource.performance.uptime + (Math.random() - 0.5) * 0.02)),
        errorRate: Math.max(0, Math.min(1, resource.performance.errorRate + (Math.random() - 0.5) * 0.01)),
        throughput: Math.max(100, resource.performance.throughput + Math.floor((Math.random() - 0.5) * 200))
      }

      // Update Digital Twin predictions if enabled
      const updatedDigitalTwin = resource.digitalTwin.enabled ? {
        ...resource.digitalTwin,
        predictions: Math.max(0, resource.digitalTwin.predictions + Math.floor((Math.random() - 0.7) * 3)),
        accuracy: Math.max(70, Math.min(99, resource.digitalTwin.accuracy + (Math.random() - 0.5) * 2)),
        lastSync: new Date()
      } : resource.digitalTwin

      return {
        ...resource,
        utilization: updatedUtilization,
        performance: updatedPerformance,
        digitalTwin: updatedDigitalTwin,
        lastSync: new Date()
      }
    }))

    setLastUpdate(new Date())
  }, [autoRefresh])

  // Initialize resources on mount
  useEffect(() => {
    initializeResources()
  }, [initializeResources])

  // Auto-refresh every 3 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(updateResourceMetrics, 3000)
    return () => clearInterval(interval)
  }, [autoRefresh, updateResourceMetrics])

  // Refresh resources manually
  const refreshResources = async () => {
    setIsRefreshing(true)
    toast.info('Refreshing resource data...')
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    updateResourceMetrics()
    
    setIsRefreshing(false)
    toast.success('Resource data refreshed successfully!')
  }

  // Toggle Digital Twin for a resource
  const toggleDigitalTwin = async (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId)
    if (!resource) return

    setResources(prev => prev.map(r => 
      r.id === resourceId 
        ? {
            ...r,
            digitalTwin: {
              ...r.digitalTwin,
              enabled: !r.digitalTwin.enabled,
              status: !r.digitalTwin.enabled ? 'syncing' : 'inactive',
              accuracy: !r.digitalTwin.enabled ? 85 : 0,
              predictions: !r.digitalTwin.enabled ? Math.floor(Math.random() * 10) + 5 : 0,
              lastSync: new Date()
            }
          }
        : r
    ))

    // Simulate sync process
    if (!resource.digitalTwin.enabled) {
      setTimeout(() => {
        setResources(prev => prev.map(r => 
          r.id === resourceId 
            ? { ...r, digitalTwin: { ...r.digitalTwin, status: 'active' } }
            : r
        ))
        toast.success(`Digital Twin activated for ${resource.name}`)
      }, 2000)
    } else {
      toast.info(`Digital Twin deactivated for ${resource.name}`)
    }
  }

  // Control resource (start/stop/restart)
  const controlResource = async (resourceId: string, action: 'start' | 'stop' | 'restart') => {
    const resource = resources.find(r => r.id === resourceId)
    if (!resource) return

    setResources(prev => prev.map(r => 
      r.id === resourceId 
        ? { ...r, status: action === 'stop' ? 'stopped' : 'pending' }
        : r
    ))

    toast.info(`${action.charAt(0).toUpperCase() + action.slice(1)}ing ${resource.name}...`)

    // Simulate action
    setTimeout(() => {
      setResources(prev => prev.map(r => 
        r.id === resourceId 
          ? { ...r, status: action === 'stop' ? 'stopped' : 'running' }
          : r
      ))
      toast.success(`${resource.name} ${action}ed successfully`)
    }, 2000)
  }

  // Filter resources
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.externalId.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesProvider = filterProvider === 'all' || resource.provider === filterProvider
      const matchesStatus = filterStatus === 'all' || resource.status === filterStatus
      
      return matchesSearch && matchesProvider && matchesStatus
    })
  }, [resources, searchTerm, filterProvider, filterStatus])

  // Calculate metrics
  const metrics: ResourceMetrics = useMemo(() => {
    return {
      totalResources: resources.length,
      runningResources: resources.filter(r => r.status === 'running').length,
      digitalTwinsActive: resources.filter(r => r.digitalTwin.enabled).length,
      totalMonthlyCost: resources.reduce((sum, r) => sum + r.cost.monthly, 0),
      averageUtilization: resources.reduce((sum, r) => sum + (r.utilization.cpu + r.utilization.memory) / 2, 0) / resources.length || 0,
      securityScore: resources.reduce((sum, r) => sum + r.security.score, 0) / resources.length || 0
    }
  }, [resources])

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'aws': return '🟠'
      case 'azure': return '🔵'
      case 'gcp': return '🟢'
      default: return '☁️'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'compute': return <Server className="w-5 h-5" />
      case 'database': return <Database className="w-5 h-5" />
      case 'storage': return <HardDrive className="w-5 h-5" />
      case 'network': return <Network className="w-5 h-5" />
      case 'container': return <Layers className="w-5 h-5" />
      case 'serverless': return <Zap className="w-5 h-5" />
      default: return <Server className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100 border-green-200'
      case 'stopped': return 'text-red-600 bg-red-100 border-red-200'
      case 'pending': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'error': return 'text-red-600 bg-red-100 border-red-200'
      case 'maintenance': return 'text-blue-600 bg-blue-100 border-blue-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Monitor className="w-6 h-6 text-green-600" />
              <CardTitle className="text-xl">Resource Management</CardTitle>
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                Comprehensive resource monitoring and control
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <Activity className={`w-4 h-4 mr-1 ${autoRefresh ? 'text-green-600' : 'text-gray-400'}`} />
                {autoRefresh ? 'Live' : 'Paused'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshResources}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalResources}</div>
              <div className="text-sm text-blue-700">Total Resources</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{metrics.runningResources}</div>
              <div className="text-sm text-green-700">Running</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{metrics.digitalTwinsActive}</div>
              <div className="text-sm text-purple-700">Digital Twins</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{formatCurrency(metrics.totalMonthlyCost)}</div>
              <div className="text-sm text-orange-700">Total Cost/Month</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{metrics.averageUtilization.toFixed(1)}%</div>
              <div className="text-sm text-yellow-700">Avg Utilization</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{metrics.securityScore.toFixed(0)}</div>
              <div className="text-sm text-red-700">Security Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Providers</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">GCP</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
              <option value="pending">Pending</option>
              <option value="error">Error</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Resource Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cloud Resources</span>
            <Badge variant="outline">
              {filteredResources.length} resources across 3 providers
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Resource</th>
                  <th className="text-left p-3 font-medium">Provider</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Region</th>
                  <th className="text-left p-3 font-medium">Cost/Month</th>
                  <th className="text-left p-3 font-medium">Utilization</th>
                  <th className="text-left p-3 font-medium">Digital Twin</th>
                  <th className="text-left p-3 font-medium">Last Sync</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredResources.map((resource, index) => (
                    <motion.tr
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div>
                            <div className="font-medium">{resource.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {resource.externalId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getProviderIcon(resource.provider)}</span>
                          <span className="uppercase text-sm font-medium">
                            {resource.provider}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={`${getStatusColor(resource.status)} uppercase text-xs`}>
                          {resource.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span className="text-sm">{resource.region}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-green-600">
                          {formatCurrency(resource.cost.monthly)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>CPU:</span>
                            <span>{resource.utilization.cpu.toFixed(0)}%</span>
                          </div>
                          <Progress value={resource.utilization.cpu} className="h-2 w-16" />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          {resource.digitalTwin.enabled ? (
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                <Brain className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {resource.digitalTwin.accuracy.toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                              None
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(resource.lastSync)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          {resource.digitalTwin.enabled ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleDigitalTwin(resource.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Brain className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleDigitalTwin(resource.id)}
                              className="h-8 px-2 text-xs"
                            >
                              Enable Twin
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => controlResource(resource.id, resource.status === 'running' ? 'stop' : 'start')}
                            className="h-8 w-8 p-0"
                          >
                            {resource.status === 'running' ? 
                              <Pause className="w-4 h-4" /> : 
                              <Play className="w-4 h-4" />
                            }
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Resource Details Panel */}
      {selectedResource && (
        <Card>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Detailed resource information would go here */}
            <p className="text-muted-foreground">
              Detailed information for selected resource: {selectedResource}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
