// Uso de jQuery

$(function () {
    var fotos = $(".galeria-grid img");
    var indice = 0;

    // Función que muestra la foto que se escoja
    function mostrar(i) {
        indice = (i + fotos.length) % fotos.length;
        var foto = fotos.eq(indice);

        $("#lightbox-img").attr({
            src: foto.attr("src"),
            alt: foto.attr("alt")
        });
    }

    function abrir(i) {
        mostrar(i);
        $("#lightbox").addClass("abierto");
    }

    function cerrar() {
        $("#lightbox").removeClass("abierto");
    }

    // Clic para abrir el lightbox en la foto seleccionada
    fotos.on("click", function () {
        abrir(fotos.index(this));
    });

    // Botones
    $("#cerrar").on("click", cerrar);
    $("#anterior").on("click", function () { mostrar(indice - 1); });
    $("#siguiente").on("click", function () { mostrar(indice + 1); });

    // Clic en el fondo también cierra la imagen
    $("#lightbox").on("click", function (evento) {
        if (evento.target === this) {
            cerrar();
        }
    });

    // Teclado: Escape cierra y las flechas cambian de foto
    $(document).on("keydown", function (evento) {
        if (!$("#lightbox").hasClass("abierto")) return;
        if (evento.key === "Escape") cerrar();
        if (evento.key === "ArrowLeft") mostrar(indice - 1);
        if (evento.key === "ArrowRight") mostrar(indice + 1);
    });
});