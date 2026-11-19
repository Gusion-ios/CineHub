// Datos: lista de películas y ambientaciones, y funciones para buscarlas

const RUTAS = {
    poster: "../Recursos/Imagenes/Compartidos/Peliculas/",
    trailer: "../Recursos/Videos/Compartidos/Trailer/",
    audio: "../Recursos/Audio/Ambientes/"
};

// Ambientes visuales por género
const AMBIENTACIONES = {
    demonios: {
        nombre: "Demonios",
        frase: "Algunas puertas es mejor no abrirlas.",
        acento: "#c0392b",
        acentoRgb: "192, 57, 43",
        cursor: "cruz",
        apertura: "parpadeo",
        asientos: "temblor",
        audio: "demonios.mp3"
    },
    espacio: {
        nombre: "Espacio",
        frase: "Más allá de lo que conocemos.",
        acento: "#6ea8ff",
        acentoRgb: "110, 168, 255",
        cursor: "estrella",
        apertura: "estrellas",
        asientos: "levitar",
        audio: "espacio.mp3"
    },
    desierto: {
        nombre: "Desierto épico",
        frase: "El desierto no perdona ni olvida.",
        acento: "#d9a066",
        acentoRgb: "217, 160, 102",
        cursor: "grano",
        apertura: "arena",
        asientos: "onda",
        audio: "desierto.mp3"
    },
    killer: {
        nombre: "Killer",
        frase: "No hay segundas oportunidades.",
        acento: "#ff2d4a",
        acentoRgb: "255, 45, 74",
        cursor: "mira",
        apertura: "corte",
        asientos: "destello",
        audio: "killer.mp3"
    },
    bioluminiscente: {
        nombre: "Bioluminiscente",
        frase: "Un mundo que brilla en la oscuridad.",
        acento: "#2de2c4",
        acentoRgb: "45, 226, 196",
        cursor: "particula",
        apertura: "luciernagas",
        asientos: "brillo",
        audio: "bioluminiscente.mp3"
    },
    superheroe: {
        nombre: "Superhéroe",
        frase: "Un gran poder, una gran función.",
        acento: "#e23636",
        acentoRgb: "226, 54, 54",
        cursor: "telarana",
        apertura: "telarana",
        asientos: "balanceo",
        audio: "superheroe.mp3"
    },
    emociones: {
        nombre: "Emociones",
        frase: "Cada sentimiento tiene su color.",
        acento: "#ff8fd0",
        acentoRgb: "255, 143, 208",
        cursor: "esfera",
        apertura: "burbujas",
        asientos: "rebote",
        audio: "emociones.mp3"
    },
    humor: {
        nombre: "Humor",
        frase: "Reír también es parte de la función.",
        acento: "#ffd93b",
        acentoRgb: "255, 217, 59",
        cursor: "punto",
        apertura: "confeti",
        asientos: "salto",
        audio: "humor.mp3"
    },
    historico: {
        nombre: "Histórico",
        frase: "Hay momentos que cambian el mundo.",
        acento: "#e8833a",
        acentoRgb: "232, 131, 58",
        cursor: "punto",
        apertura: "cuenta-atras",
        asientos: "fundido",
        audio: "historico.mp3"
    }
};

// Lista de las 23 películas del cine
const PELICULAS = [

    {
        id: "duna-parte-dos",
        titulo: "Duna: Parte Dos",
        tituloOriginal: "Dune: Part Two",
        anio: 2024,
        duracion: 166,
        genero: "ciencia-ficcion",
        generos: ["Ciencia ficción", "Aventura"],
        clasificacion: "+13",
        calificacion: 8.5,
        director: "Denis Villeneuve",
        reparto: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"],
        sinopsis: "Paul Atreides se une a los Fremen en Arrakis para vengar a su familia, mientras debe elegir entre el amor y el destino de todo el universo.",
        poster: "Duna2.jpg",
        trailer: "Duna_2.mp4",
        ambientacion: "desierto"
    },
    {
        id: "interestellar",
        titulo: "Interestellar",
        tituloOriginal: "Interstellar",
        anio: 2014,
        duracion: 169,
        genero: "ciencia-ficcion",
        generos: ["Ciencia ficción", "Drama"],
        clasificacion: "+13",
        calificacion: 8.7,
        director: "Christopher Nolan",
        reparto: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine", "Matt Damon"],
        sinopsis: "La Tierra se queda sin futuro y un grupo de astronautas cruza un agujero de gusano en busca de un nuevo hogar para la humanidad.",
        poster: "Interestellar.png",
        trailer: "Interestellar.mp4",
        ambientacion: "espacio"
    },
    {
        id: "avatar",
        titulo: "Avatar",
        tituloOriginal: "Avatar",
        anio: 2009,
        duracion: 162,
        genero: "ciencia-ficcion",
        generos: ["Ciencia ficción", "Aventura"],
        clasificacion: "+13",
        calificacion: 7.9,
        director: "James Cameron",
        reparto: ["Sam Worthington", "Zoe Saldaña", "Sigourney Weaver", "Stephen Lang", "Michelle Rodriguez"],
        sinopsis: "Un marine en silla de ruedas viaja a la luna Pandora y termina dividido entre su misión y el pueblo Na'vi que aprende a querer.",
        poster: "Avatar.png",
        trailer: "Avatar.mp4",
        ambientacion: "bioluminiscente"
    },
    {
        id: "matrix",
        titulo: "Matrix",
        tituloOriginal: "The Matrix",
        anio: 1999,
        duracion: 136,
        genero: "ciencia-ficcion",
        generos: ["Ciencia ficción", "Acción"],
        clasificacion: "+16",
        calificacion: 8.7,
        director: "Lana y Lilly Wachowski",
        reparto: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
        sinopsis: "Un programador descubre que la realidad que conoce es una simulación y se une a una rebelión contra las máquinas que la controlan.",
        poster: "Matrix.jpg",
        trailer: null,
        ambientacion: "espacio"
    },
    {
        id: "blade-runner-2049",
        titulo: "Blade Runner 2049",
        tituloOriginal: "Blade Runner 2049",
        anio: 2017,
        duracion: 164,
        genero: "ciencia-ficcion",
        generos: ["Ciencia ficción", "Misterio"],
        clasificacion: "+16",
        calificacion: 8.0,
        director: "Denis Villeneuve",
        reparto: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Jared Leto"],
        sinopsis: "Un nuevo blade runner descubre un secreto enterrado que puede sumir en el caos a lo que queda de la sociedad.",
        poster: "Blade_Runner_2049.jpg",
        trailer: null,
        ambientacion: "espacio"
    },
    {
        id: "la-llegada",
        titulo: "La llegada",
        tituloOriginal: "Arrival",
        anio: 2016,
        duracion: 116,
        genero: "ciencia-ficcion",
        generos: ["Ciencia ficción", "Drama"],
        clasificacion: "+13",
        calificacion: 7.9,
        director: "Denis Villeneuve",
        reparto: ["Amy Adams", "Jeremy Renner", "Forest Whitaker"],
        sinopsis: "Doce naves aparecen en distintos puntos de la Tierra y una lingüista debe descubrir cómo comunicarse con sus visitantes antes de que sea tarde.",
        poster: "La_Llegada.jpg",
        trailer: null,
        ambientacion: "espacio"
    },

    {
        id: "john-wick-4",
        titulo: "John Wick 4",
        tituloOriginal: "John Wick: Chapter 4",
        anio: 2023,
        duracion: 169,
        genero: "accion",
        generos: ["Acción", "Suspenso"],
        clasificacion: "+16",
        calificacion: 7.7,
        director: "Chad Stahelski",
        reparto: ["Keanu Reeves", "Donnie Yen", "Bill Skarsgård", "Laurence Fishburne", "Hiroyuki Sanada"],
        sinopsis: "John Wick descubre un camino para vencer a la Alta Mesa, pero antes debe enfrentarse a un nuevo enemigo con aliados en todo el mundo.",
        poster: "John_Wick_4.jpg",
        trailer: "John_Wick_4.mp4",
        ambientacion: "killer"
    },
    {
        id: "spider-man",
        titulo: "Spider-Man",
        tituloOriginal: "The Amazing Spider-Man",
        anio: 2012,
        duracion: 136,
        genero: "accion",
        generos: ["Acción", "Aventura"],
        clasificacion: "+13",
        calificacion: 7.4,
        director: "Marc Webb",
        reparto: ["Andrew Garfield", "Emma Stone", "Rhys Ifans", "Denis Leary", "Sally Field"],
        sinopsis: "Peter Parker busca respuestas sobre su familia mientras aprende a usar sus nuevos poderes y enfrenta a un villano que conoce su pasado.",
        poster: "Spiderman.jpg",
        trailer: "Spiderman.mp4",
        ambientacion: "superheroe"
    },
    {
        id: "avengers",
        titulo: "Avengers",
        tituloOriginal: "The Avengers",
        anio: 2012,
        duracion: 143,
        genero: "accion",
        generos: ["Acción", "Ciencia ficción"],
        clasificacion: "+13",
        calificacion: 8.0,
        director: "Joss Whedon",
        reparto: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson", "Mark Ruffalo", "Chris Hemsworth"],
        sinopsis: "Cuando un enemigo inesperado amenaza la seguridad del planeta, un grupo de héroes muy distintos debe aprender a trabajar en equipo.",
        poster: "Avengers.jpg",
        trailer: null,
        ambientacion: "superheroe"
    },

    {
        id: "intensamente-2",
        titulo: "Intensamente 2",
        tituloOriginal: "Inside Out 2",
        anio: 2024,
        duracion: 96,
        genero: "animacion",
        generos: ["Animación", "Familiar"],
        clasificacion: "APT",
        calificacion: 7.6,
        director: "Kelsey Mann",
        reparto: ["Amy Poehler", "Maya Hawke", "Kensington Tallman", "Liza Lapira", "Tony Hale"],
        sinopsis: "Riley entra en la adolescencia y llegan nuevas emociones a su cabeza que lo cambian todo en el centro de mando.",
        poster: "Intensamente2.jpg",
        trailer: "Intensamente_2.mp4",
        ambientacion: "emociones"
    },
    {
        id: "mi-villano-favorito-4",
        titulo: "Mi Villano Favorito 4",
        tituloOriginal: "Despicable Me 4",
        anio: 2024,
        duracion: 94,
        genero: "animacion",
        generos: ["Animación", "Comedia"],
        clasificacion: "APT",
        calificacion: 6.5,
        director: "Chris Renaud",
        reparto: ["Steve Carell", "Kristen Wiig", "Will Ferrell", "Sofía Vergara", "Joey King"],
        sinopsis: "Gru y su familia reciben a un nuevo integrante mientras un enemigo del pasado regresa para vengarse y los obliga a esconderse.",
        poster: "Mi_Villano_Favorito_4.jpg",
        trailer: "Mi_Villano_Favorito_4.mp4",
        ambientacion: "humor"
    },
    {
        id: "coco",
        titulo: "Coco",
        tituloOriginal: "Coco",
        anio: 2017,
        duracion: 105,
        genero: "animacion",
        generos: ["Animación", "Fantasía", "Musical"],
        clasificacion: "APT",
        calificacion: 8.4,
        director: "Lee Unkrich",
        reparto: ["Anthony Gonzalez", "Gael García Bernal", "Benjamin Bratt", "Alanna Ubach"],
        sinopsis: "Miguel sueña con ser músico, aunque su familia lo prohíbe. En el Día de Muertos viaja a un mundo mágico para descubrir su historia.",
        poster: "Coco.jpg",
        trailer: null,
        ambientacion: "emociones"
    },
    {
        id: "spider-verse",
        titulo: "Spider-Man: A través del Spider-Verso",
        tituloOriginal: "Spider-Man: Across the Spider-Verse",
        anio: 2023,
        duracion: 140,
        genero: "animacion",
        generos: ["Animación", "Acción"],
        clasificacion: "+7",
        calificacion: 8.6,
        director: "Joaquim Dos Santos, Kemp Powers y Justin K. Thompson",
        reparto: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson", "Issa Rae"],
        sinopsis: "Miles Morales cruza el multiverso y conoce a un equipo de Spider-People que debe decidir cómo proteger su universo.",
        poster: "Spider_Verse.jpg",
        trailer: null,
        ambientacion: "superheroe"
    },
    {
        id: "toy-story",
        titulo: "Toy Story",
        tituloOriginal: "Toy Story",
        anio: 1995,
        duracion: 81,
        genero: "animacion",
        generos: ["Animación", "Aventura"],
        clasificacion: "APT",
        calificacion: 8.3,
        director: "John Lasseter",
        reparto: ["Tom Hanks", "Tim Allen", "Don Rickles", "Jim Varney"],
        sinopsis: "Los juguetes de Andy cobran vida cuando nadie los ve, y la llegada de uno nuevo pone a prueba la amistad de todos.",
        poster: "Toy_Story.jpg",
        trailer: null,
        ambientacion: "humor"
    },
    {
        id: "shrek",
        titulo: "Shrek",
        tituloOriginal: "Shrek",
        anio: 2001,
        duracion: 90,
        genero: "animacion",
        generos: ["Animación", "Comedia", "Fantasía"],
        clasificacion: "APT",
        calificacion: 7.9,
        director: "Andrew Adamson y Vicky Jenson",
        reparto: ["Mike Myers", "Eddie Murphy", "Cameron Diaz", "John Lithgow"],
        sinopsis: "Un ogro gruñón acepta rescatar a una princesa para recuperar su pantano, sin imaginar la aventura que le espera.",
        poster: "Shrek.jpg",
        trailer: null,
        ambientacion: "humor"
    },
    {
        id: "your-name",
        titulo: "Your Name",
        tituloOriginal: "Kimi no Na wa",
        anio: 2016,
        duracion: 106,
        genero: "animacion",
        generos: ["Animación", "Romance", "Fantasía"],
        clasificacion: "+7",
        calificacion: 8.4,
        director: "Makoto Shinkai",
        reparto: ["Ryunosuke Kamiki", "Mone Kamishiraishi"],
        sinopsis: "Una joven del campo y un chico de Tokio comienzan a intercambiar cuerpos y se buscan sin conocerse.",
        poster: "Your_Name.jpg",
        trailer: null,
        ambientacion: "emociones"
    },

    {
        id: "el-exorcista",
        titulo: "El Exorcista",
        tituloOriginal: "The Exorcist",
        anio: 1973,
        duracion: 121,
        genero: "terror",
        generos: ["Terror", "Suspenso"],
        clasificacion: "+18",
        calificacion: 7.4,
        director: "William Friedkin",
        reparto: ["Ellen Burstyn", "Max von Sydow", "Linda Blair", "Jason Miller"],
        sinopsis: "Cuando una niña de doce años empieza a mostrar un comportamiento aterrador, su madre recurre a dos sacerdotes para enfrentar la presencia que la domina.",
        poster: "Exorcista.jpg",
        trailer: "El_Exorcista.mp4",
        ambientacion: "demonios"
    },
    {
        id: "it",
        titulo: "It",
        tituloOriginal: "It",
        anio: 2017,
        duracion: 135,
        genero: "terror",
        generos: ["Terror", "Suspenso"],
        clasificacion: "+16",
        calificacion: 7.3,
        director: "Andy Muschietti",
        reparto: ["Bill Skarsgård", "Jaeden Martell", "Finn Wolfhard", "Sophia Lillis"],
        sinopsis: "Un grupo de niños de un pueblo pequeño se une para enfrentar a una criatura que desaparece a los chicos y se alimenta de sus miedos.",
        poster: "It.jpg",
        trailer: null,
        ambientacion: "demonios"
    },
    {
        id: "el-conjuro",
        titulo: "El Conjuro",
        tituloOriginal: "The Conjuring",
        anio: 2013,
        duracion: 112,
        genero: "terror",
        generos: ["Terror", "Misterio"],
        clasificacion: "+16",
        calificacion: 7.5,
        director: "James Wan",
        reparto: ["Vera Farmiga", "Patrick Wilson", "Lili Taylor", "Ron Livingston"],
        sinopsis: "Dos investigadores paranormales ayudan a una familia que vive aterrada por una presencia oscura en su nueva casa de campo.",
        poster: "El_Conjuro.jpg",
        trailer: null,
        ambientacion: "demonios"
    },
    {
        id: "smile",
        titulo: "Smile",
        tituloOriginal: "Smile",
        anio: 2022,
        duracion: 115,
        genero: "terror",
        generos: ["Terror", "Psicológico"],
        clasificacion: "+16",
        calificacion: 6.5,
        director: "Parker Finn",
        reparto: ["Sosie Bacon", "Jessie T. Usher", "Kyle Gallner", "Caitlin Stasey"],
        sinopsis: "Tras presenciar un suceso extraño con una paciente, una doctora empieza a vivir hechos aterradores que no puede explicar.",
        poster: "Smile.jpg",
        trailer: null,
        ambientacion: "demonios"
    },
    {
        id: "un-lugar-en-silencio",
        titulo: "Un lugar en silencio",
        tituloOriginal: "A Quiet Place",
        anio: 2018,
        duracion: 90,
        genero: "terror",
        generos: ["Terror", "Supervivencia"],
        clasificacion: "+13",
        calificacion: 7.5,
        director: "John Krasinski",
        reparto: ["Emily Blunt", "John Krasinski", "Millicent Simmonds", "Noah Jupe"],
        sinopsis: "Una familia vive en silencio absoluto porque unas criaturas cazan guiadas por el sonido. Cualquier ruido puede ser el último.",
        poster: "Un_Lugar_en_Silencio.jpg",
        trailer: null,
        ambientacion: "demonios"
    },
    {
        id: "hereditary",
        titulo: "Hereditary",
        tituloOriginal: "Hereditary",
        anio: 2018,
        duracion: 127,
        genero: "terror",
        generos: ["Terror", "Drama"],
        clasificacion: "+18",
        calificacion: 7.3,
        director: "Ari Aster",
        reparto: ["Toni Collette", "Alex Wolff", "Milly Shapiro", "Gabriel Byrne"],
        sinopsis: "Tras la muerte de la abuela, una familia empieza a descubrir secretos oscuros sobre su historia y su destino.",
        poster: "Hereditary.jpg",
        trailer: null,
        ambientacion: "demonios"
    },

    {
        id: "oppenheimer",
        titulo: "Oppenheimer",
        tituloOriginal: "Oppenheimer",
        anio: 2023,
        duracion: 180,
        genero: "drama",
        generos: ["Drama", "Historia"],
        clasificacion: "+16",
        calificacion: 8.3,
        director: "Christopher Nolan",
        reparto: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh"],
        sinopsis: "La historia del científico que lideró el Proyecto Manhattan y de las consecuencias de crear el arma más poderosa de la historia.",
        poster: "Oppenheimer.png",
        trailer: "Oppenheimer.mp4",
        ambientacion: "historico"
    }

];

// Busca una película por su id
function buscarPelicula(id) {
    return PELICULAS.find(function (pelicula) {
        return pelicula.id === id;
    });
}

// Devuelve las películas de un género
function filtrarPorGenero(genero) {
    if (genero === "todos") {
        return PELICULAS;
    }
    return PELICULAS.filter(function (pelicula) {
        return pelicula.genero === genero;
    });
}

// Devuelve el ambiente que le toca a una película
function ambientacionDe(pelicula) {
    return AMBIENTACIONES[pelicula.ambientacion];
}

// Convierte minutos a formato "2 h 46 min"
function formatearDuracion(minutos) {
    const horas = Math.floor(minutos / 60);
    const resto = minutos % 60;
    return horas + " h " + resto + " min";
}

console.log("CineHub: " + PELICULAS.length + " películas cargadas");