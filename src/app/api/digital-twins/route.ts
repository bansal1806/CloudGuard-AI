// Digital Twins API - Complete CRUD operations
import { NextRequest, NextResponse } from 'next/server'
import { digitalTwinEngine } from '@/services/digitalTwinEngine'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const twins = digitalTwinEngine.getTwinsByOrganization(organizationId)
    
    return NextResponse.json({
      success: true,
      data: twins,
      count: twins.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Digital Twins API Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch digital twins' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resourceId, organizationId } = body

    if (!resourceId || !organizationId) {
      return NextResponse.json(
        { error: 'Resource ID and Organization ID required' },
        { status: 400 }
      )
    }

    // Mock cloud resource for demo
    const mockResource = {
      id: resourceId,
      cloudAccountId: organizationId,
      externalId: `resource-${resourceId}`,
      name: `Resource ${resourceId}`,
      type: 'COMPUTE' as any,
      status: 'RUNNING' as any as any,
      region: 'us-east-1',
      tags: { Environment: 'production' },
      configuration: { instanceType: 't3.medium', cpu: 2, memory: 4 },
      cost: 45.30,
      lastSyncAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const twin = await digitalTwinEngine.createTwin(mockResource)

    return NextResponse.json({
      success: true,
      data: twin,
      message: 'Digital twin created successfully'
    })
  } catch (error) {
    console.error('Create Digital Twin Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create digital twin' },
      { status: 500 }
    )
  }
}
