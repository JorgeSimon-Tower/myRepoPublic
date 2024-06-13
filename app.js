const express = require ('express')
const body_parser = require ('body-parser')
const session = require ('express-session')
const cors = require ('cors')
const path = require ('path')
const config = require ('./config')
const router = require ('./routes/index')
const middlewares = require ('./middlewares/index')
const app = express ()

// Configuraciones
app.set ('port', config.port)
app.set ('database', config.database)
app.set ('view engine', 'ejs')
app.set ('views', path.join (__dirname, '/views'))
app.set ('config', config)
app.use (express.json ())
app.use (express.urlencoded ({ extended: true }))
app.use (cors (config.cors_options))
// app.use (express.urlencoded ({ extended: true }))
// app.use (express.urlencoded ({ extended: true }))
// app.use (express.json ())
// app.use (express.urlencoded ())
// app.use (express.multipart ())

// Añade la sesion
app.use (session ({
	secret: config.secret,
	resave: true,
	saveUninitialized: true
}))

// Añade las rutas de URLs
app.use (middlewares.url_logger, router.router)

// Añade las rutas de los archivos
app.use ('/public', express.static (path.join (__dirname, 'public')))

// Función para limipar la caché despues del logout
app.use ((peticion, respuesta, next) => {
	if (peticion.session.user == undefined) {
		respuesta.header ('Cache-Control', 'private, no-cache, no-store, must-revalidate')
	}
	
	next ()
})

module.exports = app

