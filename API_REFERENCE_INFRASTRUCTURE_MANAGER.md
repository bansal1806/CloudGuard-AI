# 🏗️ Infrastructure Manager API Reference

**Complete API Documentation for the Intelligent Infrastructure Management System**

---

## 🔧 **BASE CONFIGURATION**

```bash
Base URL: http://localhost:3000/api/infrastructure-manager
Content-Type: application/json
Authorization: Bearer your-api-key-here
```

---

## 📊 **MAIN INFRASTRUCTURE MANAGER API**

### **GET /infrastructure-manager**
Get all infrastructure assets with optional filtering.

#### **Query Parameters:**
- `assetId` (string): Get specific asset by ID
- `includeRecommendations` (boolean): Include AI recommendations (default: false)
- `includePredictions` (boolean): Include predictions and insights (default: false)
- `type` (string): Filter by asset type (`server`, `database`, `storage`, `network`, `application`, `container`)
- `status` (string): Filter by status (`healthy`, `warning`, `critical`, `optimizing`, `offline`)

#### **Examples:**
```bash
# Get all assets with summary
GET /api/infrastructure-manager

# Get specific asset with recommendations
GET /api/infrastructure-manager?assetId=asset-1&includeRecommendations=true

# Get all database assets
GET /api/infrastructure-manager?type=database

# Get all critical assets with predictions
GET /api/infrastructure-manager?status=critical&includePredictions=true
```

#### **Response:**
```json
{
  "assets": [
    {
      "id": "asset-001",
      "name": "Production Web Server",
      "type": "server",
      "provider": "AWS",
      "status": "healthy",
      "location": "us-east-1",
      "healthScore": 92.5,
      "optimizationScore": 35.2,
      "riskLevel": "low",
      "monthlyCost": 2160.00,
      "recommendationsCount": 3,
      "lastUpdated": "2024-01-15T10:30:00Z",
      "performance": {
        "cpu": 45.2,
        "memory": 62.1,
        "disk": 28.5,
        "network": 42.8,
        "response_time": 125.3,
        "uptime": 99.87
      },
      "cost": {
        "hourly": 3.00,
        "monthly": 2160.00,
        "yearly": 25920.00,
        "trend": "stable"
      },
      "recommendations": [
        {
          "id": "rec-001",
          "type": "cost",
          "priority": "high",
          "title": "Right-size EC2 Instances",
          "description": "Downsize to t3.medium for 35% cost savings",
          "impact": "Reduce monthly costs by $1,200",
          "effort": "low",
          "savings": 1200,
          "confidence": 94,
          "estimatedTime": "2-3 hours"
        }
      ]
    }
  ],
  "summary": {
    "totalAssets": 8,
    "healthyAssets": 6,
    "averageHealth": 87.2,
    "totalMonthlyCost": 16847.50,
    "totalRecommendations": 12,
    "potentialMonthlySavings": 4650.00,
    "optimizationOpportunities": 5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **POST /infrastructure-manager**
Execute infrastructure management actions.

#### **Request Body:**
```json
{
  "action": "apply_recommendation|start_monitoring|generate_optimization_report",
  "assetId": "asset-1",
  "parameters": {
    "recommendationId": "rec-001",
    "estimatedSavings": 1200
  }
}
```

#### **Actions:**

##### **Apply Recommendation:**
```bash
POST /api/infrastructure-manager
{
  "action": "apply_recommendation",
  "assetId": "asset-1",
  "parameters": {
    "recommendationId": "rec-001",
    "estimatedSavings": 1200,
    "implementationTime": "2-4 hours"
  }
}
```

##### **Start Monitoring:**
```bash
POST /api/infrastructure-manager
{
  "action": "start_monitoring",
  "assetId": "asset-1"
}
```

##### **Generate Optimization Report:**
```bash
POST /api/infrastructure-manager
{
  "action": "generate_optimization_report"
}
```

### **PUT /infrastructure-manager**
Update asset configuration.

#### **Request Body:**
```json
{
  "assetId": "asset-1",
  "updates": {
    "monitoring_interval": 60,
    "alert_thresholds": {
      "cpu": 85,
      "memory": 90
    }
  }
}
```

---

## 💡 **RECOMMENDATIONS API**

### **GET /infrastructure-manager/recommendations**
Get AI-generated optimization recommendations.

#### **Query Parameters:**
- `assetId` (string): Filter by asset ID
- `type` (string): Filter by recommendation type (`cost`, `performance`, `security`, `reliability`, `capacity`)
- `priority` (string): Filter by priority (`low`, `medium`, `high`, `critical`)
- `status` (string): Filter by status (`pending`, `approved`, `in_progress`, `completed`, `rejected`)
- `limit` (number): Number of results (default: 50)
- `offset` (number): Pagination offset (default: 0)

#### **Examples:**
```bash
# Get all recommendations
GET /api/infrastructure-manager/recommendations

# Get high-priority cost recommendations
GET /api/infrastructure-manager/recommendations?type=cost&priority=high

# Get recommendations for specific asset
GET /api/infrastructure-manager/recommendations?assetId=asset-1

# Get pending recommendations with pagination
GET /api/infrastructure-manager/recommendations?status=pending&limit=10&offset=0
```

#### **Response:**
```json
{
  "recommendations": [
    {
      "id": "rec-001",
      "assetId": "asset-1",
      "assetName": "Production Web Server",
      "type": "cost",
      "priority": "high",
      "title": "Right-size EC2 Instances",
      "description": "Current t3.large instances are only utilizing 45% CPU on average",
      "impact": "Reduce monthly costs by $1,200 (35% savings)",
      "effort": "low",
      "savings": 1200,
      "confidence": 94,
      "implementationSteps": [
        "Verify consistent low CPU usage over 30-day period",
        "Create AMI backup of current instance",
        "Launch new t3.medium instance during maintenance window",
        "Update load balancer to point to new instance",
        "Monitor performance for 48 hours",
        "Terminate old instance if performance is stable"
      ],
      "estimatedTime": "2-3 hours",
      "category": "Resource Optimization",
      "tags": ["cost-reduction", "right-sizing", "ec2"],
      "createdAt": "2024-01-15T08:30:00Z",
      "status": "pending"
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "summary": {
    "totalRecommendations": 12,
    "totalPotentialSavings": 4650,
    "averageConfidence": 89,
    "byStatus": {
      "pending": 7,
      "approved": 2,
      "in_progress": 2,
      "completed": 1
    },
    "byPriority": {
      "critical": 1,
      "high": 4,
      "medium": 5,
      "low": 2
    },
    "byType": {
      "cost": 6,
      "performance": 3,
      "reliability": 2,
      "capacity": 1
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **POST /infrastructure-manager/recommendations**
Execute actions on recommendations.

#### **Actions:**

##### **Approve Recommendation:**
```bash
POST /api/infrastructure-manager/recommendations
{
  "recommendationId": "rec-001",
  "action": "approve",
  "notes": "Approved for implementation during next maintenance window"
}
```

##### **Start Implementation:**
```bash
POST /api/infrastructure-manager/recommendations
{
  "recommendationId": "rec-001",
  "action": "start_implementation",
  "notes": "Implementation started by DevOps team"
}
```

##### **Complete Implementation:**
```bash
POST /api/infrastructure-manager/recommendations
{
  "recommendationId": "rec-001",
  "action": "complete",
  "notes": "Successfully implemented. Monitoring for 48 hours."
}
```

---

## 📈 **ANALYTICS API**

### **GET /infrastructure-manager/analytics**
Get comprehensive analytics and insights.

#### **Query Parameters:**
- `timeframe` (string): Time period (`24h`, `7d`, `30d`, `90d`) - default: `30d`
- `includeAlerts` (boolean): Include active alerts (default: true)
- `includeInsights` (boolean): Include AI insights (default: true)
- `includeTrends` (boolean): Include trend data (default: true)
- `includePredictions` (boolean): Include predictive analytics (default: false)

#### **Examples:**
```bash
# Get 30-day analytics with all data
GET /api/infrastructure-manager/analytics?timeframe=30d

# Get 7-day trends only
GET /api/infrastructure-manager/analytics?timeframe=7d&includeAlerts=false&includeInsights=false

# Get comprehensive analytics with predictions
GET /api/infrastructure-manager/analytics?timeframe=90d&includePredictions=true
```

#### **Response:**
```json
{
  "timeframe": "30d",
  "metrics": {
    "performance": {
      "averageCpuUtilization": 58.4,
      "averageMemoryUtilization": 67.2,
      "averageResponseTime": 134,
      "totalRequests": 2847629,
      "errorRate": 0.23,
      "uptime": 99.87
    },
    "cost": {
      "totalMonthlyCost": 16847,
      "costTrend": 12.5,
      "topCostDrivers": [
        {
          "assetName": "Primary Database",
          "cost": 4200,
          "percentage": 24.9
        }
      ],
      "savingsOpportunities": 4650,
      "implementedSavings": 1200
    },
    "health": {
      "overallHealthScore": 83.7,
      "healthyAssets": 5,
      "warningAssets": 2,
      "criticalAssets": 1,
      "healthTrend": -5.2
    },
    "optimization": {
      "totalRecommendations": 12,
      "implementedRecommendations": 3,
      "pendingRecommendations": 7,
      "totalPotentialSavings": 4650,
      "averageImplementationTime": "4.5 hours"
    },
    "predictions": {
      "predictedCostIncrease": 8.3,
      "predictedPerformanceIssues": 2,
      "capacityAlerts": [
        {
          "assetName": "Production Web Server",
          "metric": "Disk Space",
          "daysUntilLimit": 12,
          "severity": "high"
        }
      ]
    }
  },
  "trends": [
    {
      "date": "2024-01-01",
      "healthScore": 87.2,
      "totalCost": 15200,
      "cpuUtilization": 52.1,
      "memoryUtilization": 64.3,
      "responseTime": 128,
      "recommendationsImplemented": 1
    }
  ],
  "alerts": [
    {
      "id": "alert-001",
      "type": "performance",
      "severity": "high",
      "title": "Database Response Time Degradation",
      "description": "Primary database response time increased by 40%",
      "assetName": "Primary Database",
      "timestamp": "2024-01-15T08:30:00Z",
      "status": "active",
      "impact": "User experience degradation",
      "recommendedAction": "Investigate slow queries and optimize indexes"
    }
  ],
  "insights": [
    {
      "id": "insight-001",
      "category": "cost_savings",
      "title": "Significant Over-provisioning Detected",
      "description": "40% of compute resources are consistently under-utilized",
      "impact": "Potential monthly savings of $3,200 (20% cost reduction)",
      "confidence": 94,
      "actionable": true,
      "relatedAssets": ["Production Web Server", "API Gateway"],
      "generatedAt": "2024-01-15T04:30:00Z"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### **POST /infrastructure-manager/analytics**
Generate reports and export data.

#### **Generate Report:**
```bash
POST /api/infrastructure-manager/analytics
{
  "action": "generate_report",
  "parameters": {
    "type": "comprehensive",
    "timeframe": "30d"
  }
}
```

#### **Export Data:**
```bash
POST /api/infrastructure-manager/analytics
{
  "action": "export_data",
  "parameters": {
    "format": "json",
    "dataTypes": ["metrics", "trends", "insights"]
  }
}
```

#### **Schedule Analysis:**
```bash
POST /api/infrastructure-manager/analytics
{
  "action": "schedule_analysis",
  "parameters": {
    "frequency": "daily",
    "recipients": ["admin@company.com"],
    "analysisTypes": ["performance", "cost", "optimization"]
  }
}
```

---

## 📡 **REAL-TIME MONITORING API**

### **GET /infrastructure-manager/monitoring**
Get real-time monitoring data.

#### **Query Parameters:**
- `assetId` (string): Get monitoring data for specific asset
- `includeAlerts` (boolean): Include real-time alerts (default: true)
- `includeAnomalies` (boolean): Include anomaly detection (default: true)
- `detailed` (boolean): Include detailed metrics (default: false)

#### **Examples:**
```bash
# Get system-wide monitoring data
GET /api/infrastructure-manager/monitoring

# Get detailed monitoring for specific asset
GET /api/infrastructure-manager/monitoring?assetId=asset-1&detailed=true

# Get monitoring data without alerts
GET /api/infrastructure-manager/monitoring?includeAlerts=false
```

#### **Response:**
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "systemWide": {
    "totalAssets": 8,
    "healthyAssets": 6,
    "averageHealthScore": 85.4,
    "totalThroughput": 5100,
    "averageResponseTime": 98.7,
    "systemErrorRate": 0.31,
    "totalCpuUtilization": 56.8,
    "totalMemoryUtilization": 68.4,
    "networkTraffic": {
      "totalIncoming": 730,
      "totalOutgoing": 625
    },
    "costMetrics": {
      "currentHourCost": 14.23,
      "projectedDailyCost": 341.52,
      "projectedMonthlyCost": 10245.60
    }
  },
  "assets": [
    {
      "id": "asset-1",
      "name": "Production Web Server",
      "type": "server",
      "status": "healthy",
      "realTimeMetrics": {
        "cpu": 52.3,
        "memory": 64.7,
        "disk": 31.2,
        "network": {
          "incoming": 165.4,
          "outgoing": 142.8
        },
        "responseTime": 118.6,
        "throughput": 1340,
        "errorRate": 0.18,
        "availability": 99.91
      },
      "healthIndicators": {
        "overall": 88.7,
        "performance": 85.2,
        "reliability": 96.8,
        "efficiency": 82.4
      },
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  ],
  "alerts": [
    {
      "id": "alert-rt-001",
      "timestamp": "2024-01-15T10:28:00Z",
      "type": "performance",
      "severity": "warning",
      "assetId": "asset-2",
      "assetName": "Primary Database",
      "title": "High CPU Utilization",
      "description": "CPU utilization exceeded 85% for 5 minutes",
      "metric": "cpu",
      "currentValue": 87.3,
      "threshold": 85,
      "impact": "Query response times may be affected",
      "autoResolution": false,
      "estimatedDuration": "10-15 minutes"
    }
  ],
  "anomalies": [
    {
      "id": "anomaly-001",
      "timestamp": "2024-01-15T10:15:00Z",
      "assetId": "asset-1",
      "assetName": "Production Web Server",
      "metric": "response_time",
      "anomalyType": "spike",
      "severity": "medium",
      "description": "Response time spike - 40% higher than normal",
      "currentValue": 168,
      "expectedValue": 120,
      "deviation": 40,
      "confidence": 92,
      "potentialCauses": [
        "Increased traffic load",
        "Database query performance degradation",
        "Network latency issues"
      ],
      "recommendedActions": [
        "Check current traffic patterns",
        "Review recent database queries",
        "Monitor network connectivity"
      ]
    }
  ]
}
```

### **POST /infrastructure-manager/monitoring**
Execute monitoring actions.

#### **Acknowledge Alert:**
```bash
POST /api/infrastructure-manager/monitoring
{
  "action": "acknowledge_alert",
  "parameters": {
    "alertId": "alert-rt-001"
  }
}
```

#### **Configure Monitoring:**
```bash
POST /api/infrastructure-manager/monitoring
{
  "action": "set_monitoring_interval",
  "assetId": "asset-1",
  "parameters": {
    "interval": 30
  }
}
```

#### **Set Thresholds:**
```bash
POST /api/infrastructure-manager/monitoring
{
  "action": "configure_threshold",
  "assetId": "asset-1",
  "parameters": {
    "metric": "cpu",
    "threshold": 80,
    "severity": "warning"
  }
}
```

---

## 📋 **ERROR RESPONSES**

### **Standard Error Format:**
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:30:00Z",
  "details": {
    "field": "Additional error context"
  }
}
```

### **HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (missing/invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (asset/recommendation not found)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## 🔑 **AUTHENTICATION**

### **API Key Authentication:**
```bash
curl -H "Authorization: Bearer your-api-key-here" \
     -H "Content-Type: application/json" \
     "http://localhost:3000/api/infrastructure-manager"
```

### **Rate Limiting:**
- **Standard endpoints**: 100 requests/minute
- **Monitoring endpoints**: 300 requests/minute
- **Analytics endpoints**: 50 requests/minute

---

## 📚 **USAGE EXAMPLES**

### **Complete Infrastructure Health Check:**
```bash
# 1. Get all assets with health scores
curl "http://localhost:3000/api/infrastructure-manager?includeRecommendations=true"

# 2. Get real-time monitoring data
curl "http://localhost:3000/api/infrastructure-manager/monitoring?detailed=true"

# 3. Get analytics for trend analysis
curl "http://localhost:3000/api/infrastructure-manager/analytics?timeframe=7d"

# 4. Get all pending recommendations
curl "http://localhost:3000/api/infrastructure-manager/recommendations?status=pending"
```

### **Optimization Workflow:**
```bash
# 1. Get cost optimization recommendations
curl "http://localhost:3000/api/infrastructure-manager/recommendations?type=cost&priority=high"

# 2. Approve a recommendation
curl -X POST "http://localhost:3000/api/infrastructure-manager/recommendations" \
     -d '{"recommendationId": "rec-001", "action": "approve"}'

# 3. Start implementation
curl -X POST "http://localhost:3000/api/infrastructure-manager/recommendations" \
     -d '{"recommendationId": "rec-001", "action": "start_implementation"}'

# 4. Mark as completed
curl -X POST "http://localhost:3000/api/infrastructure-manager/recommendations" \
     -d '{"recommendationId": "rec-001", "action": "complete"}'
```

---

## 🎯 **KEY BENEFITS**

✅ **Real-time Infrastructure Monitoring**  
✅ **AI-powered Optimization Recommendations**  
✅ **Cost Reduction Opportunities**  
✅ **Performance Enhancement Insights**  
✅ **Predictive Analytics**  
✅ **Anomaly Detection**  
✅ **Comprehensive Reporting**  
✅ **Automated Alert Management**

---

*This API provides complete infrastructure intelligence without confusing terminology - just clear, actionable insights for optimization and cost savings.*
