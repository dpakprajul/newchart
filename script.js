var map = L.map('map').setView([39.0119, -98.4842], 4.5, zoomSnap = 0.1, zoomDelta = 0.1);
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

function style(feature) {
    return {
        weight: 0.6,
        opacity: 0.4,
        color: 'white',
        fillOpacity: 0.8,
        fillColor: getColor(feature.properties.frac_tot)
    };
}
info.update = function(props) {
    if (props) {
        if (props.party == 'Democratic') {
            var labels = ['Hillary Clinton', 'Bernie Sanders'];
            var data = [props.clinton_1746_president, props.sanders_1445_president];
            console.log('labels', labels, 'data', data);
            var dems = '<h4>US Primary Election Data 2016</h4>' + '<br />' + (props ? props.name + ' County' + '<br />' + '<br />' + '<b>Democratic Party Winner: ' + props.d_winner + '</b><br />' + 'Margin of Victory (%): ' + props.d_margin_pc.toFixed(2) : 'mehak');
            dems += '<canvas id="myChart" width="10" height="10"></canvas>';
            this._div.innerHTML = dems;
            newChart(labels, data);
        } else {
            var labels = ['Trump', 'Cruz', 'Kasich', 'Rubio'];
            var data = [props.trump_8639_president, props.cruz_61815_president, props.kasich_36679_president, props.rubio_53044_president];
            var reps = '<h4>US Primary Election Data 2016</h4>' + '<br />' + (props ? props.name + ' County' + '<br />' + '<br />' + '<b>Republican Party Winner: ' + props.r_winner + '</b><br />' + 'Margin of Victory (%): ' + props.r_margin_pc.toFixed(2) : 'andy');
            reps += '<canvas id="myChart" width="10" height="10"></canvas>';
            this._div.innerHTML = reps;
            newChart(labels, data);
        }
    }

    console.log('props:', props);
};

info.addTo(map);

function highlightFeature(e) {
    console.log('highlightFeature was entered');
    var layer = e.target;

    layer.setStyle({
        weight: 1.5,
        color: 'black',
        dashArray: '',
        fillOpacity: 0.7
    });



    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function getColor(b) {
    return b <= 0.0 & b > -0.25 ? '#85c4c9' :
        b <= -0.25 & b > -0.5 ? '#4f90a6' :
        b <= -0.5 & b > -0.75 ? '#3b738f' :
        b <= -0.75 & b >= -1.0 ? '#2a5674' :
        b > 0.0 & b <= 0.25 ? '#facba6' :
        b > 0.25 & b <= 0.5 ? '#f8b58b' :
        b > 0.5 & b <= 0.75 ? '#f2855d' :
        b > 0.75 & b <= 1.0 ? '#eb4a40' :
        'grey';
}

function onEachFeature(feature, layer) {
    console.log('onEachFeature was entered');
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

var geojson;
$.getJSON("https://mehak-carto.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20finalest%20&format=geojson&filename=finalest", function(data) {
    console.log('geojson retrieved');
    geojson = L.geoJson(data, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(map);
});

map.attributionControl.addAttribution('Primary Election Results 2016 &copy; <a href="https://www.kaggle.com/">Kaggle</a>');