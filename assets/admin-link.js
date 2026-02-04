// Version: V1.0.0
(function () {
  const OWNER = '0xd29c790466675153A50DF7860B9EFDb689A21cDe';

  function updateAdminVisibility() {
    const links = document.querySelectorAll('.admin-link');
    const badge = document.getElementById('adminBadge');
    const isOwner = window.TokenWallet?.isOwner?.(OWNER);
    links.forEach((link) => {
      if (isOwner) link.classList.remove('hidden');
      else link.classList.add('hidden');
    });
    if (badge) {
      if (isOwner) badge.classList.remove('hidden');
      else badge.classList.add('hidden');
    }
  }

  document.addEventListener('token:wallet-updated', updateAdminVisibility);
  window.addEventListener('load', updateAdminVisibility);
})();
