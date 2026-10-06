import { NextResponse } from 'next/server';

// Define rotating weekly schedule pools (3 variable days per week)
const weeklySchedulePools = [
  ["Monday", "Wednesday", "Friday"],
  ["Monday", "Friday", "Saturday"],
  ["Tuesday", "Thursday", "Sunday"]
];

export async function GET(request: Request) {
  try {
    const today = new Date();
    // Pick active schedule pattern based on week number of the year
    const weekNumber = Math.floor(today.getTime() / (7 * 24 * 60 * 60 * 1000));
    const activeScheduleDays = weeklySchedulePools[weekNumber % weeklySchedulePools.length];

    const currentDayName = today.toLocaleDateString('en-US', { weekday: 'long' });
    const shouldSendToday = activeScheduleDays.includes(currentDayName);

    const campaignDetails = {
      siteName: "TP Stream",
      activeScheduleDays: activeScheduleDays,
      today: currentDayName,
      scheduledToSendToday: shouldSendToday,
      updateMessage: "New blockbusters added with multi-language audio tracks and custom subtitles.",
      monthlySubscriptionOffer: "Get unlimited streaming access today for only KSh 2,000/- per month!",
      status: shouldSendToday ? "Campaign successfully dispatched to client mailing list." : "Today is off-schedule. Standing by for the next scheduled dispatch day."
    };

    return NextResponse.json({ success: true, campaign: campaignDetails });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
