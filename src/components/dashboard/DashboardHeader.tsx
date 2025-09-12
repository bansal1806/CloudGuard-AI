'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Settings, 
  User, 
  Search, 
  Menu,
  Brain,
  Zap,
  Shield,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function DashboardHeader() {
  const [notifications] = useState([
    { id: 1, title: 'Cost optimization opportunity detected', type: 'info', time: '2m ago' },
    { id: 2, title: 'Security threat mitigated automatically', type: 'success', time: '5m ago' },
    { id: 3, title: 'Predictive scaling activated', type: 'warning', time: '10m ago' },
  ])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-fluid">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Brain className="w-8 h-8 text-digital-twin" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold ai-gradient-text">CloudGuard AI</h1>
                <p className="text-xs text-muted-foreground">Digital Twin Ecosystem</p>
              </div>
            </motion.div>
          </div>

          {/* Status Indicators */}
          <div className="hidden md:flex items-center space-x-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2 text-sm"
            >
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">AI Engine</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 text-sm"
            >
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-muted-foreground">12 Twins Active</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2 text-sm"
            >
              <Shield className="w-4 h-4 text-green-500" />
              <span className="text-muted-foreground">Secure</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-2 text-sm"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-muted-foreground">Auto-Optimizing</span>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="w-4 h-4" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Settings */}
            <Button variant="ghost" size="icon">
              <Settings className="w-4 h-4" />
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* AI Status Bar */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ delay: 0.5 }}
          className="pb-3"
        >
          <Card className="p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-digital-twin" />
                  <span className="font-medium">AI Predictions:</span>
                  <span className="text-green-500">94.2% Accuracy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">Auto-Actions:</span>
                  <span className="text-blue-500">23 Today</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Threats Blocked:</span>
                  <span className="text-green-500">7 This Hour</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">Cost Saved Today:</span>
                <span className="font-bold text-green-500">$1,247</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </header>
  )
}
