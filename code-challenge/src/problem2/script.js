// API Configuration
  const PRICES_URL = 'https://interview.switcheo.com/prices.json';
  const ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

// Application state
const state = {
  fromToken: null,
  toToken: null,
  fromAmount: "",
  toAmount: "",
  slippage: "0.1",
  isLoading: false,
  currentSelector: null, // 'from' or 'to'
  tokens: [],
  prices: {},
  balances: {}
}

// Cache whether a token icon exists to avoid repeated 404 requests
const iconAvailability = {};

// Pre-populate cache with known missing icons to prevent 404s
const knownMissingIcons = [
  'AMPLUNA', 'STATOM', 'STEVMOS', 'STLUNA', 'STOSMO', 'WSTETH', 
  'YIELDUSD', 'RATOM', 'RSWTH', 'BNEO', 'AXLUSDC'
];

// Initialize cache with known missing icons
knownMissingIcons.forEach(symbol => {
  iconAvailability[symbol] = false;
});

// DOM elements
const elements = {
  settingsBtn: document.getElementById("settingsBtn"),
  settingsPanel: document.getElementById("settingsPanel"),
  fromTokenSelector: document.getElementById("fromTokenSelector"),
  toTokenSelector: document.getElementById("toTokenSelector"),
  fromAmount: document.getElementById("fromAmount"),
  toAmount: document.getElementById("toAmount"),
  swapArrowBtn: document.getElementById("swapArrowBtn"),
  swapBtn: document.getElementById("swapBtn"),
  maxBtn: document.getElementById("maxBtn"),
  tokenModal: document.getElementById("tokenModal"),
  modalClose: document.getElementById("modalClose"),
  tokenSearch: document.getElementById("tokenSearch"),
  tokenList: document.getElementById("tokenList"),
  swapDetails: document.getElementById("swapDetails"),
  detailsHeader: document.getElementById("detailsHeader"),
  detailsContent: document.getElementById("detailsContent"),
  chevronIcon: document.getElementById("chevronIcon"),
  toast: document.getElementById("toast"),
  toastClose: document.getElementById("toastClose"),
  loadingSpinner: document.getElementById("loadingSpinner"),
  swapBtnText: document.querySelector(".swap-btn-text"),
}

// Fetch prices from API
async function fetchPrices() {
  try {
    const response = await fetch(PRICES_URL);
    if (!response.ok) throw new Error('Failed to fetch prices');
    const priceData = await response.json();
    
    // Convert to map by symbol
    const prices = {};
    const tokens = [];
    
    priceData.forEach(item => {
      if (item.currency && item.price) {
        const symbol = item.currency.toUpperCase();
        prices[symbol] = Number(item.price);
        tokens.push({
          symbol: symbol,
          name: item.name || symbol,
          price: Number(item.price),
          icon: symbol // Will be replaced with actual icon
        });
      }
    });
    
    // Sort tokens by symbol
    tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));
    
    state.prices = prices;
    state.tokens = tokens;
    
    // Set default tokens if available
    if (tokens.length >= 2) {
      state.fromToken = tokens[0];
      state.toToken = tokens[1];
    }
    
    return { prices, tokens };
  } catch (error) {
    console.error('Error fetching prices:', error);
    showToast('Failed to load token prices', 'error');
    return { prices: {}, tokens: [] };
  }
}

// Generate mock balances for demonstration
function generateMockBalances() {
  const balances = {};
  state.tokens.forEach(token => {
    balances[token.symbol] = Math.random() * 1000 + 100; // Random balance between 100-1100
  });
  state.balances = balances;
}

// Build icon URL for token
function buildIconUrl(symbol) {
  return ICON_BASE + encodeURIComponent(symbol.toUpperCase()) + '.svg';
}

// Set token icon with fallback
function setTokenIcon(element, symbol) {
  if (!symbol || !element) return;

  // Clear previous contents but keep the container node
  element.innerHTML = "";

  // If we know this icon does not exist, render fallback immediately
  if (iconAvailability[symbol] === false) {
    const textIcon = document.createElement('div');
    textIcon.textContent = symbol.charAt(0);
    textIcon.style.width = '32px';
    textIcon.style.height = '32px';
    textIcon.style.borderRadius = '50%';
    textIcon.style.background = 'rgba(102, 126, 234, 0.1)';
    textIcon.style.display = 'flex';
    textIcon.style.alignItems = 'center';
    textIcon.style.justifyContent = 'center';
    textIcon.style.fontSize = '14px';
    textIcon.style.fontWeight = '500';
    element.appendChild(textIcon);
    return;
  }

  const img = document.createElement('img');
  img.src = buildIconUrl(symbol);
  img.alt = symbol;
  img.loading = 'lazy';
  img.style.width = '32px';
  img.style.height = '32px';
  img.style.borderRadius = '50%';

  // Fallback to text if image fails to load
  img.onerror = function() {
    element.innerHTML = "";
    const textIcon = document.createElement('div');
    textIcon.textContent = symbol.charAt(0);
    textIcon.style.width = '32px';
    textIcon.style.height = '32px';
    textIcon.style.borderRadius = '50%';
    textIcon.style.background = 'rgba(102, 126, 234, 0.1)';
    textIcon.style.display = 'flex';
    textIcon.style.alignItems = 'center';
    textIcon.style.justifyContent = 'center';
    textIcon.style.fontSize = '14px';
    textIcon.style.fontWeight = '500';
    element.appendChild(textIcon);
    // Remember that this icon is unavailable to prevent future 404s
    iconAvailability[symbol] = false;
  };

  img.onload = function() {
    iconAvailability[symbol] = true;
  }

  element.appendChild(img);
}

// Initialize app
async function init() {
  setupEventListeners()
  
  // Show loading state
  showToast('Loading token data...', 'info');
  
  // Fetch real data from API
  await fetchPrices();
  generateMockBalances();
  
  // Update UI with real data
  updateUI()
  populateTokenList()
  
  showToast('Token data loaded successfully', 'success');
}

// Event listeners
function setupEventListeners() {
  // Settings
  elements.settingsBtn.addEventListener("click", toggleSettings)

  // Slippage buttons
  document.querySelectorAll(".slippage-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => setSlippage(e.target.dataset.value))
  })

  document.getElementById("customSlippage").addEventListener("input", (e) => {
    setSlippage(e.target.value)
    updateSlippageButtons()
  })

  // Token selectors
  elements.fromTokenSelector.addEventListener("click", () => openTokenModal("from"))
  elements.toTokenSelector.addEventListener("click", () => openTokenModal("to"))

  // Amount input
  elements.fromAmount.addEventListener("input", handleAmountChange)

  // Swap arrow
  elements.swapArrowBtn.addEventListener("click", swapTokens)

  // Max button
  elements.maxBtn.addEventListener("click", setMaxAmount)

  // Main swap button
  elements.swapBtn.addEventListener("click", handleSwap)

  // Modal
  elements.modalClose.addEventListener("click", closeTokenModal)
  elements.tokenModal.addEventListener("click", (e) => {
    if (e.target === elements.tokenModal) closeTokenModal()
  })

  // Token search (optional)
  if (elements.tokenSearch) {
    elements.tokenSearch.addEventListener("input", filterTokens)
  }

  // Swap details
  elements.detailsHeader.addEventListener("click", toggleSwapDetails)

  // Toast
  elements.toastClose.addEventListener("click", hideToast)

  // Keyboard events
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTokenModal()
      hideToast()
    }
  })
}

// Settings functions
function toggleSettings() {
  const isVisible = elements.settingsPanel.style.display !== "none"
  elements.settingsPanel.style.display = isVisible ? "none" : "block"
}

function setSlippage(value) {
  state.slippage = value
  updateSlippageButtons()
  updateSwapDetails()
}

function updateSlippageButtons() {
  document.querySelectorAll(".slippage-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.value === state.slippage)
  })

  const customInput = document.getElementById("customSlippage")
  if (!["0.1", "0.5", "1.0"].includes(state.slippage)) {
    customInput.value = state.slippage
  }
}

// Token selection functions
async function openTokenModal(selector) {
  state.currentSelector = selector
  elements.tokenModal.style.display = "flex"
  if (elements.tokenSearch) {
    elements.tokenSearch.value = ""
  }
  // If tokens haven't loaded yet, fetch them now
  if (!state.tokens || state.tokens.length === 0) {
    await fetchPrices()
    generateMockBalances()
  }
  populateTokenList()
}

function closeTokenModal() {
  elements.tokenModal.style.display = "none"
  state.currentSelector = null
}

function populateTokenList() {
  const availableTokens = (state.tokens && state.tokens.length ? state.tokens : []).filter((token) => {
    if (state.currentSelector === "from") {
      return token.symbol !== state.toToken?.symbol
    } else {
      return token.symbol !== state.fromToken?.symbol
    }
  })

  if (!availableTokens.length) {
    elements.tokenList.innerHTML = '<div class="token-item-name" style="padding:12px;color:#6b7280;">No tokens available. Please try again.</div>'
    return
  }

  elements.tokenList.innerHTML = availableTokens
    .map(
      (token) => `
        <button class="token-item" onclick="selectToken('${token.symbol}')">
            <div class="token-item-info">
                <div class="token-icon" id="token-icon-${token.symbol}">${token.symbol.charAt(0)}</div>
                <div class="token-item-details">
                    <div class="token-item-symbol">${token.symbol}</div>
                    <div class="token-item-name">${token.name}</div>
                </div>
            </div>
            <div class="token-item-price">$${token.price.toLocaleString()}</div>
        </button>
    `,
    )
    .join("")
    
  // Load token icons after rendering
  availableTokens.forEach(token => {
    const iconElement = document.getElementById(`token-icon-${token.symbol}`)
    if (iconElement) {
      setTokenIcon(iconElement, token.symbol)
    }
  })
}

function selectToken(tokenSymbol) {
  const token = state.tokens.find((t) => t.symbol === tokenSymbol)
  if (!token) return

  if (state.currentSelector === "from") {
    state.fromToken = token
  } else {
    state.toToken = token
  }

  closeTokenModal()
  updateUI()
  calculateToAmount()
}

function filterTokens() {
  const query = elements.tokenSearch.value.toLowerCase()
  const tokenItems = elements.tokenList.querySelectorAll(".token-item")

  tokenItems.forEach((item) => {
    const symbol = item.querySelector(".token-item-symbol").textContent.toLowerCase()
    const name = item.querySelector(".token-item-name").textContent.toLowerCase()
    const matches = symbol.includes(query) || name.includes(query)
    item.style.display = matches ? "flex" : "none"
  })
}

// Amount calculation functions
function handleAmountChange() {
  state.fromAmount = elements.fromAmount.value
  calculateToAmount()
  updateUI()
}

function calculateToAmount() {
  if (state.fromAmount && state.fromToken && state.toToken) {
    const rate = state.fromToken.price / state.toToken.price
    const calculatedAmount = (Number.parseFloat(state.fromAmount) * rate).toFixed(6)
    state.toAmount = calculatedAmount
  } else {
    state.toAmount = ""
  }
  updateSwapDetails()
}

function setMaxAmount() {
  if (state.fromToken && state.balances[state.fromToken.symbol]) {
    state.fromAmount = state.balances[state.fromToken.symbol].toString()
    elements.fromAmount.value = state.fromAmount
    calculateToAmount()
    updateUI()
  }
}

// Swap functions
function swapTokens() {
  const tempToken = state.fromToken
  state.fromToken = state.toToken
  state.toToken = tempToken

  state.fromAmount = state.toAmount
  elements.fromAmount.value = state.fromAmount

  calculateToAmount()
  updateUI()
}

async function handleSwap() {
  if (!state.fromAmount || Number.parseFloat(state.fromAmount) <= 0) {
    showToast("Invalid Amount", "Please enter a valid amount to swap", "error")
    return
  }

  state.isLoading = true
  updateSwapButton()

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    showToast(
      "Swap Successful!",
      `Swapped ${state.fromAmount} ${state.fromToken.symbol} for ${state.toAmount} ${state.toToken.symbol}`,
      "success",
    )

    // Reset form
    state.fromAmount = ""
    state.toAmount = ""
    elements.fromAmount.value = ""
    updateUI()
  } catch (error) {
    showToast("Swap Failed", "Something went wrong. Please try again.", "error")
    } finally {
    state.isLoading = false
    updateSwapButton()
  }
}

// Swap details functions
function toggleSwapDetails() {
  const isExpanded = elements.detailsContent.style.display !== "none"
  elements.detailsContent.style.display = isExpanded ? "none" : "block"
  elements.chevronIcon.classList.toggle("expanded", !isExpanded)
}

function updateSwapDetails() {
  if (state.fromAmount && state.toAmount && state.fromToken && state.toToken) {
    const exchangeRate = (state.fromToken.price / state.toToken.price).toFixed(6)
    const minimumReceived = (Number.parseFloat(state.toAmount) * (1 - Number.parseFloat(state.slippage) / 100)).toFixed(
      6,
    )

    document.getElementById("exchangeRate").textContent =
      `1 ${state.fromToken.symbol} = ${exchangeRate} ${state.toToken.symbol}`
    document.getElementById("slippageDisplay").textContent = `${state.slippage}%`
    document.getElementById("minimumReceived").textContent = `${minimumReceived} ${state.toToken.symbol}`

    elements.swapDetails.style.display = "block"
  } else {
    elements.swapDetails.style.display = "none"
  }
}

// UI update functions
function updateUI() {
  // Update token displays
  updateTokenDisplay("from")
  updateTokenDisplay("to")

  // Update amounts
  document.getElementById("toAmount").textContent = state.toAmount || "0.0"

  // Update USD values
  const fromUsdValue = state.fromAmount && state.fromToken
    ? (Number.parseFloat(state.fromAmount) * state.fromToken.price).toFixed(2)
    : "0.00"
  const toUsdValue = state.toAmount && state.toToken 
    ? (Number.parseFloat(state.toAmount) * state.toToken.price).toFixed(2) 
    : "0.00"

  document.getElementById("fromUsdValue").textContent = `$${fromUsdValue}`
  document.getElementById("toUsdValue").textContent = `$${toUsdValue}`

  // Update balance display
  if (state.fromToken && state.balances[state.fromToken.symbol]) {
    document.getElementById("fromSymbol").textContent = state.fromToken.symbol
    document.getElementById("fromBalance").textContent = state.balances[state.fromToken.symbol].toFixed(2)
  }

  // Update swap button state
  updateSwapButton()
}

function updateTokenDisplay(type) {
  const token = type === "from" ? state.fromToken : state.toToken
  if (!token) return
  
  const prefix = type === "from" ? "from" : "to"
  const iconElement = document.getElementById(`${prefix}TokenIcon`)

  // Set token icon with fallback
  setTokenIcon(iconElement, token.symbol)
  
  document.getElementById(`${prefix}TokenSymbol`).textContent = token.symbol
  document.getElementById(`${prefix}TokenName`).textContent = token.name
}

function updateSwapButton() {
  const hasAmount = state.fromAmount && state.toAmount && Number.parseFloat(state.fromAmount) > 0

  elements.swapBtn.disabled = !hasAmount || state.isLoading
  elements.loadingSpinner.style.display = state.isLoading ? "block" : "none"
  elements.swapBtnText.textContent = state.isLoading ? "Swapping..." : "Confirm Swap"
}

// Toast functions
function showToast(title, description, type = "info") {
  document.getElementById("toastTitle").textContent = title
  document.getElementById("toastDescription").textContent = description

  elements.toast.className = `toast ${type}`
  elements.toast.style.display = "flex"

  // Auto hide after 5 seconds
  setTimeout(hideToast, 5000)
}

function hideToast() {
  elements.toast.style.display = "none"
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init)
