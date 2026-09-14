# Integración — Nueva Acrópolis Huancayo

## Abrir
1. Descomprime la carpeta.
2. Abre `integracion-na` en Visual Studio Code.
3. Abre `index.html` con Live Server (recomendado).

## Lo más fácil de editar
- `data/actividades.js`: fechas, horas, sedes, encargados, WhatsApp y virtudes.
- `data/espacios.js`: textos filosóficos, aprendizajes, virtudes y áreas de servicio.
- `data/sedes.js`: direcciones y enlaces de Google Maps.
- `style.css`: diseño y responsive.

## Fotos
Las carpetas `img/actividades`, `img/espacios` e `img/sedes` están listas.
Esta primera versión usa fondos visuales de reemplazo para no depender de imágenes con licencia.
Luego se pueden añadir fotos reales o imágenes seleccionadas.

## Importante
La semana se calcula automáticamente según la fecha del dispositivo.
La agenda de ejemplo contiene actividades del 7 al 13 de septiembre de 2026.
Para semanas futuras, agrega actividades con su fecha real en `data/actividades.js`.

## Pendiente para la siguiente iteración
- Exportación PNG real de la agenda semanal.
- Fotografías definitivas.
- WhatsApp de áreas de servicio.
- Panel de administración sin tocar código (si se decide usar una base de datos/servicio).


## Versión 3
- Logo oficial proporcionado por la usuaria, recortado proporcionalmente.
- Imágenes incorporadas físicamente en /img para que funcionen incluso sin internet.
- Próximos eventos se filtra desde la fecha real de hoy.

V27: reconstruida desde la base estable V25. Se conservaron intactas las fotos/datos de actividades, áreas y sedes; únicamente se amplió la galería con todas las fotos recuperadas disponibles.
