// WhatsApp message templates for the tournament lifecycle.
// Uses Meta template send when configured, plain-text fallback otherwise.

import { cfg } from './config.js';
import { sendMessage } from './whatsapp.js';
import { formatEventTime } from './time.js';

function uploadUrl(matchId) {
  return `${cfg.siteUrl.replace(/\/$/, '')}/upload/${matchId}`;
}

// Template 1 - fixture sent on payment + bracket generation.
export function notifyFixture(supabase, match, player) {
  const opponent = player.id === match.player_a_player_id ? match.player_b_tag : match.player_a_tag;
  return sendMessage(player.whatsapp, {
    template: 'fixture',
    text: `Payment CONFIRMED! You are in.\n\nYou vs ${opponent}\nRoom: ${match.room_code}\nTime: Tonight ${formatEventTime(match.fixture_time)}\n\nAfter your game upload the result screenshot here:\n${uploadUrl(match.id)}`,
    params: [
      opponent,
      match.room_code,
      formatEventTime(match.fixture_time),
      uploadUrl(match.id),
    ],
  });
}

// Template 2 - win notification + who's next (sent to both players when a
// next-round slot fills up).
export function notifyWinAndNextRound(supabase, match, player) {
  const opponent = player.id === match.player_a_player_id ? match.player_b_tag : match.player_a_tag;
  return sendMessage(player.whatsapp, {
    template: 'win',
    text: `You WON! The crowd ni nyuma yako. 🔥\n\nNext opponent: ${opponent}\nRoom: ${match.room_code}\nTime: Tonight ${formatEventTime(match.fixture_time)}\n\nUpload result here:\n${uploadUrl(match.id)}`,
    params: [
      opponent,
      match.room_code,
      formatEventTime(match.fixture_time),
      uploadUrl(match.id),
    ],
  });
}

// Template 3a - you lost.
export function notifyLost(supabase, parentMatch, player, winnerTag) {
  return sendMessage(player.whatsapp, {
    template: 'lost',
    text: `Sorry G. ${winnerTag} took the battle today.\nYou lost this one - come back for the next EFK Battles. The pot epo!`,
    params: [winnerTag],
  });
}

// Template 3b - under review / disputed.
export function notifyDispute(supabase, match, player) {
  return sendMessage(player.whatsapp, {
    template: 'dispute',
    text: `We could not confirm the result for your match vs ${
      player.id === match.player_a_player_id ? match.player_b_tag : match.player_a_tag
    }.\nUnder review - admin will check both screenshots and respond soon.`,
    params: [player.id === match.player_a_player_id ? match.player_b_tag : match.player_a_tag],
  });
}

// Champion + runner-up messages for the final.
export function notifyChampion(supabase, match, player, tournamentName) {
  return sendMessage(player.whatsapp, {
    template: 'win',
    text: `🏆 CONGRATULATIONS ${player.gamer_tag}!\nYou are the ${tournamentName} CHAMPION.\nKES ${cfg.entryFee * cfg.maxPlayers * 0.5} (50% ya pot) inakuja via M-Pesa. Asante!`,
    params: [tournamentName, `${cfg.entryFee * cfg.maxPlayers * 0.5}`],
  });
}

export function notifyRunnerUp(supabase, player, tournamentName) {
  return sendMessage(player.whatsapp, {
    template: 'lost',
    text: `Unapata 2nd place kwa ${tournamentName} - KES ${cfg.entryFee * cfg.maxPlayers * 0.2} (20% ya pot) via M-Pesa. Strong run G.`,
    params: [tournamentName, `${cfg.entryFee * cfg.maxPlayers * 0.2}`],
  });
}