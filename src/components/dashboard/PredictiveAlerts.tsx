'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Brain, 
  Clock, 
  CheckCircle, 
  XCircle,
  Zap,
  Shield,
  DollarSign,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PredictiveAlert {
  id: string
  type: 'performance' | 'cost' | 'security' | 'failure'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  confidence: number
  timeToImpact: string
  predictedAt: Date
  status: 'active' | 'acknowledged' | 'resolved'
  autoAction?: string
}

export function PredictiveAlerts() {
  const [alerts, setAlerts] = useState<PredictiveAlert[]>([
    {
      id: 'alert-1',
      type: 'performance',
      severity: 'high',
      title: 'CPU Spike Predicted',
      description: 'Web server cluster will experience 90%+ CPU usage in the next 2 hours based on traffic patterns.',
      confidence: 92.5,
      timeToImpact: '2 hours',
      predictedAt: new Date(Date.now() - 5 * 60 * 1000),
      status: 'active',
      autoAction: 'Auto-scaling policy activated'
    },
    {
      id: 'alert-2',
      type: 'cost',
      severity: 'medium',
      title: 'Budget Overage Risk',
      description: 'Current spending trajectory will exceed monthly budget by 15% if no action is taken.',
      confidence: 87.3,
      timeToImpact: '5 days',
      predictedAt: new Date(Date.now() - 15 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'alert-3',
      type: 'security',
      severity: 'critical',
      title: 'Anomalous Access Pattern',
      description: 'Unusual login patterns detected. Potential security breach predicted with high confidence.',
      confidence: 95.8,
      timeToImpact: '30 minutes',
      predictedAt: new Date(Date.now() - 2 * 60 * 1000),
      status: 'acknowledged',
      autoAction: 'Access restrictions applied'
    },
    {
      id: 'alert-4',
      type: 'failure',
      severity: 'high',
      title: 'Database Connection Pool Exhaustion',
      description: 'Database connection pool will be exhausted based on current connection growth rate.',
      confidence: 89.1,
      timeToImpact: '45 minutes',
      predictedAt: new Date(Date.now() - 8 * 60 * 1000),
      status: 'resolved',
      autoAction: 'Connection pool size increased'
    }
  ])

  useEffect(() => {
    // Simulate new alerts and status changes
    const interval = setInterval(() => {
      setAlerts(prev => {
        // Randomly update alert statuses or add new ones
        if (Math.random() > 0.7) {
          const newAlert: PredictiveAlert = {
            id: `alert-${Date.now()}`,
            type: ['performance', 'cost', 'security', 'failure'][Math.floor(Math.random() * 4)] as any,
            severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
            title: 'New Prediction Generated',
            description: 'AI has detected a potential issue requiring attention.',
            confidence: 80 + Math.random() * 20,
            timeToImpact: `${Math.floor(Math.random() * 120)} minutes`,
            predictedAt: new Date(),
            status: 'active'
          }
          return [newAlert, ...prev].slice(0, 6) // Keep only latest 6 alerts
        }
        return prev
      })
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'performance': return <TrendingUp className="w-4 h-4" />
      case 'cost': return <DollarSign className="w-4 h-4" />
      case 'security': return <Shield className="w-4 h-4" />
      case 'failure': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'acknowledged': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' as const } : alert
    ))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as const } : alert
    ))
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-digital-twin animate-pulse" />
            <CardTitle>Predictive Alerts</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            {alerts.filter(a => a.status === 'active').length} active
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                  alert.status === 'resolved' ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getAlertIcon(alert.type)}
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  {getStatusIcon(alert.status)}
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {alert.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-3 h-3" />
                    <span>Confidence: {alert.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>ETA: {alert.timeToImpact}</span>
                  </div>
                </div>

                {alert.autoAction && (
                  <div className="flex items-center space-x-1 mb-3 text-xs text-green-600">
                    <Zap className="w-3 h-3" />
                    <span>{alert.autoAction}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Predicted {Math.floor((Date.now() - alert.predictedAt.getTime()) / 60000)}m ago
                  </span>
                  
                  {alert.status === 'active' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-xs"
                      >
                        Acknowledge
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        className="text-xs"
                      >
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No predictive alerts at this time</p>
              <p className="text-sm">AI is continuously monitoring for potential issues</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="text-lg font-bold text-red-500">
                {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-500">
                {alerts.filter(a => a.severity === 'high' && a.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
            <div>
              <div className="text-lg font-bold text-yellow-500">
                {alerts.filter(a => a.severity === 'medium' && a.status === 'active').length}
              </div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-500">
                {alerts.filter(a => a.status === 'resolved').length}
              </div>
              <div className="text-xs text-muted-foreground">Resolved</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
