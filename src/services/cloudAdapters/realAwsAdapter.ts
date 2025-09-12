// Real AWS SDK Integration for CloudGuard AI
import { 
  EC2Client, 
  DescribeInstancesCommand,
  StartInstancesCommand,
  StopInstancesCommand,
  RebootInstancesCommand
} from '@aws-sdk/client-ec2'
import { 
  CloudWatchClient,
  GetMetricStatisticsCommand
} from '@aws-sdk/client-cloudwatch'
import { 
  RDSClient,
  DescribeDBInstancesCommand
} from '@aws-sdk/client-rds'
import { 
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand
} from '@aws-sdk/client-s3'
import { 
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommand
} from '@aws-sdk/client-elastic-load-balancing-v2'
import { ICloudAdapter, CloudResource, CloudAccount } from './baseAdapter'

export class RealAWSAdapter implements ICloudAdapter {
  private ec2Client: EC2Client
  private cloudWatchClient: CloudWatchClient
  private rdsClient: RDSClient
  private s3Client: S3Client
  private elbClient: ElasticLoadBalancingV2Client
  private account: CloudAccount

  constructor(account: CloudAccount) {
    this.account = account
    
    const credentials = this.decryptCredentials(account.credentials)
    const config = {
      region: account.region || 'us-east-1',
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        sessionToken: credentials.sessionToken // For temporary credentials
      }
    }

    this.ec2Client = new EC2Client(config)
    this.cloudWatchClient = new CloudWatchClient(config)
    this.rdsClient = new RDSClient(config)
    this.s3Client = new S3Client(config)
    this.elbClient = new ElasticLoadBalancingV2Client(config)
  }

  async authenticate(): Promise<boolean> {
    try {
      // Test authentication by listing instances
      await this.ec2Client.send(new DescribeInstancesCommand({ MaxResults: 1 }))
      return true
    } catch (error) {
      console.error('AWS authentication failed:', error)
      return false
    }
  }

  async listResources(): Promise<CloudResource[]> {
    const resources: CloudResource[] = []
    
    try {
      // Get EC2 Instances
      const ec2Instances = await this.getEC2Instances()
      resources.push(...ec2Instances)

      // Get RDS Instances
      const rdsInstances = await this.getRDSInstances()
      resources.push(...rdsInstances)

      // Get S3 Buckets
      const s3Buckets = await this.getS3Buckets()
      resources.push(...s3Buckets)

      // Get Load Balancers
      const loadBalancers = await this.getLoadBalancers()
      resources.push(...loadBalancers)

    } catch (error) {
      console.error('Error listing AWS resources:', error)
    }

    return resources
  }

  private async getEC2Instances(): Promise<CloudResource[]> {
    const command = new DescribeInstancesCommand({})
    const response = await this.ec2Client.send(command)
    const resources: CloudResource[] = []

    response.Reservations?.forEach(reservation => {
      reservation.Instances?.forEach(instance => {
        if (instance.InstanceId && instance.State?.Name !== 'terminated') {
          const tags = instance.Tags?.reduce((acc, tag) => {
            if (tag.Key && tag.Value) {
              acc[tag.Key] = tag.Value
            }
            return acc
          }, {} as Record<string, string>) || {}

          resources.push({
            id: instance.InstanceId,
            cloudAccountId: this.account.id,
            externalId: instance.InstanceId,
            name: tags.Name || instance.InstanceId,
            type: 'COMPUTE',
            status: this.mapEC2State(instance.State?.Name || ''),
            region: instance.Placement?.AvailabilityZone?.slice(0, -1) || this.account.region || '',
            tags,
            configuration: {
              instanceType: instance.InstanceType,
              platform: instance.Platform || 'linux',
              architecture: instance.Architecture,
              virtualizationType: instance.VirtualizationType,
              keyName: instance.KeyName,
              securityGroups: instance.SecurityGroups?.map(sg => sg.GroupName).filter(Boolean),
              subnetId: instance.SubnetId,
              vpcId: instance.VpcId
            },
            cost: this.estimateEC2Cost(instance.InstanceType || ''),
            lastSyncAt: new Date(),
            createdAt: instance.LaunchTime || new Date(),
            updatedAt: new Date()
          })
        }
      })
    })

    return resources
  }

  private async getRDSInstances(): Promise<CloudResource[]> {
    const command = new DescribeDBInstancesCommand({})
    const response = await this.rdsClient.send(command)
    const resources: CloudResource[] = []

    response.DBInstances?.forEach(dbInstance => {
      if (dbInstance.DBInstanceIdentifier) {
        resources.push({
          id: dbInstance.DBInstanceIdentifier,
          cloudAccountId: this.account.id,
          externalId: dbInstance.DBInstanceArn || dbInstance.DBInstanceIdentifier,
          name: dbInstance.DBInstanceIdentifier,
          type: 'DATABASE',
          status: this.mapRDSState(dbInstance.DBInstanceStatus || ''),
          region: dbInstance.AvailabilityZone?.slice(0, -1) || this.account.region || '',
          tags: {},
          configuration: {
            engine: dbInstance.Engine,
            engineVersion: dbInstance.EngineVersion,
            dbInstanceClass: dbInstance.DBInstanceClass,
            allocatedStorage: dbInstance.AllocatedStorage,
            storageType: dbInstance.StorageType,
            multiAZ: dbInstance.MultiAZ,
            publiclyAccessible: dbInstance.PubliclyAccessible,
            storageEncrypted: dbInstance.StorageEncrypted
          },
          cost: this.estimateRDSCost(dbInstance.DBInstanceClass || ''),
          lastSyncAt: new Date(),
          createdAt: dbInstance.InstanceCreateTime || new Date(),
          updatedAt: new Date()
        })
      }
    })

    return resources
  }

  private async getS3Buckets(): Promise<CloudResource[]> {
    const command = new ListBucketsCommand({})
    const response = await this.s3Client.send(command)
    const resources: CloudResource[] = []

    if (response.Buckets) {
      for (const bucket of response.Buckets) {
        if (bucket.Name) {
          let region = 'us-east-1'
          try {
            const locationResponse = await this.s3Client.send(
              new GetBucketLocationCommand({ Bucket: bucket.Name })
            )
            region = locationResponse.LocationConstraint || 'us-east-1'
          } catch (error) {
            // Use default region if we can't get location
          }

          resources.push({
            id: bucket.Name,
            cloudAccountId: this.account.id,
            externalId: bucket.Name,
            name: bucket.Name,
            type: 'STORAGE',
            status: 'RUNNING',
            region,
            tags: {},
            configuration: {
              bucketType: 'S3',
              versioning: 'unknown',
              encryption: 'unknown'
            },
            cost: 0, // Would need additional API calls to get size/cost
            lastSyncAt: new Date(),
            createdAt: bucket.CreationDate || new Date(),
            updatedAt: new Date()
          })
        }
      }
    }

    return resources
  }

  private async getLoadBalancers(): Promise<CloudResource[]> {
    const command = new DescribeLoadBalancersCommand({})
    const response = await this.elbClient.send(command)
    const resources: CloudResource[] = []

    response.LoadBalancers?.forEach(lb => {
      if (lb.LoadBalancerArn && lb.LoadBalancerName) {
        resources.push({
          id: lb.LoadBalancerName,
          cloudAccountId: this.account.id,
          externalId: lb.LoadBalancerArn,
          name: lb.LoadBalancerName,
          type: 'NETWORK',
          status: this.mapLBState(lb.State?.Code || ''),
          region: lb.AvailabilityZones?.[0]?.ZoneName?.slice(0, -1) || this.account.region || '',
          tags: {},
          configuration: {
            type: lb.Type,
            scheme: lb.Scheme,
            ipAddressType: lb.IpAddressType,
            vpcId: lb.VpcId,
            availabilityZones: lb.AvailabilityZones?.map(az => az.ZoneName).filter(Boolean)
          },
          cost: this.estimateLBCost(lb.Type || ''),
          lastSyncAt: new Date(),
          createdAt: lb.CreatedTime || new Date(),
          updatedAt: new Date()
        })
      }
    })

    return resources
  }

  async getMetrics(resourceId: string, metricName: string, startTime: Date, endTime: Date): Promise<any[]> {
    try {
      const command = new GetMetricStatisticsCommand({
        Namespace: 'AWS/EC2',
        MetricName: metricName,
        Dimensions: [
          {
            Name: 'InstanceId',
            Value: resourceId
          }
        ],
        StartTime: startTime,
        EndTime: endTime,
        Period: 300, // 5 minutes
        Statistics: ['Average', 'Maximum']
      })

      const response = await this.cloudWatchClient.send(command)
      return response.Datapoints?.map(dp => ({
        timestamp: dp.Timestamp,
        average: dp.Average,
        maximum: dp.Maximum,
        unit: dp.Unit
      })) || []
    } catch (error) {
      console.error('Error getting AWS metrics:', error)
      return []
    }
  }

  async applyPolicy(resourceId: string, policy: any): Promise<boolean> {
    try {
      switch (policy.action) {
        case 'start':
          await this.ec2Client.send(new StartInstancesCommand({
            InstanceIds: [resourceId]
          }))
          return true

        case 'stop':
          await this.ec2Client.send(new StopInstancesCommand({
            InstanceIds: [resourceId]
          }))
          return true

        case 'restart':
          await this.ec2Client.send(new RebootInstancesCommand({
            InstanceIds: [resourceId]
          }))
          return true

        default:
          console.warn('Unknown policy action:', policy.action)
          return false
      }
    } catch (error) {
      console.error('Error applying AWS policy:', error)
      return false
    }
  }

  async getCostData(resourceId: string, startDate: Date, endDate: Date): Promise<number> {
    // This would require AWS Cost Explorer API
    // For now, return estimated cost based on resource type
    return 0
  }

  private decryptCredentials(encryptedCredentials: string): any {
    // In production, implement proper credential decryption
    return JSON.parse(encryptedCredentials)
  }

  private mapEC2State(state: string): 'RUNNING' | 'STOPPED' | 'PENDING' | 'ERROR' {
    switch (state) {
      case 'running': return 'RUNNING'
      case 'stopped': return 'STOPPED'
      case 'pending': case 'starting': return 'PENDING'
      case 'stopping': case 'shutting-down': return 'PENDING'
      default: return 'ERROR'
    }
  }

  private mapRDSState(state: string): 'RUNNING' | 'STOPPED' | 'PENDING' | 'ERROR' {
    switch (state) {
      case 'available': return 'RUNNING'
      case 'stopped': return 'STOPPED'
      case 'starting': case 'stopping': case 'rebooting': return 'PENDING'
      default: return 'ERROR'
    }
  }

  private mapLBState(state: string): 'RUNNING' | 'STOPPED' | 'PENDING' | 'ERROR' {
    switch (state) {
      case 'active': return 'RUNNING'
      case 'provisioning': return 'PENDING'
      case 'failed': return 'ERROR'
      default: return 'PENDING'
    }
  }

  private estimateEC2Cost(instanceType: string): number {
    // Rough cost estimation based on instance type
    const costMap: Record<string, number> = {
      't2.micro': 8.76,
      't2.small': 17.52,
      't2.medium': 35.04,
      't3.micro': 7.59,
      't3.small': 15.18,
      't3.medium': 30.37,
      't3.large': 60.74,
      'm5.large': 70.08,
      'm5.xlarge': 140.16,
      'c5.large': 62.56,
      'c5.xlarge': 125.12
    }
    return costMap[instanceType] || 50.00 // Default estimate
  }

  private estimateRDSCost(instanceClass: string): number {
    const costMap: Record<string, number> = {
      'db.t3.micro': 14.60,
      'db.t3.small': 29.20,
      'db.t3.medium': 58.40,
      'db.r5.large': 131.40,
      'db.r5.xlarge': 262.80
    }
    return costMap[instanceClass] || 75.00
  }

  private estimateLBCost(type: string): number {
    return type === 'application' ? 22.27 : 18.25 // Monthly cost
  }
}
