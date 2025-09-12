'use client'

import { motion } from 'framer-motion'
import { Activity, Cpu, MemoryStick, HardDrive, Wifi, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useRealTimeMetrics } from '@/hooks/useRealTimeMetrics'

export function RealTimeMetrics() {
  const { 
    currentMetrics, 
    metricsHistory, 
    isConnected, 
    isLoading 
  } = useRealTimeMetrics('demo-resource-1')

  // Transform metrics history for chart display
  const chartData = metricsHistory.cpu?.map((item, index) => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString(),
    cpu: item.value,
    memory: metricsHistory.memory?.[index]?.value || 0,
    disk: metricsHistory.disk?.[index]?.value || 0,
    network: metricsHistory.network?.[index]?.value || 0,
  })) || []

  const getMetricColor = (value: number) => {
    if (value < 50) return '#10B981' // green
    if (value < 80) return '#F59E0B' // yellow
    return '#EF4444' // red
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-500 animate-pulse" />
            <CardTitle>Real-time System Metrics</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Zap className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">Live</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-xs text-yellow-500">Connecting...</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Values */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              className="text-center p-3 rounded-lg bg-muted/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Cpu className="w-5 h-5" style={{ color: getMetricColor(currentMetrics.cpu) }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: getMetricColor(currentMetrics.cpu) }}>
                {currentMetrics.cpu.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">CPU Usage</div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-muted/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center mb-2">
                <MemoryStick className="w-5 h-5" style={{ color: getMetricColor(currentMetrics.memory) }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: getMetricColor(currentMetrics.memory) }}>
                {currentMetrics.memory.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Memory</div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-muted/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center mb-2">
                <HardDrive className="w-5 h-5" style={{ color: getMetricColor(currentMetrics.disk) }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: getMetricColor(currentMetrics.disk) }}>
                {currentMetrics.disk.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Disk I/O</div>
            </motion.div>

            <motion.div
              className="text-center p-3 rounded-lg bg-muted/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Wifi className="w-5 h-5" style={{ color: getMetricColor(currentMetrics.network) }} />
              </div>
              <div className="text-2xl font-bold" style={{ color: getMetricColor(currentMetrics.network) }}>
                {currentMetrics.network.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Network</div>
            </motion.div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cpu"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={false}
                  name="CPU %"
                />
                <Line
                  type="monotone"
                  dataKey="memory"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                  name="Memory %"
                />
                <Line
                  type="monotone"
                  dataKey="disk"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                  name="Disk I/O %"
                />
                <Line
                  type="monotone"
                  dataKey="network"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={false}
                  name="Network %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>System Health</span>
                <span className="text-green-500 font-semibold">Optimal</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Response Time</span>
                <span className="font-mono">127ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Throughput</span>
                <span className="font-mono">2,847 req/min</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Error Rate</span>
                <span className="text-green-500 font-mono">0.02%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Connections</span>
                <span className="font-mono">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Queue Length</span>
                <span className="font-mono">12</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
