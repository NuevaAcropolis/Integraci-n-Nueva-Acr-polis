// EDITA ESTE ARCHIVO PARA CAMBIAR FECHAS, HORARIOS, ENCARGADOS O WHATSAPP.
// fecha: AAAA-MM-DD | hora: HH:MM (24 horas)
const ACTIVIDADES = [
 {id:"marinera",nombre:"Marinera",fecha:"2026-09-07",hora:"19:00",sede:"San Carlos",encargado:"Deyanira",whatsapp:"51944825277",frase:"Encontrar armonía en el movimiento.",virtudes:["Disciplina","Perseverancia","Atención","Armonía","Elegancia"]},
 {id:"teatro",nombre:"Teatro",fecha:"2026-09-07",hora:"19:00",sede:"El Tambo",encargado:"Brian",whatsapp:"51961612516",frase:"Conocernos interpretando otras vidas.",virtudes:["Valor","Empatía","Creatividad","Atención","Disciplina"]},
 {id:"lectura-musical",nombre:"Lectura Musical",fecha:"2026-09-08",hora:"18:00",sede:"El Tambo",encargado:"Por confirmar",whatsapp:"",frase:"Aprender a escuchar con profundidad.",virtudes:["Atención","Sensibilidad","Armonía","Constancia"]},
 {id:"club-lectura",nombre:"Club de Lectura",fecha:"2026-09-08",hora:"18:00",sede:"El Tambo",encargado:"Pilar",whatsapp:"51954064583",frase:"Leer también es aprender a dialogar.",virtudes:["Reflexión","Escucha","Constancia","Discernimiento"]},
 {id:"herodoto",nombre:"Heródoto Historia",fecha:"2026-09-09",hora:"19:30",sede:"San Carlos",encargado:"Marco",whatsapp:"51964663333",frase:"Comprender el pasado para mirar mejor el presente.",virtudes:["Discernimiento","Objetividad","Memoria","Criterio","Veracidad"]},
 {id:"voluntariado",nombre:"Voluntariado Social",fecha:"2026-09-10",hora:"17:00",sede:"San Carlos",encargado:"Lisseth",whatsapp:"51930317161",frase:"Convertir la buena intención en acción.",virtudes:["Servicio","Generosidad","Fraternidad","Responsabilidad","Compromiso"]},
 {id:"dibujo",nombre:"Dibujo Artístico",fecha:"2026-09-10",hora:"18:30",sede:"San Carlos",encargado:"Ingrid",whatsapp:"51921713335",frase:"Aprender a mirar antes de representar.",virtudes:["Atención","Paciencia","Perseverancia","Sensibilidad","Orden"]},
 {id:"vals",nombre:"Taller Vals Vienés",fecha:"2026-09-10",hora:"18:30",sede:"San Carlos",encargado:"Por confirmar",whatsapp:"",frase:"Coordinar el movimiento hasta convertirlo en armonía.",virtudes:["Disciplina","Elegancia","Atención","Armonía"]},
 {id:"argonautas",nombre:"Argonautas Mitología",fecha:"2026-09-10",hora:"18:30",sede:"San Carlos",encargado:"Rocio",whatsapp:"51979200419",frase:"Descubrir lo humano detrás de los grandes mitos.",virtudes:["Imaginación","Discernimiento","Valor","Reflexión"]},
 {id:"arete",nombre:"Areté Poesía",fecha:"2026-09-10",hora:"19:00",sede:"El Tambo",encargado:"Marta",whatsapp:"51993907940",frase:"Dar forma y palabra a lo esencial.",virtudes:["Sensibilidad","Belleza","Creatividad","Atención"]},
 {id:"copernico",nombre:"Copérnico Ciencia",fecha:"2026-09-11",hora:"18:00",sede:"San Carlos",encargado:"Maykol",whatsapp:"51985864077",frase:"Preguntar con rigor y maravillarse con inteligencia.",virtudes:["Curiosidad","Rigor","Humildad","Perseverancia"]},
 {id:"ajedrez",nombre:"Club del Ajedrez",fecha:"2026-09-11",hora:"17:00",sede:"San Carlos",encargado:"Alvaro",whatsapp:"51959204332",frase:"Aprender a pensar antes de mover.",virtudes:["Prudencia","Paciencia","Concentración","Serenidad","Estrategia"]},
 {id:"musica-clasica",nombre:"Entiende la Música Clásica",fecha:"2026-09-11",hora:"18:00",sede:"San Carlos",encargado:"Por confirmar",whatsapp:"",frase:"Escuchar la belleza con una atención más consciente.",virtudes:["Atención","Sensibilidad","Armonía"]},
 {id:"canto",nombre:"Taller Canto desde Cero",fecha:"2026-09-11",hora:"19:00",sede:"Julio Sumar",encargado:"Por confirmar",whatsapp:"",frase:"Encontrar la propia voz y aprender a armonizar con otras.",virtudes:["Valor","Disciplina","Escucha","Armonía"]},
 {id:"damas",nombre:"Círculo de Damas",fecha:"2026-09-12",hora:"17:30",sede:"San Carlos",encargado:"Por confirmar",whatsapp:"",frase:"Compartir experiencias para crecer juntas.",virtudes:["Fraternidad","Escucha","Generosidad","Reflexión"]},
 {id:"caballeros",nombre:"Círculo de Caballeros",fecha:"2026-09-12",hora:"17:30",sede:"San Carlos",encargado:"Por confirmar",whatsapp:"",frase:"Compartir experiencias y fortalecer el carácter.",virtudes:["Fraternidad","Responsabilidad","Valor","Reflexión"]},
 {id:"coro",nombre:"Coro y Orquesta",fecha:"2026-09-12",hora:"18:30",sede:"San Carlos",encargado:"Por confirmar",whatsapp:"",frase:"Muchas voces, un mismo ritmo.",virtudes:["Armonía","Disciplina","Escucha","Fraternidad"]},
 {id:"piano",nombre:"Taller de Piano",fecha:"2026-09-13",hora:"10:00",sede:"San Carlos",encargado:"Juan Jesús",whatsapp:"51990172682",frase:"Hacer de la constancia una forma de armonía.",virtudes:["Disciplina","Paciencia","Sensibilidad","Perseverancia","Armonía"]}
 {id:"flores primavera",nombre:"Taller de Piano",fecha:"2026-09-13",hora:"10:00",sede:"San Carlos",encargado:"Juan Jesús",whatsapp:"51990172682",frase:"Hacer de la constancia una forma de armonía.",virtudes:["Disciplina","Paciencia","Sensibilidad","Perseverancia","Armonía"]}
 {id:"flores-primavera-lun",nombre:"Taller de Flores · Baile de Primavera",fecha:"2026-09-14",hasta:"2026-09-26",hora:"18:00",sede:"San Carlos",encargado:"Michael",whatsapp:"51964212747",frase:"Embellece el evento de la temporada.",virtudes:["Creatividad","Belleza","Servicio","Cooperación"]},
];

// Puedes agregar eventos de octubre, noviembre, etc. aquí mismo.
// La portada calcula automáticamente la semana según la fecha consultada.
