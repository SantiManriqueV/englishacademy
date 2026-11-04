//Guardamos las coordenadas en una variable
const academia = [40.642323, -3.162201];

//creamos el mapa con su respectiva imagen (openStreetMap)
const mapa = L.map("mapa").setView(academia, 15);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; Colaboradores de OpenStreetMap"
}).addTo(mapa);

//agregamos el marcador con su globo de información
L.marker(academia).addTo(mapa).bindPopup("<strong>englishacademy</strong><br>Avenida de Buendía, Oficina 73").openPopup();

//Ruta desde la ubicación del cliente

const botonRuta = document.getElementById("btn-ruta");
const mensajeRuta = document.getElementById("mensaje-ruta");
let ruta = null;

//Calcula y dibuja la ruta desde un origen hasta la academia
function calcularRuta(origen) {
    //Si el plugin de rutas no cargó, avisamos
    if (typeof L.Routing === "undefined") {
        mensajeRuta.textContent = "No se cargó el plugin de rutas. Revisa los enlaces de los scripts.";
        return;
    }

    //Removemos ruta anterior(si había)
    if (ruta) {
        mapa.removeControl(ruta);
    }

    //Calculo de ruta
    ruta = L.Routing.control({
        waypoints: [origen, L.latLng(academia[0], academia[1])],
        //Servidor de rutas alternativo (el de por defecto se satura a menudo)
        router: L.Routing.osrmv1({
            serviceUrl: "https://routing.openstreetmap.de/routed-car/route/v1"
        }),
        language: "es",
        routeWhileDragging: false,
        collapsible: true,
        show: false
    }).addTo(mapa);

    // Si el servicio de rutas no responde
    ruta.on("routingerror", function () {
        mensajeRuta.textContent = "No se pudo calcular la ruta ahora mismo. Inténtalo más tarde.";
    });

    ruta.on("routesfound", function () {
        mensajeRuta.textContent = "Ruta calculada.";
    });
}

//Plan B: el usuario elige su punto de partida haciendo clic en el mapa
function pedirOrigenEnMapa() {
    mensajeRuta.textContent = "No pudimos obtener tu ubicación. Haz clic en el mapa para elegir tu punto de partida.";
    mapa.once("click", function (evento) {
        mensajeRuta.textContent = "Calculando ruta...";
        calcularRuta(evento.latlng);
    });
}

botonRuta.addEventListener("click", function () {
    //aviso por si no cuenta con geolocalización
    if (!navigator.geolocation) {
        pedirOrigenEnMapa();
        return;
    }

    mensajeRuta.textContent = "Obteniendo tu ubicación...";

    navigator.geolocation.getCurrentPosition(
        //Si se da autorización
        function (posicion) {
            mensajeRuta.textContent = "Calculando ruta...";
            calcularRuta(L.latLng(posicion.coords.latitude, posicion.coords.longitude));
        },
        //Si el usuario no autoriza el permiso o no se puede localizar
        function (error) {
            console.error("Error de geolocalización:", error.code, error.message);
            pedirOrigenEnMapa();
        },
        { timeout: 10000 }
    );
});