'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Eye, Lock, Users, Activity } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SecurityThreat {
  id: string
  type: 'malware' | 'intrusion' | 'anomaly' | 'vulnerability'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  description: string
  status: 'detected' | 'mitigated' | 'investigating'
  detectedAt: Date
  autoAction?: string
}

export function SecurityGuardian() {
  const [threats, setThreats] = useState<SecurityThreat[]>([
    {
      id: 'threat-1',
      type: 'anomaly',
      severity: 'high',
      source: '192.168.1.45',
      description: 'Unusual access pattern detected from internal IP',
      status: 'mitigated',
      detectedAt: new Date(Date.now() - 10 * 60 * 1000),
      autoAction: 'Access temporarily restricted'
    },
    {
      id: 'threat-2',
      type: 'vulnerability',
      severity: 'medium',
      source: 'web-server-01',
      description: 'Outdated SSL certificate detected',
      status: 'investigating',
      detectedAt: new Date(Date.now() - 25 * 60 * 1000)
    },
    {
      id: 'threat-3',
      type: 'intrusion',
      severity: 'critical',
      source: '203.45.67.89',
      description: 'Multiple failed login attempts from external IP',
      status: 'mitigated',
      detectedAt: new Date(Date.now() - 5 * 60 * 1000),
      autoAction: 'IP blocked and admin notified'
    }
  ])

  const [securityScore, setSecurityScore] = useState(94.2)
  const [activeScans, setActiveScans] = useState(3)

  useEffect(() => {
    // Simulate real-time security updates
    const interval = setInterval(() => {
      // Randomly update security score
      setSecurityScore(prev => Math.max(85, Math.min(99, prev + (Math.random() - 0.5) * 2)))
      
      // Occasionally add new threats
      if (Math.random() > 0.85) {
        const newThreat: SecurityThreat = {
          id: `threat-${Date.now()}`,
          type: ['malware', 'intrusion', 'anomaly', 'vulnerability'][Math.floor(Math.random() * 4)] as any,
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
          source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          description: 'New security event detected by AI guardian',
          status: 'detected',
          detectedAt: new Date()
        }
        setThreats(prev => [newThreat, ...prev].slice(0, 5))
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'malware': return '🦠'
      case 'intrusion': return '🚨'
      case 'anomaly': return '⚠️'
      case 'vulnerability': return '🔓'
      default: return '🛡️'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'detected': return 'text-red-500'
      case 'investigating': return 'text-yellow-500'
      case 'mitigated': return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-500'
    if (score >= 85) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-500" />
            <CardTitle>AI Security Guardian</CardTitle>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Score: </span>
              <span className={`font-bold ${getScoreColor(securityScore)}`}>
                {securityScore.toFixed(1)}
              </span>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Security Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-500">
                {threats.filter(t => t.status === 'mitigated').length}
              </div>
              <div className="text-xs text-muted-foreground">Mitigated</div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <AlertTriangle className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-red-500">
                {threats.filter(t => t.status === 'detected').length}
              </div>
              <div className="text-xs text-muted-foreground">Active Threats</div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Eye className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-500">{activeScans}</div>
              <div className="text-xs text-muted-foreground">Active Scans</div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
              whileHover={{ scale: 1.05 }}
            >
              <Lock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-500">847</div>
              <div className="text-xs text-muted-foreground">Protected Assets</div>
            </motion.div>
          </div>

          {/* Recent Threats */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Recent Security Events</span>
            </h4>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {threats.map((threat, index) => (
                <motion.div
                  key={threat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getThreatIcon(threat.type)}</span>
                      <div>
                        <div className="font-medium text-sm">{threat.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Source: {threat.source}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(threat.severity)}`}>
                        {threat.severity.toUpperCase()}
                      </span>
                      <span className={`text-xs font-medium ${getStatusColor(threat.status)}`}>
                        {threat.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {threat.autoAction && (
                    <div className="text-xs text-green-600 bg-green-500/10 p-2 rounded mt-2">
                      🤖 Auto-Action: {threat.autoAction}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    Detected {Math.floor((Date.now() - threat.detectedAt.getTime()) / 60000)}m ago
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Security Actions */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Shield className="w-3 h-3 mr-1" />
                Run Full Scan
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                View Details
              </Button>
            </div>
          </div>

          {/* AI Status */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">AI Guardian Status</span>
              </div>
              <span className="text-green-500 font-semibold">Active</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Continuously monitoring 847 assets • Last update: 2s ago
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
