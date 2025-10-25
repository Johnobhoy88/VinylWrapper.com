import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple authentication check
function checkAuth(request: NextRequest) {
  // In a real application, use proper authentication
  // For MVP, we're relying on client-side password check
  return true
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const wrappers = await prisma.wrapper.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ wrappers })
  } catch (error) {
    console.error('Failed to fetch wrappers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wrappers' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, email, phone, bio, areasServed, portfolioImages } = body

    if (!name || !email || !phone || !bio || !areasServed) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const wrapper = await prisma.wrapper.create({
      data: {
        name,
        email,
        phone,
        bio,
        areasServed,
        portfolioImages: portfolioImages || [],
      },
    })

    return NextResponse.json({ wrapper })
  } catch (error) {
    console.error('Failed to create wrapper:', error)
    return NextResponse.json(
      { error: 'Failed to create wrapper' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Wrapper ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, email, phone, bio, areasServed, portfolioImages } = body

    const wrapper = await prisma.wrapper.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        bio,
        areasServed,
        portfolioImages: portfolioImages || [],
      },
    })

    return NextResponse.json({ wrapper })
  } catch (error) {
    console.error('Failed to update wrapper:', error)
    return NextResponse.json(
      { error: 'Failed to update wrapper' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Wrapper ID is required' },
        { status: 400 }
      )
    }

    await prisma.wrapper.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete wrapper:', error)
    return NextResponse.json(
      { error: 'Failed to delete wrapper' },
      { status: 500 }
    )
  }
}
