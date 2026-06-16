# Quiniela Misionera Dashboard

Dashboard fullscreen para mostrar resultados diarios de Quiniela Misionera en una TV o monitor de agencia.

La app usa Next.js App Router, TypeScript y Tailwind CSS. Los resultados se leen desde la fuente oficial de IPLyC Misiones:

https://www.loteriademisiones.com.ar/extractos/

## Funcionamiento

- La pantalla consulta `/api/results` al cargar.
- Los datos se actualizan cada 60 segundos sin recargar la pagina.
- Si falla la conexion con la fuente oficial, la pantalla mantiene el ultimo dato valido.
- Los sorteos se validan contra la fecha actual de Argentina (`America/Argentina/Buenos_Aires`).
- Un sorteo figura como publicado solo si tiene fecha de hoy y 20 premios completos.

## Correr localmente

Instalar dependencias:

```bash
npm install
```

Levantar el entorno de desarrollo:

```bash
npm run dev
```

Abrir en el navegador:

```text
http://localhost:3000
```

## Probar produccion local

Compilar:

```bash
npm run build
```

Levantar la version de produccion:

```bash
npm start
```

Abrir:

```text
http://localhost:3000
```

## Probar la API

Con la app corriendo, abrir:

```text
http://localhost:3000/api/results
```

La respuesta incluye:

- `source`
- `sourceUrl`
- `fetchedAt`
- `today`
- `draws`
- `latestPublishedDraw`

## Deploy recomendado en Vercel

1. Subir el proyecto a un repositorio Git.
2. Importar el repositorio desde Vercel.
3. Usar la configuracion detectada para Next.js.
4. Deployar.
5. Abrir el dominio publico generado por Vercel.

No hace falta configurar variables de entorno para el MVP actual.

## Uso en TV o monitor

1. Abrir el link publico de la app en el navegador de la TV, mini PC o computadora conectada al monitor.
2. Poner pantalla completa con `F11`.
3. Dejar el navegador abierto.
4. La pantalla consulta nuevos datos cada 60 segundos.

Los resultados oficiales son los publicados por IPLyC Misiones.
