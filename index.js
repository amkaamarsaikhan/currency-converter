const exchangeRates = {
    'USD': { 'MNT': 3415.00, 'EUR': 0.94, 'JPY': 155.20, 'CNY': 7.28 },
    'MNT': { 'USD': 0.0002928, 'EUR': 0.0002758, 'JPY': 0.0454545, 'CNY': 0.0021322 },
    'EUR': { 'USD': 1.06, 'MNT': 3625.00, 'JPY': 165.10, 'CNY': 7.74 },
    'JPY': { 'USD': 0.00644, 'MNT': 22.00, 'EUR': 0.00605, 'CNY': 0.0469 },
    'CNY': { 'USD': 0.1373, 'MNT': 469.00, 'EUR': 0.1292, 'JPY': 21.32 }
};

// Elements
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const resultDisplay = document.getElementById('result-display');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// 1. Theme Logic
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

themeToggle.onclick = () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
};

// 2. Conversion Logic
let historyData = JSON.parse(localStorage.getItem('conv_history')) || [];

function updateHistoryUI() {
    historyList.innerHTML = historyData.length === 0
        ? '<li style="text-align:center; color:var(--secondary); padding:20px;">Түүх хоосон</li>'
        : '';

    [...historyData].reverse().forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <strong>${item.amount} ${item.from} ➔ ${item.result} ${item.to}</strong>
            <span class="history-date">${item.date}</span>
        `;
        historyList.appendChild(li);
    });
}

function calculate() {
    const amount = parseFloat(amountInput.value);
    const from = fromSelect.value;
    const to = toSelect.value;

    if (isNaN(amount) || amount <= 0) {
        alert("Зөв мөнгөн дүн оруулна уу!");
        return;
    }

    const rate = from === to ? 1 : exchangeRates[from][to];
    const convertedAmount = (amount * rate).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    resultDisplay.textContent = `${convertedAmount} ${to}`;
    

    const entry = {
        amount: amount,
        from: from,
        to: to,
        result: convertedAmount,
        date: new Date().toLocaleString()
    };

    historyData.push(entry);
    if (historyData.length > 10) historyData.shift();

    localStorage.setItem('conv_history', JSON.stringify(historyData));
    updateHistoryUI();
}


document.getElementById('convert-btn').onclick = calculate;

document.getElementById('clear-history').onclick = () => {
    historyData = [];
    localStorage.removeItem('conv_history');
    updateHistoryUI();
};


updateHistoryUI();