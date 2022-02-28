const chart_data = new Object(null)

chart_data.labels = [
    '',
    '',
    '',
    '',
    '',
];

chart_data.data = {
    labels: chart_data.labels,
    datasets: [{
        borderColor: 'rgb(0, 0, 255)',
        data: [0, 30, 10, 35, 25],
        lineTension: 0.4,
        radius: 6,
        pointRadius: 0,
        showLine: true,
        showLegend: false,
    }],
};

chart_data.config = {
    type: 'line',
    data: chart_data.data,
    options: {
        animation: {
            duration: 0
        },
        maintainAspectRatio: false,
        plugins: {
            legend: false // Hide legend
        },
        scales: {
            y: {
                display: false, // Hide Y axis labels
                min: 0,
                max: 40,
            },
            x: {
                display: false // Hide X axis labels
            },
   
        },
    }
};
export default Object.freeze(chart_data)
