// Version: V1.2.0 - TokenCard V0.4.0 with claimGameXp
(function () {
  if (typeof window === 'undefined') return;
  const defaults = {
    chain: {
      id: 84532,
      hexId: '0x14a34',
      name: 'Base Sepolia'
    },
    contracts: {
      card: '0xDA0bab807633f07f013f94DD0E6A4F96F8742B53',
      deck: '0xc75170E7268A25CE759cEe019F1c6030F414a82d'
    }
  };

  let runtime = {};
  try {
    runtime = JSON.parse(localStorage.getItem('token_onchain_config') || '{}');
  } catch (_) {
    runtime = {};
  }

  const merged = {
    chain: { ...defaults.chain, ...(runtime.chain || {}) },
    contracts: { ...defaults.contracts, ...(runtime.contracts || {}) }
  };

  window.TokenOnchainConfig = merged;
})();
