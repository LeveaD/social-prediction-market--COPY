/* Quick test script to exercise envoiService.handleEnvoiInbound using compiled backend dist JS
   Usage: node scripts/test-envoi.js
*/
const path = require('path');
const svc = require(path.join(__dirname, '..', 'backend', 'dist', 'services', 'envoiService.js'));
const sample = require(path.join(__dirname, '..', 'sponsors', 'envoi', 'envoi-webhook-sample.json'));
(async () => {
  for (const ev of sample) {
    try {
      await svc.handleEnvoiInbound(ev);
      console.log('processed', ev.eventName);
    } catch (err) {
      console.error('failed to process', ev.eventName, err);
    }
  }
})();
