const polygonAPIKey = 'W5gwoCzw8VOHJlmORf522qBqy3qBCUWM'; 
let stockChart;

function fetchStock() {
    const ticker = document.getElementById('stockInput').value.trim().toUpperCase();
    const rangeDays = parseInt(document.getElementById('dateRange').value);

    if (!ticker) {
        alert('Please enter a stock ticker!');
        return;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - rangeDays);

    const formatDate = (d) => d.toISOString().split('T')[0];
    const apiUrl = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formatDate(startDate)}/${formatDate(endDate)}?apiKey=${polygonAPIKey}`;

    console.log('API URL:', apiUrl); 

    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                alert('No stock data found.');
                return;
            }

            const dates = data.results.map(item => new Date(item.t).toLocaleDateString());
            const closes = data.results.map(item => item.c);

            renderChart(ticker, dates, closes);
        })
        .catch(err => {
            console.error('Fetch error:', err);
            alert('Cant load stock data.');
        });
}

function renderChart(ticker, labels, dataPoints) {
    const ctx = document.getElementById('stockChart').getContext('2d');

    if (stockChart) stockChart.destroy();

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${ticker} Closing Prices`,
                data: dataPoints,
                borderColor: 'blue',
                borderWidth: 2,
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });
}

fetch('https://dog.ceo/api/breeds/image/random/10')
    .then(res => res.json())
    .then(data => {
        const carousel = document.getElementById('carousel');
        if (carousel) {
            carousel.innerHTML = data.message.map(img => `<img src="${img}" class="dog-image">`).join('');
        }
    });

fetch('https://dog.ceo/api/breeds/list/all')
    .then(res => res.json())
    .then(data => {
        const buttons = document.getElementById('breedButtons');
        if (buttons) {
            Object.keys(data.message).forEach(breed => {
                const btn = document.createElement('button');
                btn.textContent = breed;
                btn.classList.add('breed-button');
                btn.onclick = () => loadBreedInfo(breed);
                buttons.appendChild(btn);
            });
        }
    });

async function loadBreedInfo(breed) {
    const response = await fetch('https://api.thedogapi.com/v1/breeds');
    const breeds = await response.json();
    const info = breeds.find(b => b.name.toLowerCase().includes(breed.toLowerCase()));
    const div = document.getElementById('breedInfo');

    if (!info) {
        alert('Breed info not found.');
        return;
    }

    div.innerHTML = `
        <h3>${info.name}</h3>
        <p>Temperament: ${info.temperament || 'N/A'}</p>
        <p>Life Span: ${info.life_span}</p>
    `;
    div.style.display = 'block';
}


if (annyang) {
    const commands = {
        'hello': () => alert('Hello World!'),
        'change the color to *color': (color) => {
            document.body.style.backgroundColor = color;
        },
        'navigate to *page': (page) => {
            const pages = { home: 'homeA2.html', stocks: 'stockA2.html', dogs: 'dogsA2.html' };
            if (pages[page.toLowerCase()]) {
                window.location.href = pages[page.toLowerCase()];
            } else {
                alert('Page not found.');
            }
        },
        'lookup *stock': (stock) => {
            document.getElementById('stockInput').value = stock.toUpperCase();
            document.getElementById('dateRange').value = "30";
            fetchStock();
        },
        'load dog breed *breed': (breed) => loadBreedInfo(breed)
    };
    annyang.addCommands(commands);
    annyang.start();
}

function startListening() {
    if (annyang) annyang.start();
}

function stopListening() {
    if (annyang) annyang.abort();
}