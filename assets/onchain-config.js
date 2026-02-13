// Version: V1.1.0
(function () {
  if (typeof window === 'undefined') return;
  const defaults = {
    chain: {
      id: 84532,
      hexId: '0x14a34',
      name: 'Base Sepolia'
    },
    contracts: {
      card: '0x561F84D0b4246b64dFbAb1BDf87D6842412F1A18',
      deck: '0xc75170E7268A25CE759cEe019F1c6030F414a82d'
    }
  };

  // Optional runtime override (no code edit needed):
  // localStorage.setItem('token_onchain_config', JSON.stringify({
  //   contracts: { deck: '0xYourDeckContract' }
  // }))
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
