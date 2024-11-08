let chart;

// Monitor input fields to enable the button when all fields have values
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
        const initialCapital = document.getElementById('initial-capital').value;
        const interestRate = document.getElementById('interest-rate').value;
        const savingsRate = document.getElementById('savings-rate').value;
        const period = document.getElementById('period').value;

        // Enable button if all inputs have values
        document.getElementById('calculate-btn').disabled = !(initialCapital && interestRate && savingsRate && period);
    });
});

function calculate() {
    const initialCapital = parseFloat(document.getElementById('initial-capital').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const savingsRate = parseFloat(document.getElementById('savings-rate').value);
    const period = parseInt(document.getElementById('period').value);

    const monthlyRate = interestRate / 12;
    let invested = [];
    let interest = [];
    let totalInterest = 0;
    let total = initialCapital;
    let yearlyInvested = initialCapital;

    for (let month = 1; month <= period * 12; month++) {
        const monthlyInterest = total * monthlyRate;
        totalInterest += monthlyInterest;
        total += monthlyInterest + savingsRate;

        if (month % 12 === 0) { // Collect yearly summaries for the chart
            yearlyInvested += savingsRate * 12;
            invested.push(Math.round(yearlyInvested));
            interest.push(Math.round(totalInterest));
        }
    }

    document.getElementById('final-capital').textContent = `Final capital: ${Math.round(total)} €`;

    if (chart) {
        chart.destroy();
    }

    const ctx = document.getElementById('benefitChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: period }, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Invested',
                    data: invested,
                    backgroundColor: '#60a5fa',
                    borderColor: '#60a5fa',
                    borderWidth: 1
                },
                {
                    label: 'Interest',
                    data: interest,
                    backgroundColor: '#fbbf24',
                    borderColor: '#fbbf24',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Years'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (€)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'EUR',
                                   maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    // Show the result div after calculation
    document.getElementById('arif').style.display = 'block';
}