// Real Google Cloud SDK Integration for CloudGuard AI
import { InstancesClient, ZonesClient } from '@google-cloud/compute'
import { MetricServiceClient } from '@google-cloud/monitoring'
import { ICloudAdapter, CloudResource, CloudAccount } from './baseAdapter'

export class RealGCPAdapter implements ICloudAdapter {
  private instancesClient: InstancesClient
  private zonesClient: ZonesClient
  private metricClient: MetricServiceClient
  private account: CloudAccount
  private projectId: string

  constructor(account: CloudAccount) {
    this.account = account
    this.projectId = this.getProjectId(account.credentials)
    
    // Initialize clients with service account credentials
    const credentials = this.getServiceAccountKey(account.credentials)
    const clientOptions = {
      projectId: this.projectId,
      keyFilename: credentials // Path to service account key file
    }

    this.instancesClient = new InstancesClient(clientOptions)
    this.zonesClient = new ZonesClient(clientOptions)
    this.metricClient = new MetricServiceClient(clientOptions)
  }

  async authenticate(): Promise<boolean> {
    try {
      // Test authentication by listing zones
      await this.zonesClient.list({ project: this.projectId })
      return true
    } catch (error) {
      console.error('GCP authentication failed:', error)
      return false
    }
  }

  async listResources(): Promise<CloudResource[]> {
    const resources: CloudResource[] = []
    
    try {
      // Get Compute Engine Instances
      const computeInstances = await this.getComputeInstances()
      resources.push(...computeInstances)

    } catch (error) {
      console.error('Error listing GCP resources:', error)
    }

    return resources
  }

  private async getComputeInstances(): Promise<CloudResource[]> {
    const resources: CloudResource[] = []
    
    try {
      const [instances] = await this.instancesClient.aggregatedList({
        project: this.projectId
      })

      for (const [zone, instanceList] of Object.entries(instances)) {
        if (instanceList.instances) {
          for (const instance of instanceList.instances) {
            if (instance.id && instance.name) {
              const machineType = instance.machineType?.split('/').pop() || ''
              const zone = instance.zone?.split('/').pop() || ''
              const region = zone.slice(0, -2) // Remove zone suffix

              resources.push({
                id: instance.name,
                cloudAccountId: this.account.id,
                externalId: instance.id.toString(),
                name: instance.name,
                type: 'COMPUTE',
                status: this.mapInstanceStatus(instance.status || ''),
                region,
                tags: instance.labels || {},
                configuration: {
                  machineType,
                  zone,
                  cpuPlatform: instance.cpuPlatform,
                  canIpForward: instance.canIpForward,
                  deletionProtection: instance.deletionProtection,
                  preemptible: instance.scheduling?.preemptible,
                  automaticRestart: instance.scheduling?.automaticRestart
                },
                cost: this.estimateInstanceCost(machineType),
                lastSyncAt: new Date(),
                createdAt: instance.creationTimestamp ? new Date(instance.creationTimestamp) : new Date(),
                updatedAt: new Date()
              })
            }
          }
        }
      }
    } catch (error) {
      console.error('Error getting GCP instances:', error)
    }

    return resources
  }

  async getMetrics(resourceId: string, metricName: string, startTime: Date, endTime: Date): Promise<any[]> {
    try {
      const request = {
        name: `projects/${this.projectId}`,
        filter: `metric.type="compute.googleapis.com/${metricName}" AND resource.label.instance_name="${resourceId}"`,
        interval: {
          startTime: { seconds: Math.floor(startTime.getTime() / 1000) },
          endTime: { seconds: Math.floor(endTime.getTime() / 1000) }
        },
        aggregation: {
          alignmentPeriod: { seconds: 300 }, // 5 minutes
          perSeriesAligner: 'ALIGN_MEAN',
          crossSeriesReducer: 'REDUCE_MEAN'
        }
      }

      const [timeSeries] = await this.metricClient.listTimeSeries(request)
      
      const metrics: any[] = []
      for (const series of timeSeries) {
        if (series.points) {
          for (const point of series.points) {
            metrics.push({
              timestamp: point.interval?.endTime ? new Date(point.interval.endTime.seconds! * 1000) : new Date(),
              value: point.value?.doubleValue || point.value?.int64Value || 0,
              unit: series.metric?.type
            })
          }
        }
      }

      return metrics
    } catch (error) {
      console.error('Error getting GCP metrics:', error)
      return []
    }
  }

  async applyPolicy(resourceId: string, policy: any): Promise<boolean> {
    try {
      const zone = await this.getInstanceZone(resourceId)
      
      switch (policy.action) {
        case 'start':
          await this.instancesClient.start({
            project: this.projectId,
            zone,
            instance: resourceId
          })
          return true

        case 'stop':
          await this.instancesClient.stop({
            project: this.projectId,
            zone,
            instance: resourceId
          })
          return true

        case 'restart':
          await this.instancesClient.reset({
            project: this.projectId,
            zone,
            instance: resourceId
          })
          return true

        default:
          console.warn('Unknown policy action:', policy.action)
          return false
      }
    } catch (error) {
      console.error('Error applying GCP policy:', error)
      return false
    }
  }

  async getCostData(resourceId: string, startDate: Date, endDate: Date): Promise<number> {
    // This would require Google Cloud Billing API
    return 0
  }

  private async getInstanceZone(instanceName: string): Promise<string> {
    try {
      const [instances] = await this.instancesClient.aggregatedList({
        project: this.projectId,
        filter: `name=${instanceName}`
      })

      for (const [zoneName, instanceList] of Object.entries(instances)) {
        if (instanceList.instances?.some(i => i.name === instanceName)) {
          return zoneName.replace('zones/', '')
        }
      }
      
      return 'us-central1-a' // Default zone
    } catch (error) {
      console.error('Error getting instance zone:', error)
      return 'us-central1-a'
    }
  }

  private getProjectId(credentials: string): string {
    try {
      const creds = JSON.parse(credentials)
      return creds.project_id || creds.projectId
    } catch {
      return ''
    }
  }

  private getServiceAccountKey(credentials: string): string {
    try {
      const creds = JSON.parse(credentials)
      return creds.keyFilename || creds.private_key_path
    } catch {
      return ''
    }
  }

  private mapInstanceStatus(status: string): 'RUNNING' | 'STOPPED' | 'PENDING' | 'ERROR' {
    switch (status) {
      case 'RUNNING': return 'RUNNING'
      case 'TERMINATED': case 'STOPPED': return 'STOPPED'
      case 'PROVISIONING': case 'STAGING': case 'STOPPING': return 'PENDING'
      default: return 'ERROR'
    }
  }

  private estimateInstanceCost(machineType: string): number {
    // Rough cost estimation based on machine type
    const costMap: Record<string, number> = {
      'f1-micro': 4.28,
      'g1-small': 15.33,
      'e2-micro': 6.11,
      'e2-small': 12.23,
      'e2-medium': 24.45,
      'n1-standard-1': 24.27,
      'n1-standard-2': 48.55,
      'n1-standard-4': 97.09,
      'n2-standard-2': 58.40,
      'n2-standard-4': 116.80
    }
    return costMap[machineType] || 30.00
  }
}
