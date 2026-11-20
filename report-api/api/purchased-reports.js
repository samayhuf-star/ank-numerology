// POST /api/purchased-reports — body: { appUserId }
// Used by "Restore Purchases": returns the profiles whose Complete Report was bought (from the redemption ledger,
// verified against RevenueCat) so a reinstalled/new device can unlock them again. Also reports unused purchases.
const { listRestorable } = require('../lib/purchases');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method not allowed' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, error: 'invalid json' }); } }
  try {
    const r = await listRestorable(body && body.appUserId);
    return res.status(200).json({ ok: true, ...r });
  } catch (e) {
    return res.status(e.status || 500).json({ ok: false, error: e.message });
  }
};
