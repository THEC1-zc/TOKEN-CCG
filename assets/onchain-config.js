// Version: V1.4.0 - TokenCard V0.5.0 + TokenGame V0.1.0 DEPLOYED
(function () {
  if (typeof window === 'undefined') return;
  const defaults = {
    chain: {
      id: 84532,
      hexId: '0x14a34',
      name: 'Base Sepolia'
    },
    contracts: {
      card: '0x9D7f74d0C41E726EC95884E0e97Fa6129e3b5E99',  // TokenCard V0.5.0
      deck: '0xc75170E7268A25CE759cEe019F1c6030F414a82d',  // TokenDeck V0.1.0
      game: '0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005'   // TokenGame V0.1.0
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
