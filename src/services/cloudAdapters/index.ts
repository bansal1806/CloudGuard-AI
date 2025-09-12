// Enhanced Cloud Adapters with Real SDK Integration
import { ICloudAdapter, CloudAccount } from './baseAdapter'
import { AWSAdapter } from './awsAdapter'
import { RealAWSAdapter } from './realAwsAdapter'
// import { RealGCPAdapter } from './realGcpAdapter' // Temporarily disabled

// Cloud Adapter Manager with both mock and real implementations
class CloudAdapterManager {
  private adapters: Map<string, ICloudAdapter> = new Map()
  private useRealAdapters: boolean = false

  constructor() {
    // Initialize with mock adapters by default
    this.initializeMockAdapters()
  }

  private initializeMockAdapters() {
    const awsAdapter = new AWSAdapter()
    this.adapters.set('aws', awsAdapter)
    // Add mock Azure and GCP adapters when available
  }

  public enableRealAdapters(enable: boolean = true) {
    this.useRealAdapters = enable
    if (enable) {
      console.log('🚀 Switching to real cloud SDK adapters')
    } else {
      console.log('🎭 Using mock cloud adapters for demo')
    }
  }

  public async addCloudAccount(account: CloudAccount): Promise<boolean> {
    try {
      let adapter: ICloudAdapter

      if (this.useRealAdapters) {
        // Use real SDK adapters
        switch (account.provider.toLowerCase()) {
          case 'aws':
            adapter = new RealAWSAdapter(account)
            break
          case 'azure':
            // Azure SDK temporarily disabled due to installation issues
            throw new Error('Azure integration temporarily unavailable')
          case 'gcp':
          case 'google':
            // GCP SDK temporarily disabled due to build issues
            throw new Error('GCP integration temporarily unavailable')
          default:
            throw new Error(`Unsupported cloud provider: ${account.provider}`)
        }

        // Test authentication
        const isAuthenticated = await adapter.authenticate()
        if (!isAuthenticated) {
          throw new Error(`Authentication failed for ${account.provider}`)
        }

        console.log(`✅ Successfully authenticated with ${account.provider}`)
      } else {
        // Use mock adapters
        adapter = new AWSAdapter() // Default to AWS mock for demo
      }

      this.adapters.set(account.id, adapter)
      return true

    } catch (error) {
      console.error(`Failed to add ${account.provider} account:`, error)
      return false
    }
  }

  public getAdapter(accountId: string): ICloudAdapter | undefined {
    return this.adapters.get(accountId)
  }

  public getAllAdapters(): ICloudAdapter[] {
    return Array.from(this.adapters.values())
  }

  public async listAllResources() {
    const allResources = []
    
    for (const adapter of this.adapters.values()) {
      try {
        const resources = await adapter.listResources()
        allResources.push(...resources)
      } catch (error) {
        console.error('Error listing resources from adapter:', error)
      }
    }

    return allResources
  }

  public async getMultiCloudMetrics(startTime: Date, endTime: Date) {
    const metrics = []
    
    for (const [accountId, adapter] of this.adapters.entries()) {
      try {
        const resources = await adapter.listResources()
        
        for (const resource of resources) {
          const resourceMetrics = await adapter.getMetrics(
            resource.id, 
            'CPUUtilization', 
            startTime, 
            endTime
          )
          
          metrics.push({
            accountId,
            resourceId: resource.id,
            resourceName: resource.name,
            provider: resource.type,
            metrics: resourceMetrics
          })
        }
      } catch (error) {
        console.error(`Error getting metrics for account ${accountId}:`, error)
      }
    }

    return metrics
  }

  public async executePolicy(accountId: string, resourceId: string, policy: any): Promise<boolean> {
    const adapter = this.adapters.get(accountId)
    if (!adapter) {
      console.error(`No adapter found for account ${accountId}`)
      return false
    }

    try {
      return await adapter.applyPolicy(resourceId, policy)
    } catch (error) {
      console.error(`Error executing policy:`, error)
      return false
    }
  }
}

// Export singleton instance
export const cloudAdapterManager = new CloudAdapterManager()

// Export individual adapters for direct use
export { AWSAdapter }
export * from './realAwsAdapter'
// Azure adapter temporarily disabled 
// GCP adapter temporarily disabled
