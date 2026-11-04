const contenedor = document.getElementById('contenedor-noticias');

fetch("data/noticias.json")
    .then(function (respuesta) {
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo");
        }
        return respuesta.json();
    })

    .then(function (noticias) {
        noticias.forEach(function (noticia) {
            const articulo = document.createElement('article');
            articulo.className = 'noticia';
            articulo.innerHTML = 
            "<h3>" + noticia.titulo + "</h3>" +
            "<time datetime='" + noticia.fecha + "'>" + noticia.fecha + "</time>" +
            "<p>" + noticia.descripcion + "</p>";
            contenedor.appendChild(articulo);
        });
    })
    .catch(function (error) {
        contenedor.textContent = "Ahora mismo no se puede mostrar la noticia.";
        console.error(error);
    });