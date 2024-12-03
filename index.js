// Configuración del mapa
const map = L.map('map').setView([-38.95, -68.06], 6); // Centrado en Neuquén

// Agregar un mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cargar observatorios desde un archivo GeoJSON
fetch('observatorios.geojson')
    .then(response => response.json())
    .then(data => {
        const markers = L.markerClusterGroup();

        // Crear capas a partir del GeoJSON
        L.geoJSON(data, {
            onEachFeature: (feature, layer) => {
                // Crear el contenido del popup
                const popupContent = `
                    <div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5;">
                        <div style="background-color: #007BFF; color: white; padding: 8px; border-radius: 5px; text-align: center; font-weight: bold;">
                            ${feature.properties["Nombre del Observatorio"]}
                        </div>
                        <div style="padding: 8px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
                            <p style="margin: 0;"><b>Temática:</b> ${feature.properties.tematica}</p>
                            <p style="margin: 0;"><b>Norma Legal:</b> ${feature.properties.norma_legal}</p>
                            <p style="margin: 0;"><b>Dependencia:</b> ${feature.properties.dependencia_ins}</p>
                        </div>
                    </div>
                `;
                layer.bindPopup(popupContent);
            },
            pointToLayer: (feature, latlng) => {
                // Asignar color según el campo `alcance_territorial`
                let color = 'gray';
                if (feature.properties.alcance_territorial === 'Regional') color = 'red';
                if (feature.properties.alcance_territorial === 'Provincial') color = 'orange';
                if (feature.properties.alcance_territorial === 'Municipal') color = 'green';

                // Crear un marcador circular con el color correspondiente
                return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: color,
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            }
        }).addTo(markers);

        map.addLayer(markers);
    });

// Lógica de la leyenda
const toggleButton = document.getElementById('toggle-legend');
const legend = document.getElementById('legend');

toggleButton.addEventListener('click', () => {
    const isExpanded = legend.style.display === 'block';
    legend.style.display = isExpanded ? 'none' : 'block';
    toggleButton.textContent = isExpanded ? 'Mostrar Leyenda' : 'Ocultar Leyenda';
    toggleButton.setAttribute('aria-expanded', !isExpanded);
});

// Función para manejar las secciones de la leyenda
const toggleSection = (buttonId, sectionId) => {
    const button = document.getElementById(buttonId);
    const section = document.getElementById(sectionId);

    button.addEventListener('click', () => {
        const isExpanded = section.style.display === 'block';
        section.style.display = isExpanded ? 'none' : 'block';
        button.textContent = isExpanded ? buttonId.replace('toggle-', '') : `Ocultar ${buttonId.replace('toggle-', '')}`;
        button.setAttribute('aria-expanded', !isExpanded);
    });
};

// Inicializar las secciones de la leyenda
toggleSection('toggle-observatories', 'observatories');
