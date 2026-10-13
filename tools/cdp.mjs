// Runs a JS expression or file in one of the Deck's SteamUI pages over CEF remote debugging.
// usage: DECK_IP=192.168.x.x node cdp.mjs <page title substring> <file.js | -e expr>
// Enable "CEF Remote Debugging" in Decky's developer settings first.
import fs from 'node:fs';

const [, , title, a, b] = process.argv;
const ip = process.env.DECK_IP;
if (!ip || !title || !a) {
  console.error('usage: DECK_IP=<deck ip> node cdp.mjs <page title> <file.js | -e expr>');
  process.exit(1);
}
const expr = a === '-e' ? b : fs.readFileSync(a, 'utf8');
const list = await (await fetch(`http://${ip}:8081/json`)).json();
const target = list.find((p) => p.title.includes(title));
if (!target) {
  console.error('no page matching', title, list.map((p) => p.title));
  process.exit(1);
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, awaitPromise: true, returnByValue: true } }));
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id !== 1) return;
  if (d.result.exceptionDetails) console.error(JSON.stringify(d.result.exceptionDetails, null, 1));
  const v = d.result.result?.value;
  console.log(typeof v === 'string' ? v : JSON.stringify(v, null, 1));
  ws.close();
  process.exit(0);
};
