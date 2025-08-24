// Simple 3-symbol slot with a fair-ish RNG and payout table
const SYMBOLS = ['🍋','🍒','🔔','💎'];
const WEIGHTS = [0.4, 0.3, 0.2, 0.1]; // rarer 💎
const PAY = { '💎💎💎':50, '🔔🔔🔔':20, '🍒🍒🍒':10, '🍋🍋🍋':5 };

function spinSymbol(){
  const r = Math.random();
  let acc = 0;
  for (let i=0;i<SYMBOLS.length;i++){
    acc += WEIGHTS[i];
    if (r <= acc) return SYMBOLS[i];
  }
  return SYMBOLS.at(-1);
}

export const Slots = {
  spin(bet){
    const s = [spinSymbol(), spinSymbol(), spinSymbol()];
    const key = s.join('');
    let payoutMult = PAY[key] ?? 0;

    if (!payoutMult) {
      // Check "any two of a kind" → 2× bet
      if (s[0]===s[1] || s[1]===s[2] || s[0]===s[2]) payoutMult = 2;
    }
    const win = Math.floor(payoutMult * bet);
    const delta = win - bet; // subtract bet, add win
    const msg = win ? `You won $${win}` : 'No win. Better luck next spin!';
    return { symbols:s, payout:win, delta, msg };
  }
};
