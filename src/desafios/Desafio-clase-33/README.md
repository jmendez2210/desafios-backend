# Logger-practices

## Use npm run dev for development mode or  npm run prod for production mode
### As a second option, use node server.js -m "development or production".

Consigna

Basado en nuestro proyecto principal, implementar un logger

Aspectos a incluir

-[X] Primero, definir un sistema de niveles que tenga la siguiente prioridad (de menor a mayor):
debug, http, info, warning, error, fatal
-[X] Después implementar un logger para desarrollo y un logger para producción, el logger de desarrollo deberá loggear a partir del nivel debug, sólo en consola


Sin embargo, el logger del entorno productivo debería loggear sólo a partir de nivel info.
- [X] Además, el logger deberá enviar en un transporte de archivos a partir del nivel de error en un nombre “errors.log”
- [X] Agregar logs de valor alto en los puntos importantes de tu servidor (errores, advertencias, etc) y modificar los console.log() habituales que tenemos para que muestren todo a partir de winston.
- [X] Crear un endpoint /loggerTest que permita probar todos los logs


Formato

link al repositorio de Github con el proyecto sin node_modules

Sugerencias


Puedes revisar el testing del entregable Aquí
La ruta loggerTest es muy importante para que tu entrega pueda ser calificada de manera rápida y eficiente. ¡No olvides colocarla!

