// Version: V1.5.0 - TokenCard V0.5.0 + TokenGame V0.1.0 + Admin API key hook
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
    },
    admin: {
      apiKey: ''
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
    contracts: { ...defaults.contracts, ...(runtime.contracts || {}) },
    admin: { ...defaults.admin, ...(runtime.admin || {}) }
  };

  window.TokenOnchainConfig = merged;
  if (merged.admin?.apiKey && !window.TOKEN_ADMIN_API_KEY) {
    window.TOKEN_ADMIN_API_KEY = merged.admin.apiKey;
  }
})();
