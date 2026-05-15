(function () {
  const config = window.ICHIGEKI_ADS || {};
  const slots = config.slots || {};
  let scriptLoading = null;

  function hasAdsenseConfig(slotName) {
    return Boolean(
      config.enabled &&
      config.provider === "adsense" &&
      config.adsenseClient &&
      slots[slotName]
    );
  }

  function loadAdsense() {
    if (scriptLoading) return scriptLoading;
    scriptLoading = new Promise((resolve, reject) => {
      const existing = document.querySelector("script[data-ichigeki-adsense]");
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.ichigekiAdsense = "true";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(config.adsenseClient)}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return scriptLoading;
  }

  function renderAdsense(target, slotName) {
    target.innerHTML = "";
    target.classList.add("ad-live");

    const ad = document.createElement("ins");
    ad.className = "adsbygoogle";
    ad.style.display = "block";
    ad.dataset.adClient = config.adsenseClient;
    ad.dataset.adSlot = slots[slotName];
    ad.dataset.adFormat = "auto";
    ad.dataset.fullWidthResponsive = "true";
    target.appendChild(ad);

    loadAdsense()
      .then(() => {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      })
      .catch(() => {
        target.classList.remove("ad-live");
        target.innerHTML = "<span>AD</span>広告枠";
      });
  }

  function initAds() {
    document.querySelectorAll("[data-ad-placement]").forEach(target => {
      const slotName = target.dataset.adPlacement || "footer";
      if (hasAdsenseConfig(slotName)) {
        renderAdsense(target, slotName);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds);
  } else {
    initAds();
  }
})();
