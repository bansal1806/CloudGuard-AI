'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cloud, Server, Database, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const cloudProviders = [
  {
    id: 'aws',
    name: 'Amazon Web Services',
    logo: '🟠',
    resources: 89,
    cost: 2847.50,
    alerts: 2,
    uptime: 99.97,
    growth: '+12%',
    color: 'orange'
  },
  {
    id: 'azure',
    name: 'Microsoft Azure',
    logo: '🔵',
    resources: 45,
    cost: 1523.25,
    alerts: 1,
    uptime: 99.95,
    growth: '+8%',
    color: 'blue'
  },
  {
    id: 'gcp',
    name: 'Google Cloud Platform',
    logo: '🟢',
    resources: 22,
    cost: 892.75,
    alerts: 0,
    uptime: 99.99,
    growth: '+15%',
    color: 'green'
  }
]

export function CloudProviderOverview() {
  const [selectedProvider, setSelectedProvider] = useState('aws')

  const selectedData = cloudProviders.find(p => p.id === selectedProvider)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="w-5 h-5 text-cloud-blue" />
            <CardTitle>Multi-Cloud Overview</CardTitle>
          </div>
          <div className="text-sm text-muted-foreground">
            Total: {cloudProviders.reduce((sum, p) => sum + p.resources, 0)} resources
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            {cloudProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`cursor-pointer transition-all duration-300 ${
                  selectedProvider === provider.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <Card className={`h-full ${
                  provider.color === 'orange' ? 'border-orange-500/20 bg-orange-500/5' :
                  provider.color === 'blue' ? 'border-blue-500/20 bg-blue-500/5' :
                  'border-green-500/20 bg-green-500/5'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-2xl">{provider.logo}</div>
                      <div>
                        <h3 className="font-semibold text-sm">{provider.name}</h3>
                        <p className="text-xs text-muted-foreground">{provider.id.toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Server className="w-3 h-3" />
                          <span>Resources</span>
                        </div>
                        <span className="font-mono font-semibold">{provider.resources}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>Monthly Cost</span>
                        </div>
                        <span className="font-mono font-semibold">${provider.cost.toFixed(0)}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Active Alerts</span>
                        </div>
                        <span className={`font-mono font-semibold ${
                          provider.alerts === 0 ? 'text-green-500' :
                          provider.alerts <= 2 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {provider.alerts}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Uptime</span>
                        <span className="font-mono font-semibold text-green-500">
                          {provider.uptime}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span>Growth</span>
                        </div>
                        <span className="font-mono font-semibold text-green-500">
                          {provider.growth}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed View */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <span>{selectedData?.logo}</span>
                  <span>{selectedData?.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Resource Breakdown */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Resource Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compute</span>
                        <span className="font-mono">
                          {Math.floor((selectedData?.resources || 0) * 0.4)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span className="font-mono">
                          {Math.floor((selectedData?.resources || 0) * 0.3)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Database</span>
                        <span className="font-mono">
                          {Math.floor((selectedData?.resources || 0) * 0.2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Network</span>
                        <span className="font-mono">
                          {Math.floor((selectedData?.resources || 0) * 0.1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Cost Analysis</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compute</span>
                        <span className="font-mono">
                          ${((selectedData?.cost || 0) * 0.6).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Storage</span>
                        <span className="font-mono">
                          ${((selectedData?.cost || 0) * 0.25).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Network</span>
                        <span className="font-mono">
                          ${((selectedData?.cost || 0) * 0.15).toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Recent Activity</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>3 instances scaled up</span>
                        <span className="text-muted-foreground ml-auto">2m ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Backup completed</span>
                        <span className="text-muted-foreground ml-auto">15m ago</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Cost alert triggered</span>
                        <span className="text-muted-foreground ml-auto">1h ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
