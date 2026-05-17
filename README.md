*************************************

Alumno: FRANCISCO MAC AULIFFE

Materia: APLICACIONES WEB 2

Proyecto: LA PLANTERÍA

Colegio Universitario IES 21

*************************************
**ENTREGA 16/05**

**--Cambios relacionados con el front:**
- Ahora el navbar carga las categorías de productos dinámicamente
- La validación del login es real y se hace en el back
- El formulario de registro es funcional
- Al finalizar la compra del carrito, se entrega id de venta al usuario y se crea el json de la venta en el back
- Las imágenes ahora están todas en el back, ya no en el front

**--Otros cambios:**
- Se implementó endpoint de categorías (GET /categorias/) para que consuma el navbar dinámico
- Se implementó endpoint de ventas (POST /ventas/) para cargar la venta realizadaen el back 
- Se implementó endpoint de registro de usuairo (POST /usuarios/)
- Se corrigió endpoint de login (POST /usuarios/login) paradejarlo más completo 

**--Cumplimiento de las consignas:**
- Para ver todos los productos (todos o por categoría): desde el navbar están las opciones
- Al añadir productos al carrito, se guardan en el localStorage
- Al finalizar compra en el carrito, se envían los datos al back y se genera el JSON de la venta

**--Despliegue y configuración**

El proyecto del front está subido a Vercel (https://appweb-two.vercel.app), por lo que se configuró el CORS para que también se pueda consumir el backend desde esa url (solo hay que iniciar el servidor en el localhost).
- Puertos configurados:

Backend:  3000

Frontend: 5500 o https://appweb-two.vercel.app

Para probar el funcionamiento desde la web, solo es necesario correr el servidor backend corriendo en el puerto 3000.

*******************************
**ENTREGA 01/05**

**--Cambios en Estructura de Datos**
- Se adaptó estructura de ventas para que quede el precio de la venta en ese momento y no se actualice el monto con una actualización posterior del producto
- Se creó carpeta independiente con las rutas para la modularización

**--ENDPOINTS implementados**

-En USUARIOS.ROUTES.JS hay 2 GET para obtener usuarios y 1 POST para el login (datos sensibles)

- GET /usuarios/	-- obtiene lista completa
- GET /usuarios/:id	-- obtiene usuario por id
- POST /usuarios/login (en el body va email y password)	-- valida usuario+pasword

-En PRODUCTOS.ROUTES.JS hay 3 GET para obtener productos, 1 POST para crear uno nuevo, 4 PUT para modificar productos y 1 DELETE con integridad de datos

- GET /productos/	-- obtiene lista completa
- GET /productos/:id	-- obtiene productio por id
- GET /productos/categoría/:categoría (id) 	-- obtiene productos por id_categoria
- POST /productos/ (en el body va, como mínimo, nombre, precio y id_categoría) -- Crea nuevo producto (el id lo asigna automáticamente)
- PUT /productos/cambiarPrecio (en el body va id y precioNuevo)	-- Actualiza el precio de un producto
- PUT /productos/cambiarDescripcion (en el body va id y descripcionNueva)	-- Actualiza a descripción de un producto
- PUT /productos/cambiarStock (en el body va id y stockNuevo)	-- Actualiza el stock de un producto
- PUT /productos/cambiarNombre (en el body va id y nombreNuevo)	-- Actualiza el nombre de un producto
- PUT /productos/cambiarDescripcion (en el body va id y descripcionNueva)	-- Actualiza la descripción de un producto
- DELETE /productos/:id  (verifica que el producto a eliminar no esté incluido en alguna venta) -- Elimina un producto por id siempre y cuando ese id no esté en alguna venta realizada
*************************************
