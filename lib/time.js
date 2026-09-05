// East Africa Time (UTC+3) helpers without a tz database.
import { cfg } from './config.js';

// Wall-clock time in Nairobi expressed as a Date whose UTC fields are the EAT wall time.
function toEATWall(d) {
  return new Date(d.getTime() + 3 * 3600 * 1000);
}

// The real instant whose Nairobi wall time is y/m/d hh:mm:00.
function fromEATWall(year, monthIndex, day, hour, minute) {
  return new Date(Date.UTC(year, monthIndex, day, hour, minute, 0) - 3 * 3600 * 1000);
}

// Next scheduled tournament kick-off from the configured days/hour.
export function nextFixtureBase(now = new Date()) {
  const wall = toEATWall(now);
  const wd = wall.getUTCDay();
  const days = cfg.tournamentDays;

  if (days.includes(wd)) {
    const today = fromEATWall(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate(), cfg.tournamentHour, 0);
    if (today > now) return today;
  }
  for (let i = 1; i <= 8; i++) {
    const d = new Date(wall.getTime() + i * 86400000);
    if (days.includes(d.getUTCDay())) {
      return fromEATWall(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), cfg.tournamentHour, 0);
    }
  }
  return fromEATWall(wall.getUTCFullYear(), wall.getUTCMonth(), wall.getUTCDate(), cfg.tournamentHour, 0);
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function formatEventTime(date) {
  if (!date) return '8 PM';
  return new Intl.DateTimeFormat('en-KE', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi',
  }).format(new Date(date));
}

export function daysUntil(date) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
}

export function isPastNoShowDeadline(match, minutes = 15) {
  if (!match.fixture_time) return false;
  return Date.now() > new Date(match.fixture_time).getTime() + minutes * 60000;
}