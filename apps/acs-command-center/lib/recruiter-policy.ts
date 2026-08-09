export const recruiterPolicy = {
  bestEmail: "elie.s.kurtz@gmail.com",
  responseTargetMinutes: 120,
  responseCriticalMinutes: 180,
  resume: {
    version: "General G3 final",
    filename: "E.Kurtz Resume.pdf",
    url: "https://drive.google.com/file/d/1Z4Oos8AFcn5RmInJ0DuG3HEAg5Jrwqh7/view?usp=drivesdk",
    rule: "Default for all roles. Use an industry-specific version only after a current, validated version exists and the role calls for it.",
  },
} as const;

export type RecruiterContext = {
  nextStep?: string;
  applicationSuggestions?: string[];
  availabilityDisclosure?: "none-weekend" | "weekday-through-6pm-et" | "friday-through-3pm-et" | "not-requested";
  roleFit?: string;
};

function timeZoneOffsetMs(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const asUtc = Date.UTC(value("year"), value("month") - 1, value("day"), value("hour"), value("minute"), value("second"));
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

function zonedDateTimeToUtc(
  values: { year: number; month: number; day: number; hour: number; minute: number; second: number },
  timeZone: string,
) {
  const guess = new Date(Date.UTC(values.year, values.month - 1, values.day, values.hour, values.minute, values.second));
  let result = new Date(guess.getTime() - timeZoneOffsetMs(guess, timeZone));
  result = new Date(guess.getTime() - timeZoneOffsetMs(result, timeZone));
  return result;
}

export function recruiterDeadlines(receivedAt: string, timeZone = "America/New_York") {
  const received = new Date(receivedAt);
  if (Number.isNaN(received.getTime())) throw new Error("Invalid recruiter received time");
  const target = new Date(received.getTime() + recruiterPolicy.responseTargetMinutes * 60_000);
  const critical = new Date(received.getTime() + recruiterPolicy.responseCriticalMinutes * 60_000);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(received);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  const nextDay = new Date(Date.UTC(value("year"), value("month") - 1, value("day") + 1));
  const hard = zonedDateTimeToUtc(
    {
      year: nextDay.getUTCFullYear(), month: nextDay.getUTCMonth() + 1, day: nextDay.getUTCDate(),
      hour: 0, minute: 0, second: 0,
    },
    timeZone,
  );
  hard.setMilliseconds(-1);
  return { target, critical, hard };
}

export function validateRecruiterDraft(draft: string, availabilityDisclosure: RecruiterContext["availabilityDisclosure"]) {
  const issues: string[] = [];
  if (!draft.includes(recruiterPolicy.bestEmail)) issues.push("missing-best-email");
  if (availabilityDisclosure === "none-weekend" && /\b(?:am|pm|a\.m\.|p\.m\.)\b/i.test(draft)) issues.push("weekend-availability-disclosed");
  return issues;
}
