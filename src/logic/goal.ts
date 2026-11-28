/** Turns the onboarding goal into short, honest lines for the first result card, the offer card and the paywall. */
const LINES: Record<string, { first: string; offer: string; pro: string }> = {
  career: { first: 'You came here for a career decision. Read the numbers below with that in mind.', offer: 'Includes the career chapter: strengths, timing and what to watch.', pro: 'Check any date or name as often as you weigh a career move.' },
  love: { first: 'You came here for love and compatibility. Read the numbers below with that in mind.', offer: 'Includes the love chapter and how your numbers pair with others.', pro: 'Check as many people and dates as you need, with no limit.' },
  money: { first: 'You came here for money and business. Read the numbers below with that in mind.', offer: 'Includes the money chapter and your lucky dates for starts.', pro: 'Check names and dates for every deal or launch without limits.' },
  name: { first: 'You came here to choose a name. Start with your birth numbers, then test names.', offer: 'Includes your name worked out letter by letter, with spelling options.', pro: 'Test as many names and spellings as you like.' },
  curious: { first: 'You are exploring your numbers. Every card shows the working so you can check it.', offer: 'Includes your past, this year, the next five years and a 30-day plan.', pro: 'Explore every profile and date without limits.' },
};
export const goalLines = (goal?: string) => (goal ? LINES[goal] : undefined);
