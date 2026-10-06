import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { plan, region } = body;

    // If region is international, route to Stripe / Global Card processor
    if (region === 'international') {
      return NextResponse.json({ 
        success: true, 
        gateway: 'Stripe',
        message: 'Redirecting to secure international card checkout for KSh 2,000/- equivalent (~$15 USD/month)...',
        checkoutUrl: 'https://checkout.stripe.com/pay/mock_tp_stream_global' 
      });
    }

    // Default local payment (M-Pesa)
    return NextResponse.json({ 
      success: true, 
      gateway: 'M-Pesa STK Push',
      message: 'Initiating Safaricom M-Pesa prompt to your phone for KSh 2,000/-...' 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
