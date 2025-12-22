const exchangeRates = {
    'USD': { 'MNT': 3450, 'EUR': 0.92, 'JPY': 148.5, 'CNY': 7.24 },
    'MNT': { 'USD': 1/3450, 'EUR': 1/3750, 'JPY': 1/23.2, 'CNY': 1/476 },
    'EUR': { 'USD': 1.09, 'MNT': 3750, 'JPY': 161.3, 'CNY': 7.85 },
    'JPY': { 'USD': 1/148.5, 'MNT': 23.2, 'EUR': 1/161.3, 'CNY': 0.048 },
    'CNY': { 'USD': 1/7.24, 'MNT': 476, 'EUR': 1/7.85, 'JPY': 1/0.048 }
};

// Элементүүдийг DOM-оос авах
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from');
const toSelect = document.getElementById('to');
const resultDisplay = document.getElementById('result-display');
const historyList = document.getElementById('history-list');

let historyData = JSON.parse(localStorage.getItem('conv_history')) || [];

function updateHistoryUI() {
    historyList.innerHTML = historyData.length === 0 
        ? '<li style="text-align:center; color:var(--secondary); padding:20px;">Түүх хоосон</li>' 
        : '';
    
    // Түүхийг урвуу дарааллаар харуулах
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

    // Түүхийг хадгалах
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

// Event Listeners
document.getElementById('convert-btn').onclick = calculate;

document.getElementById('clear-history').onclick = () => {
    historyData = [];
    localStorage.removeItem('conv_history');
    updateHistoryUI();
};

// Анх ачаалахад түүхийг харуулах
updateHistoryUI();