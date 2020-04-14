document.getElementsByClassName('menutoggle')[0].onclick = function() {
    var menu = document.getElementById('menu');
    if(menu.className == "active"){
        menu.className = "inactive";
    } else {
        menu.className = "active";
    }
}

window.onload = function() {
    // Menu Toggle
    var menuToggle = document.getElementsByClassName('menutoggle')[0];

    if (menuToggle) {
        menuToggle.onclick = function() {
            var menu = document.getElementById('menu');
            if(menu.className == "active"){
                menu.className = "inactive";
            } else {
                menu.className = "active";
            }
        }
    }

    // Charts
    google.charts.load('current', {
        'packages': [
            'corechart', 
            'gauge'
        ]
    });
    google.charts.setOnLoadCallback(drawChart);

    // Redraw charts on window resize (after a short timeout)
    var resizeTo;
    window.onresize = function() {
        if(resizeTo) clearTimeout(resizeTo);
        resizeTo = setTimeout(drawChart, 500);
    };
};

function drawChart() {
    var speedPromixityChartData = google.visualization.arrayToDataTable([
        ['Year', 'Top speed in km/h', 'Proximity to planets/asteroids in km'],
        ['4 hours ago',  1100,      440],
        ['3 hours ago',  1170,      460],
        ['2 hours ago',  660,       1120],
        ['1 hour ago',  1030,      540],
        ['now', 1210,      300]
    ]);
    
    var fuelData = google.visualization.arrayToDataTable([
        ['Label', 'Value'],
        ['Fuel', 100]
    ]);
    
    var passengerStatusData = google.visualization.arrayToDataTable([
        ['Task', 'Amount of people'],
        ['Cryogenic sleep',     138],
        ['Maintenance duties',      2],
        ['Night watch',  3],
        ['Eating', 4],
        ['Sleeping',    12]
      ]);

    var speedPromixityChart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    var passengerStatusChart = new google.visualization.PieChart(document.getElementById('piechart'));
    var fuelChart = new google.visualization.Gauge(document.getElementById('chart_div'));

    // fuel/distance chart visual code
    speedPromixityChart.draw(speedPromixityChartData, {
        title: 'speed/proximity chart',
        width: '100%',
        height: '100%',
        curveType: 'function',
        legend: { position: 'bottom' }
    });

    // Pie chart, because I love pies.
    passengerStatusChart.draw(passengerStatusData, {
        title: 'Passenger Status'
    });
     
    // Gague visual code
    fuelChart.draw(fuelData, {
        // width: 400, height: 120,
        redFrom: 90, redTo: 100,
        yellowFrom:75, yellowTo: 90,
        minorTicks: 5
    });

    console.log('Finished drawing graphs.');
}