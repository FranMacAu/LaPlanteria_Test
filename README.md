*************************************

Alumno: FRANCISCO MAC AULIFFE

Materia: APLICACIONES WEB 2

Proyecto: LA PLANTERÍA

Colegio Universitario IES 21


*************************************
**ENTREGA 01/05**

**--Cambios en Estructura de Datos**
-se adaptó estructura de ventas para que quede el precio de la venta en ese momento y no se actualice el monto con una actualización posterior del producto
-Se creó carpeta independiente con las rutas para la modularización

**--ENDPOINTS implementados**

-En USUARIOS.ROUTES.JS hay 2 GET para obtener usuarios y 1 POST para el login (datos sensibles)

GET /usuarios/	-- obtiene lista completa
GET /usuarios/:id	-- obtiene usuario por id
POST /usuarios (en el body va email y password)	-- valida usuario+pasword

-En PRODUCTOS.ROUTES.JS hay 3 GET para obtener productos, 1 POST para crear uno nuevo, 4 PUT para modificar productos y 1 DELETE con integridad de datos

GET /productos/	-- obtiene lista completa
GET /productos/:id	-- obtiene productio por id
GET /productos/categoría/:categoría (id) 	-- obtiene productos por id_categoria
POST /productos/ (en el body va, como mínimo, nombre, precio y id_categoría) -- Crea nuevo producto (el id lo asigna automáticamente)
PUT /productos/cambiarPrecio (en el body va id y precioNuevo)	-- Actualiza el precio de un producto
PUT /productos/cambiarDescripcion (en el body va id y descripcionNueva)	-- Actualiza a descripción de un producto
PUT /productos/cambiarStock (en el body va id y stockNuevo)	-- Actualiza el stock de un producto
DELETE /productos/:id  (verifica que el producto a eliminar no esté incluido en alguna venta) -- Elimina un producto por id siempre y cuando ese id no esté en alguna venta realizada
*************************************