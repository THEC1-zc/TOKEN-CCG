// Version: V1.3.0

const state = {
  sdk: null,
  provider: null,
  providerType: null,
  address: null,
  chainId: null,
  fcUser: null,
};

const LABELS = {
  disconnected: 'Login',
  base: 'Base Wallet',
};

const FALLBACK_AVATAR =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">' +
      '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">' +
      '<stop offset="0" stop-color="#10B981"/><stop offset="1" stop-color="#0EA5E9"/>' +
      '</linearGradient></defs>' +
      '<rect width="64" height="64" rx="16" fill="url(#g)"/>' +
      '<path d="M20 22h24a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4zm4 8h16" stroke="#0a0a0f" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
  );
function shortAddr(addr) {
  if (!addr) return '';
  const s = toSafeString(addr);
  if (!s) return '';
  return s.slice(0, 6) + '…' + s.slice(-4);
}

function isBaseChain(chainId) {
  return chainId === '0x2105' || chainId === '8453';
}

function getDisplayLabel() {
  const u = state.fcUser?.username;
  if (u !== undefined && u !== null) return toSafeString(u);
  const dn = state.fcUser?.displayName;
  if (dn !== undefined && dn !== null) return toSafeString(dn);
  if (state.providerType === 'base' && state.address) return LABELS.base + ' • ' + shortAddr(state.address);
  if (state.address) return shortAddr(state.address);
  return LABELS.disconnected;
}

function toSafeString(value) {
  if (typeof value === 'string') return value;
  if (value == null) return '';
  try {
    return String(value);
  } catch (_) {
    try {
      return JSON.stringify(value);
    } catch (_) {
      return '';
    }
  }
}

function getAvatarUrl() {
  const pfp = state.fcUser?.pfpUrl;
  if (typeof pfp === 'string') return pfp;
  if (pfp && typeof pfp === 'object') {
    if (typeof pfp.url === 'string') return pfp.url;
    if (typeof pfp.src === 'string') return pfp.src;
  }
  return FALLBACK_AVATAR;
}

async function initSdk() {
  try {
    const mod = await import('https://esm.sh/@farcaster/miniapp-sdk');
    state.sdk = mod.sdk || null;
  } catch (_) {
    state.sdk = null;
  }

  if (state.sdk?.context?.user) {
    state.fcUser = state.sdk.context.user;
  }
}

function getProvider() {
  if (state.sdk?.wallet?.getEthereumProvider) {
    try {
      const p = state.sdk.wallet.getEthereumProvider();
      if (p) {
        state.providerType = 'base';
        return p;
      }
    } catch (_) {}
  }
  if (window.ethereum) {
    state.providerType = 'browser';
    return window.ethereum;
  }
  return null;
}

function getBaseProvider() {
  if (state.sdk?.wallet?.getEthereumProvider) {
    try {
      const p = state.sdk.wallet.getEthereumProvider();
      if (p) {
        state.providerType = 'base';
        return p;
      }
    } catch (_) {}
  }
  return null;
}

function pickBrowserProvider() {
  const eth = window.ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers) && eth.providers.length) {
    const mm = eth.providers.find((p) => p.isMetaMask);
    return mm || eth.providers[0];
  }
  return eth;
}

function getBrowserProvider() {
  const provider = pickBrowserProvider();
  if (provider) {
    state.providerType = 'browser';
    return provider;
  }
  return null;
}

async function connectBaseWallet() {
  const provider = getBaseProvider();
  if (!provider || typeof provider.request !== 'function') {
    alert('Base wallet provider not available in this context.');
    return;
  }
  state.provider = provider;
  try {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    state.address = accounts?.[0] || null;
    state.chainId = await provider.request({ method: 'eth_chainId' });
    attachProviderEvents(provider);
  } catch (err) {
    console.error('Base wallet connect failed', err);
  }
  updateUI();
}

async function connectBrowserWallet() {
  const provider = getBrowserProvider();
  if (!provider) {
    alert('No browser wallet provider found.');
    return;
  }
  state.provider = provider;
  try {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    state.address = accounts?.[0] || provider.selectedAddress || null;
    state.chainId = await provider.request({ method: 'eth_chainId' });
    attachProviderEvents(provider);
  } catch (err) {
    console.error('Browser wallet connect failed', err);
    alert('Wallet connect failed. Check if MetaMask is unlocked and connected.');
  }
  updateUI();
}

async function connectWallet() {
  const provider = getProvider();
  if (!provider) {
    alert('No wallet provider found.');
    return;
  }
  state.provider = provider;
  try {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    state.address = accounts?.[0] || null;
    state.chainId = await provider.request({ method: 'eth_chainId' });
    if (isBaseChain(state.chainId)) state.providerType = 'base';
    attachProviderEvents(provider);
  } catch (err) {
    console.error('Wallet connect failed', err);
  }
  updateUI();
}

function disconnectWallet() {
  state.address = null;
  state.chainId = null;
  state.provider = null;
  state.providerType = null;
  updateUI();
}

function attachProviderEvents(provider) {
  if (!provider?.on) return;
  provider.on('accountsChanged', (accs) => {
    state.address = accs?.[0] || null;
    updateUI();
  });
  provider.on('chainChanged', (cid) => {
    state.chainId = cid;
    if (isBaseChain(cid)) state.providerType = 'base';
    updateUI();
  });
}

async function farcasterSignin() {
  if (!state.sdk?.actions?.signIn) return;
  if (!state.sdk?.context?.user && !state.sdk?.context?.client) {
    alert('Farcaster login works only inside a Mini App.');
    return;
  }
  try {
    const nonce = (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2, 10)) + 'fc';
    // NOTE: signIn result must be verified server-side before it is trusted.
    const result = await state.sdk.actions.signIn({ nonce, acceptAuthAddress: true });
    state.fcSignIn = result || null;
    if (state.sdk?.context?.user) state.fcUser = state.sdk.context.user;
  } catch (err) {
    console.warn('Farcaster sign-in failed', err);
  }
  updateUI();
}

function buildHeader() {
  if (document.getElementById('walletHeader')) return;

  const header = document.createElement('div');
  header.className = 'wallet-header';
  header.id = 'walletHeader';

  const button = document.createElement('button');
  button.className = 'wallet-button';
  button.type = 'button';

  const avatar = document.createElement('img');
  avatar.className = 'wallet-avatar';
  avatar.alt = 'avatar';

  const icon = document.createElement('span');
  icon.className = 'wallet-icon';
  icon.textContent = '⇄';

  const label = document.createElement('span');
  label.className = 'wallet-label';

  const nameLine = document.createElement('span');
  nameLine.className = 'wallet-name';
  const addrLine = document.createElement('span');
  addrLine.className = 'wallet-address';

  const menu = document.createElement('div');
  menu.className = 'wallet-menu';

  const fcBtn = document.createElement('button');
  fcBtn.innerHTML = '<span class="menu-row"><span class="menu-icon fc">FC</span><span>Farcaster Login</span></span>';
  fcBtn.onclick = farcasterSignin;

  const baseBtn = document.createElement('button');
  baseBtn.innerHTML = '<span class="menu-row"><span class="menu-icon base">B</span><span>Base Login</span></span>';
  baseBtn.onclick = connectBaseWallet;

  const browserBtn = document.createElement('button');
  browserBtn.innerHTML = '<span class="menu-row"><span class="menu-icon wallet">W</span><span>Wallet Login</span></span>';
  browserBtn.onclick = connectBrowserWallet;

  const adminBtn = document.createElement('button');
  adminBtn.innerHTML = '<span class="menu-row"><span class="menu-icon">A</span><span>Admin</span></span>';
  adminBtn.onclick = () => {
    window.location.href = 'admin.html';
  };

  const disconnectBtn = document.createElement('button');
  disconnectBtn.innerHTML = '<span class="menu-row"><span class="menu-icon">⏻</span><span>Logout</span></span>';
  disconnectBtn.onclick = disconnectWallet;

  const sub = document.createElement('div');
  sub.className = 'wallet-sub';
  sub.textContent = 'Farcaster → Base → Wallet address';

  menu.appendChild(fcBtn);
  menu.appendChild(baseBtn);
  menu.appendChild(browserBtn);
  menu.appendChild(adminBtn);
  menu.appendChild(disconnectBtn);
  menu.appendChild(sub);

  label.appendChild(nameLine);
  label.appendChild(addrLine);

  button.appendChild(avatar);
  button.appendChild(icon);
  button.appendChild(label);

  button.onclick = () => {
    menu.classList.toggle('open');
  };

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) menu.classList.remove('open');
  });

  header.appendChild(button);
  header.appendChild(menu);
  const mount = document.getElementById('walletHeaderMount');
  if (mount) mount.appendChild(header);
  else document.body.appendChild(header);

  header._els = { avatar, icon, label, nameLine, addrLine, menu, fcBtn, baseBtn, browserBtn, adminBtn, disconnectBtn };
}

function updateUI() {
  const header = document.getElementById('walletHeader');
  if (!header || !header._els) return;
  const { avatar, icon, label, nameLine, addrLine, fcBtn, baseBtn, browserBtn, adminBtn, disconnectBtn } = header._els;

  const avatarUrl = getAvatarUrl();
  if (avatarUrl) {
    avatar.src = String(avatarUrl);
    avatar.style.display = 'block';
  } else {
    avatar.removeAttribute('src');
    avatar.style.display = 'none';
  }

  const displayLabel = String(getDisplayLabel());
  const shortAddress = state.address ? shortAddr(state.address) : '';
  nameLine.textContent = displayLabel || LABELS.disconnected;
  addrLine.textContent = shortAddress || '';
  label.classList.toggle('connected', Boolean(state.address || state.fcUser));
  icon.style.display = state.address || state.fcUser ? 'none' : 'inline-flex';

  const isMiniApp = Boolean(state.sdk?.context?.user || state.sdk?.context?.client);
  const baseProvider = getBaseProvider();
  fcBtn.style.display = isMiniApp && state.sdk?.actions?.signIn ? 'block' : 'none';
  baseBtn.style.display = Boolean(baseProvider && typeof baseProvider.request === 'function') ? 'block' : 'none';
  browserBtn.style.display = window.ethereum ? 'block' : 'none';
  disconnectBtn.style.display = state.address || state.fcUser ? 'block' : 'none';
  adminBtn.style.display = window.TokenWallet?.isOwner?.('0xd29c790466675153A50DF7860B9EFDb689A21cDe') ? 'block' : 'none';

  document.dispatchEvent(new CustomEvent('token:wallet-updated', {
    detail: {
      address: state.address,
      fcUser: state.fcUser,
      providerType: state.providerType
    }
  }));
}

async function boot() {
  buildHeader();
  await initSdk();
  try {
    if (window.ethereum?.request) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts?.[0]) {
        state.address = accounts[0];
        state.providerType = 'browser';
      }
    }
  } catch (_) {}
  updateUI();
  try {
    if (state.sdk?.actions?.ready) {
      await state.sdk.actions.ready();
    }
  } catch (_) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

if (typeof window !== 'undefined') {
  window.TokenWallet = {
    getAddress: () => state.address,
    getFarcasterUser: () => state.fcUser,
    getProviderType: () => state.providerType,
    getDisplayLabel,
    connectBaseWallet,
    connectBrowserWallet,
    farcasterSignin,
    disconnectWallet,
    isOwner: (ownerAddress) => {
      if (!ownerAddress || !state.address) return false;
      return state.address.toLowerCase() === ownerAddress.toLowerCase();
    }
  };
}
