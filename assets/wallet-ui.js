// Version: V1.1.0

const state = {
  sdk: null,
  provider: null,
  providerType: null,
  address: null,
  chainId: null,
  fcUser: null,
};

const LABELS = {
  disconnected: 'Connect',
  base: 'Base Wallet',
};

function shortAddr(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '…' + addr.slice(-4);
}

function isBaseChain(chainId) {
  return chainId === '0x2105' || chainId === '8453';
}

function getDisplayLabel() {
  if (state.fcUser?.username) return state.fcUser.username;
  if (state.fcUser?.displayName) return state.fcUser.displayName;
  if (state.providerType === 'base' && state.address) return LABELS.base + ' • ' + shortAddr(state.address);
  if (state.address) return shortAddr(state.address);
  return LABELS.disconnected;
}

function getAvatarUrl() {
  if (state.fcUser?.pfpUrl) return state.fcUser.pfpUrl;
  return '';
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
  try {
    const nonce = (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2, 10)) + 'fc';
    // NOTE: signIn result must be verified server-side before it is trusted.
    const result = await state.sdk.actions.signIn({ nonce, acceptAuthAddress: true });
    state.fcSignIn = result || null;
    if (state.sdk?.context?.user) state.fcUser = state.sdk.context.user;
  } catch (err) {
    console.error('Farcaster sign-in failed', err);
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

  const label = document.createElement('span');
  label.className = 'wallet-label';

  const menu = document.createElement('div');
  menu.className = 'wallet-menu';

  const fcBtn = document.createElement('button');
  fcBtn.textContent = 'Farcaster Sign In';
  fcBtn.onclick = farcasterSignin;

  const connectBtn = document.createElement('button');
  connectBtn.textContent = 'Connect Wallet';
  connectBtn.onclick = connectWallet;

  const disconnectBtn = document.createElement('button');
  disconnectBtn.textContent = 'Logout';
  disconnectBtn.onclick = disconnectWallet;

  const sub = document.createElement('div');
  sub.className = 'wallet-sub';
  sub.textContent = 'Farcaster → Base → Wallet address';

  menu.appendChild(fcBtn);
  menu.appendChild(connectBtn);
  menu.appendChild(disconnectBtn);
  menu.appendChild(sub);

  button.appendChild(avatar);
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

  header._els = { avatar, label, menu, fcBtn, connectBtn, disconnectBtn };
}

function updateUI() {
  const header = document.getElementById('walletHeader');
  if (!header || !header._els) return;
  const { avatar, label, fcBtn, disconnectBtn } = header._els;

  const avatarUrl = getAvatarUrl();
  if (avatarUrl) {
    avatar.src = avatarUrl;
    avatar.style.display = 'block';
  } else {
    avatar.removeAttribute('src');
    avatar.style.display = 'block';
  }

  label.textContent = getDisplayLabel();

  fcBtn.style.display = state.sdk?.actions?.signIn ? 'block' : 'none';
  disconnectBtn.style.display = state.address || state.fcUser ? 'block' : 'none';
}

async function boot() {
  buildHeader();
  await initSdk();
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
