'use client'

import { motion } from 'framer-motion'
import { 
  Server, 
  Database, 
  HardDrive, 
  Network, 
  MoreHorizontal,
  Play,
  Square,
  Trash2,
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCloudResources } from '@/hooks/useCloudResources'

export function ResourcesTable() {
  const { 
    resources, 
    isLoading, 
    executeAction, 
    isExecutingAction,
    refetch 
  } = useCloudResources({ autoRefresh: true })
  const handleResourceAction = (resourceId: string, action: string) => {
    executeAction({ resourceId, action })
  }

  const getResourceIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'COMPUTE': return <Server className="w-4 h-4" />
      case 'DATABASE': return <Database className="w-4 h-4" />
      case 'STORAGE': return <HardDrive className="w-4 h-4" />
      case 'NETWORK': return <Network className="w-4 h-4" />
      default: return <Server className="w-4 h-4" />
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'aws': return 'text-orange-500 bg-orange-500/10'
      case 'azure': return 'text-blue-500 bg-blue-500/10'
      case 'gcp': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500 bg-green-500/10'
      case 'stopped': return 'text-red-500 bg-red-500/10'
      case 'pending': return 'text-yellow-500 bg-yellow-500/10'
      case 'error': return 'text-red-500 bg-red-500/20'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 30) return 'text-blue-500'
    if (utilization < 70) return 'text-green-500'
    if (utilization < 90) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return 'just now'
    if (minutes === 1) return '1m ago'
    return `${minutes}m ago`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <span>Cloud Resources</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <div className="text-sm text-muted-foreground">
              {resources.length} resources across 3 providers
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">Resource</th>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">Provider</th>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">Status</th>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">Region</th>
                <th className="text-right p-3 font-medium text-sm text-muted-foreground">Cost/Month</th>
                <th className="text-right p-3 font-medium text-sm text-muted-foreground">Utilization</th>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">Digital Twin</th>
                <th className="text-left p-3 font-medium text-sm text-muted-foreground">Last Sync</th>
                <th className="text-right p-3 font-medium text-sm text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => (
                <motion.tr
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-muted">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{resource.name}</div>
                        <div className="text-xs text-muted-foreground">{resource.externalId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(resource.provider.toLowerCase())}`}>
                      {resource.provider}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                      {resource.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-sm text-muted-foreground">{resource.region}</td>
                  <td className="p-3 text-right font-mono text-sm">${resource.cost.toFixed(2)}</td>
                  <td className="p-3 text-right">
                    <span className={`font-medium text-sm ${getUtilizationColor(resource.utilization?.cpu || 0)}`}>
                      {resource.utilization?.cpu?.toFixed(0) || 0}%
                    </span>
                  </td>
                  <td className="p-3">
                    {Math.random() > 0.5 ? (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-digital-twin" />
                        <span className="text-xs text-digital-twin font-medium">Active</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {formatTimeAgo(new Date(resource.lastSyncAt))}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleResourceAction(resource.id, 'start')}
                        disabled={isExecutingAction}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleResourceAction(resource.id, 'stop')}
                        disabled={isExecutingAction}
                      >
                        <Square className="w-3 h-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleResourceAction(resource.id, 'restart')}
                        disabled={isExecutingAction}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-muted/30 rounded-lg p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-background">
                    {getResourceIcon(resource.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{resource.name}</div>
                    <div className="text-xs text-muted-foreground">{resource.externalId}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleResourceAction(resource.id, 'start')}
                    disabled={isExecutingAction}
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => handleResourceAction(resource.id, 'stop')}
                    disabled={isExecutingAction}
                  >
                    <Square className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Provider</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProviderColor(resource.provider.toLowerCase())}`}>
                    {resource.provider}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.status)}`}>
                    {resource.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Cost/Month</div>
                  <div className="font-mono font-medium">${resource.cost.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Utilization</div>
                  <span className={`font-medium ${getUtilizationColor(resource.utilization?.cpu || 0)}`}>
                    {resource.utilization?.cpu?.toFixed(0) || 0}%
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                <div>
                  <span className="font-medium">Region:</span> {resource.region}
                </div>
                <div>
                  <span className="font-medium">Sync:</span> {formatTimeAgo(new Date(resource.lastSyncAt))}
                </div>
              </div>

              {/* Digital Twin Status */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Digital Twin:</div>
                {Math.random() > 0.5 ? (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4 text-digital-twin" />
                    <span className="text-xs text-digital-twin font-medium">Active</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">None</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-green-500">
                {resources.filter(r => r.status === 'running').length}
              </div>
              <div className="text-xs text-muted-foreground">Running</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-digital-twin">
                {resources.filter(r => r.digitalTwin).length}
              </div>
              <div className="text-xs text-muted-foreground">Digital Twins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                ${resources.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">Total Cost/Month</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-500">
                {Math.round(resources.reduce((sum, r) => sum + r.utilization, 0) / resources.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Utilization</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
