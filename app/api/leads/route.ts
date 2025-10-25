import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, postcode, message, wrapperId, wrapperName, wrapperEmail } = body

    // Validate required fields
    if (!name || !email || !phone || !postcode || !message || !wrapperId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save lead to database
    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        postcode,
        message,
        wrapperId,
      },
    })

    // Send email to wrapper
    try {
      await resend.emails.send({
        from: 'Vinyl Wrapper Manchester <onboarding@resend.dev>',
        to: wrapperEmail,
        subject: `New Lead: ${name} - ${postcode}`,
        html: `
          <h2>New Lead Request</h2>
          <p>You have received a new lead request through Vinyl Wrapper Manchester.</p>

          <h3>Customer Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Postcode:</strong> ${postcode}</li>
          </ul>

          <h3>Project Details:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>

          <hr>
          <p style="color: #666; font-size: 12px;">
            This lead was submitted on ${new Date().toLocaleString('en-GB')}
          </p>
        `,
      })

      // Send confirmation email to customer
      await resend.emails.send({
        from: 'Vinyl Wrapper Manchester <onboarding@resend.dev>',
        to: email,
        subject: `Your quote request has been sent to ${wrapperName}`,
        html: `
          <h2>Thank you for your request!</h2>
          <p>Your quote request has been successfully sent to <strong>${wrapperName}</strong>.</p>

          <h3>Your Request Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Postcode:</strong> ${postcode}</li>
          </ul>

          <h3>Project Details:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>

          <p>${wrapperName} will review your request and contact you soon.</p>

          <hr>
          <p style="color: #666; font-size: 12px;">
            Vinyl Wrapper Manchester - Find Professional Vinyl Wrappers
          </p>
        `,
      })

      // Send notification to admin if email is configured
      if (process.env.ADMIN_EMAIL) {
        await resend.emails.send({
          from: 'Vinyl Wrapper Manchester <onboarding@resend.dev>',
          to: process.env.ADMIN_EMAIL,
          subject: `New Lead: ${name} → ${wrapperName}`,
          html: `
            <h2>New Lead Submitted</h2>
            <p><strong>Customer:</strong> ${name} (${email})</p>
            <p><strong>Wrapper:</strong> ${wrapperName} (${wrapperEmail})</p>
            <p><strong>Postcode:</strong> ${postcode}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
          `,
        })
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Lead was saved, but email failed - still return success
    }

    return NextResponse.json({
      success: true,
      lead,
    })
  } catch (error) {
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit lead request' },
      { status: 500 }
    )
  }
}
