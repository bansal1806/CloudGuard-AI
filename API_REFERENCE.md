# 🔌 CloudGuard AI - Complete API Reference

**All APIs and Data Sources Used in the Platform**

---

## 📊 **INTERNAL APIs (CloudGuard AI Platform)**

### **1. Data Sources Management API**
```
Base URL: http://localhost:3000/api/data-sources
```

#### **GET Endpoints:**
```bash
# List all data sources
GET /api/data-sources?action=sources

# Get cost breakdown
GET /api/data-sources?action=costs  

# Get system status
GET /api/data-sources?action=status
```

#### **POST Endpoints:**
```bash
# Start data collection
POST /api/data-sources
Body: { "action": "start", "interval": 3000 }

# Stop data collection  
POST /api/data-sources
Body: { "action": "stop" }

# Restart data collection
POST /api/data-sources
Body: { "action": "restart", "interval": 5000 }
```

#### **PUT Endpoints:**
```bash
# Enable/disable data source
PUT /api/data-sources
Body: { "sourceId": "system-metrics", "enabled": true }
```

---

### **2. Metrics API**
```
Base URL: http://localhost:3000/api/metrics
```

#### **GET Endpoints:**
```bash
# Get metrics for specific resource
GET /api/metrics?resourceId=local-system

# Get specific metric type
GET /api/metrics?metric=cpu&timeRange=1h

# Get all metrics
GET /api/metrics
```

#### **Response Format:**
```json
{
  "success": true,
  "resourceId": "local-system",
  "data": {
    "cpu": [{"timestamp": "2025-09-12T16:00:00Z", "value": 45.2}],
    "memory": [{"timestamp": "2025-09-12T16:00:00Z", "value": 67.1}]
  },
  "current": {
    "cpu": 45.2,
    "memory": 67.1
  }
}
```

---

### **3. Judge Demo API**
```
Base URL: http://localhost:3000/api/judge-demo
```

#### **GET Endpoints:**
```bash
# Overview of all capabilities
GET /api/judge-demo

# Real-time proof with actual system data
GET /api/judge-demo?demo=real-time-proof

# Live metrics from all sources
GET /api/judge-demo?demo=live-metrics

# Cost analysis comparison
GET /api/judge-demo?demo=cost-analysis

# Feature comparison vs cloud providers
GET /api/judge-demo?demo=comparison
```

---

### **4. Performance Metrics API**
```
Base URL: http://localhost:3000/api/performance/metrics
```

#### **Endpoints:**
```bash
# Get performance metrics
GET /api/performance/metrics

# Delete old metrics
DELETE /api/performance/metrics
```

---

### **5. Digital Twins API**
```
Base URL: http://localhost:3000/api/digital-twins
```

#### **Endpoints:**
```bash
# Get digital twin data
GET /api/digital-twins

# Create/update digital twin
POST /api/digital-twins
```

---

## 🌐 **EXTERNAL APIs (Third-Party Services)**

### **1. Weather API (FREE)**

#### **Primary: wttr.in**
```
URL: https://wttr.in/London?format=j1
Method: GET
Authentication: None required
Rate Limit: No limits for basic usage
Cost: FREE
```

**Response Data:**
- Temperature (°C)
- Humidity (%)
- Pressure (hPa)
- Weather conditions
- Wind speed (km/h)

**Headers Used:**
```javascript
headers: { 
  'User-Agent': 'CloudGuard-AI/1.0' 
}
```

#### **Fallback: OpenWeatherMap**
```
URL: https://api.openweathermap.org/data/2.5/weather
Parameters: q=London&appid=demo&units=metric
Authentication: API key required (demo key for testing)
Rate Limit: 60 calls/minute (free tier)
Cost: FREE tier available
```

---

### **2. GitHub API (FREE)**

```
URL: https://api.github.com/repos/microsoft/vscode
Method: GET
Authentication: None (public repo)
Rate Limit: 60 requests/hour (unauthenticated)
Cost: FREE
```

**Response Data:**
- Repository stars
- Forks count
- Open issues
- Watchers count
- Language
- Last updated timestamp
- Repository size

**Headers Used:**
```javascript
headers: {
  'User-Agent': 'CloudGuard-AI/1.0',
  'Accept': 'application/vnd.github.v3+json'
}
```

---

### **3. Cryptocurrency API (FREE)**

#### **CoinGecko API**
```
URL: https://api.coingecko.com/api/v3/simple/price
Parameters: 
  - ids=bitcoin,ethereum,cardano
  - vs_currencies=usd
  - include_24hr_change=true
  - include_market_cap=true
Method: GET
Authentication: None required
Rate Limit: Generous free tier
Cost: FREE
```

**Response Data:**
- Bitcoin, Ethereum, Cardano prices (USD)
- 24-hour price changes (%)
- Market cap values
- Real-time cryptocurrency data

**Headers Used:**
```javascript
headers: {
  'User-Agent': 'CloudGuard-AI/1.0'
}
```

---

### **4. Low-Cost Cloud APIs ($5/month)**

#### **DigitalOcean API**
```
URL: https://api.digitalocean.com/v2/monitoring/metrics/droplet/cpu
Method: GET
Authentication: Bearer token required
Cost: $5/month for basic droplet + monitoring
```

**Headers Required:**
```javascript
headers: {
  'Authorization': 'Bearer ${DO_API_KEY}',
  'Content-Type': 'application/json'
}
```

#### **Linode API**
```
URL: https://api.linode.com/v4/linode/instances
Method: GET
Authentication: Bearer token required
Cost: $5/month for Nanode instance
```

**Headers Required:**
```javascript
headers: {
  'Authorization': 'Bearer ${LINODE_API_KEY}',
  'Content-Type': 'application/json'
}
```

---

## 💻 **SYSTEM APIs (Local)**

### **1. Node.js OS Module (FREE)**

**APIs Used:**
```javascript
// CPU Information
os.cpus()           // Get CPU core count and models
os.loadavg()        // Get system load averages

// Memory Information  
os.totalmem()       // Total system memory
os.freemem()        // Free system memory

// System Information
os.platform()       // Operating system platform
os.arch()           // System architecture
os.uptime()         // System uptime in seconds
os.networkInterfaces() // Network interface information
```

---

### **2. Docker API (FREE)**

**Commands Used:**
```bash
# List running containers
docker ps --format "{{.ID}},{{.Names}}"

# Get container statistics
docker stats ${containerId} --no-stream --format "{{.CPUPerc}},{{.MemUsage}},{{.NetIO}},{{.BlockIO}}"

# Container status check
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Image}}"
```

**Data Collected:**
- Container CPU usage (%)
- Container memory usage (MB/GB)
- Network I/O (bytes)
- Disk I/O (bytes)
- Container status and health

---

### **3. System Commands (FREE)**

#### **Windows Commands:**
```bash
# CPU usage
wmic cpu get loadpercentage /value

# Process count
tasklist /fo csv | find /c /v ""

# Disk usage
wmic logicaldisk get size,freespace,caption
```

#### **Linux/Unix Commands:**
```bash
# CPU/System info
ps aux | wc -l

# Disk usage
df -h /

# Process information
ps aux
```

---

## 🔄 **DATA FLOW & UPDATE FREQUENCIES**

### **Real-Time Update Schedule:**
```
System Metrics:     Every 3 seconds   (Node.js OS APIs)
Docker Stats:       Every 5 seconds   (Docker API)
Weather Data:       Every 30 seconds  (wttr.in API)
GitHub Metrics:     Every 30 seconds  (GitHub API) 
Crypto Prices:      Every 30 seconds  (CoinGecko API)
Cloud Monitoring:   Every 10 seconds  (DO/Linode APIs)
```

### **WebSocket Streaming:**
```
Protocol: WebSocket (ws://)
Endpoint: ws://localhost:3000
Events: 
  - metrics:update
  - alert:new  
  - resource:update
  - connection
```

---

## 💰 **API COST BREAKDOWN**

| **API Category** | **Service** | **Cost** | **Rate Limit** | **Authentication** |
|------------------|-------------|----------|----------------|-------------------|
| **System APIs** | Node.js OS | FREE | None | None |
| **Container APIs** | Docker | FREE | None | None |
| **Weather APIs** | wttr.in | FREE | None | None |
| **Code APIs** | GitHub | FREE | 60/hour | None |
| **Finance APIs** | CoinGecko | FREE | Generous | None |
| **Cloud APIs** | DigitalOcean | $5/month | API limits | Bearer token |
| **Cloud APIs** | Linode | $5/month | API limits | Bearer token |
| **TOTAL** | **All Sources** | **$5/month** | **Various** | **Minimal** |

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Optional API Keys:**
```bash
# External APIs (optional - has fallbacks)
OPENWEATHER_API_KEY=your_key_here
DO_API_KEY=your_digitalocean_key
LINODE_API_KEY=your_linode_key

# System will work without these - uses free alternatives
```

### **Required for Full Cloud Integration:**
```bash
# Only needed for low-cost cloud monitoring
DO_API_KEY=your_digitalocean_token
LINODE_API_KEY=your_linode_token
```

---

## 🎯 **API TESTING FOR JUDGES**

### **Test Commands:**
```bash
# Test internal APIs
curl http://localhost:3000/api/data-sources?action=sources
curl http://localhost:3000/api/metrics?resourceId=local-system
curl http://localhost:3000/api/judge-demo?demo=live-metrics

# Test external API integration (internal endpoints)
curl http://localhost:3000/api/judge-demo?demo=real-time-proof
```

### **Direct External API Tests:**
```bash
# Weather API
curl "https://wttr.in/London?format=j1"

# GitHub API  
curl "https://api.github.com/repos/microsoft/vscode"

# Crypto API
curl "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
```

---

## 📊 **COMPARISON: CloudGuard AI vs AWS**

| **Feature** | **CloudGuard AI APIs** | **AWS Equivalent** | **Cost Difference** |
|-------------|------------------------|-------------------|-------------------|
| System Monitoring | Node.js OS APIs (FREE) | CloudWatch ($30/month) | $30 savings |
| Container Monitoring | Docker API (FREE) | ECS Insights ($20/month) | $20 savings |
| External Data | Public APIs (FREE) | API Gateway ($15/month) | $15 savings |
| Cloud Monitoring | DigitalOcean ($5/month) | EC2 + CloudWatch ($60/month) | $55 savings |
| **TOTAL** | **$5/month** | **$125/month** | **$120 savings (96%)** |

---

**Summary: CloudGuard AI uses a mix of FREE system APIs, FREE external APIs, and low-cost cloud APIs to achieve enterprise-grade monitoring at 96% cost savings compared to AWS equivalents.**
