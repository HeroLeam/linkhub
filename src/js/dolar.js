(function () {
  const usdInput   = document.getElementById('usdInput');
  const brlInput   = document.getElementById('brlInput');
  const rateText   = document.getElementById('rateText');
  const updatedAt  = document.getElementById('updatedAt');
  const refreshBtn = document.getElementById('refreshRate');
  const swapBtn    = document.getElementById('swapBtn');

  // Se a calculadora não existir nesta página, sai sem erro
  if (!usdInput || !brlInput || !rateText || !refreshBtn || !swapBtn) return;

  let rate = null;          // USD -> BRL
  let inverse = false;
  let typingLock = false;

  const fmtBRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const fmtUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  function setRateDisplay() {
    if (!rate) { rateText.textContent = 'Cotação indisponível'; return; }
    rateText.textContent = inverse
      ? `BRL◄USD: 1 BRL = ${fmtUSD.format(1 / rate)}`
      : `USD►BRL: 1 USD = ${fmtBRL.format(rate)}`;
  }
  function setUpdatedAt(ts) {
    updatedAt.textContent = ts ? `Atualizado em ${new Date(ts).toLocaleString('pt-BR')}` : '';
  }
  const sanitize = (n) => {
    const v = Number(n);
    return Number.isFinite(v) ? v : 0;
  };

  function convertFromUSD() {
    if (!rate || typingLock) return;
    typingLock = true;
    const usd = sanitize(usdInput.value);
    brlInput.value = usd ? (usd * rate).toFixed(2) : '';
    typingLock = false;
  }
  function convertFromBRL() {
    if (!rate || typingLock) return;
    typingLock = true;
    const brl = sanitize(brlInput.value);
    usdInput.value = brl ? (brl / rate).toFixed(2) : '';
    typingLock = false;
  }
  function recalcBoth() {
    if (document.activeElement === brlInput) convertFromBRL();
    else convertFromUSD();
  }
  function swapDirection() {
    inverse = !inverse;
    setRateDisplay();
    const u = usdInput.value;
    usdInput.value = brlInput.value;
    brlInput.value = u;
    recalcBoth();
  }

  async function fetchFromProviders() {
    try {
      const r1 = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL', { cache: 'no-store' });
      const j1 = await r1.json();
      if (j1?.rates?.BRL) return Number(j1.rates.BRL);
    } catch (e) {}
    try {
      const r2 = await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL', { cache: 'no-store' });
      const j2 = await r2.json();
      if (j2?.rates?.BRL) return Number(j2.rates.BRL);
    } catch (e) {}
    try {
      const r3 = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-store' });
      const j3 = await r3.json();
      if (j3?.result === 'success' && j3?.rates?.BRL) return Number(j3.rates.BRL);
    } catch (e) {}
    throw new Error('Nenhum provedor respondeu');
  }

  async function fetchRate() {
    rateText.textContent = 'Atualizando...';
    try {
      rate = await fetchFromProviders();
      localStorage.setItem('usdbrl_rate', JSON.stringify({ rate, ts: Date.now() }));
      setRateDisplay();
      setUpdatedAt(Date.now());
      usdInput.value = '1';
      convertFromUSD();
    } catch (e) {
      const cached = localStorage.getItem('usdbrl_rate');
      if (cached) {
        const { rate: cr, ts } = JSON.parse(cached);
        rate = Number(cr);
        setRateDisplay();
        setUpdatedAt(ts);
        rateText.textContent += ' (offline)';
        usdInput.value = '1';
        convertFromUSD();
      } else {
        rateText.textContent = 'Não foi possível obter a cotação.';
      }
    }
  }

  usdInput.addEventListener('input', () => { if (!inverse) convertFromUSD(); else convertFromBRL(); });
  brlInput.addEventListener('input', () => { if (!inverse) convertFromBRL(); else convertFromUSD(); });
  refreshBtn.addEventListener('click', fetchRate);
  swapBtn.addEventListener('click', swapDirection);

  // init
  const cached = localStorage.getItem('usdbrl_rate');
  if (cached) {
    const { rate: cr, ts } = JSON.parse(cached);
    rate = Number(cr);
    setRateDisplay();
    setUpdatedAt(ts);
    usdInput.value = '1';
    convertFromUSD();
  }
  fetchRate();
})();