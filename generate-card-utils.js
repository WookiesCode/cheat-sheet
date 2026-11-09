// generate-card-utils.js
// Shared by the suite generators. Not a sheet: the generate- prefix keeps build-index.js and
// build-portable.js from treating it as one.
//
// mergeCommandCards: the generators used to split one command into up to three cards (the
// command with its first three flags, a "More options" card repeating the command with the
// rest of the flags, and a "Related commands" card). The masonry layout scattered the three
// across columns, and the sheet's table of contents filled with "Related commands". This folds
// them back into one card per command: every flag on the command, then its related commands
// (ids ending -sub-N, which common.js styles as a "Related" group).
// -flags-N / -recipes-N (most suites); -flags / -subcmds (InfiniBand).
const SPLIT = /-(flags|recipes)-\d+$|-(flags|subcmds)$/;

function mergeCommandCards(cards) {
  const out = [];
  let main = null;
  for (const card of cards) {
    const m = String(card.id || '').match(SPLIT);
    const kind = m ? (m[1] || m[2]) : '';
    if (!kind || !main) {
      out.push(card);
      main = /-pro-tips?$|-tips?$/.test(card.id || '') ? null : card;
      continue;
    }
    const lead = main.commands[0];
    if (kind === 'flags') {
      const extra = (card.commands[0] && card.commands[0].flags) || [];
      lead.flags = [...(lead.flags || []), ...extra];
    } else {
      main.commands.push(...card.commands);
    }
  }
  return out;
}

module.exports = { mergeCommandCards };
