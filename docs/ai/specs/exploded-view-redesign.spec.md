# Spec: Rediseño del portafolio, mapa de trabajo (diseño + contenido)

> Estado: borrador para aprobación humana. Prototipo de hero en 3D previo retirado; el nuevo hero está pendiente.
> Fecha: 2026-11-05. Actualizada: 2026-11-06 (cambio de requisito del dueño).
> Nota de retiro: el concepto "vista explotada" fue retirado por el dueño el 2026-11-06. El nombre del archivo se conserva por trazabilidad. El prototipo de placas apiladas queda en el historial (commits 7e1f410, 5478c45, 1c89c4e, 9fd9231).
> Nota de retiro 2026-11-06 (mapa de bloques): el mapa 3D de bloques por carriles (`/prototype/map`, commit 59dae63) queda retirado como hero. El dueño pidió: "si dale, cambialo por el muro 3D de pantallas reales". El hero y el recorrido son ahora el muro de pantallas reales (`/prototype/wall`). El índice de todos los proyectos de `components/prototype/map` se conserva sin cambios.
> Nota de retiro 2026-11-06 (muro de pantallas): el muro 3D de pantallas reales (`/prototype/wall`) queda retirado como hero. Historial: commits 013f810, 0049691 y 339d83a. El dueño pidió: "kairo es nuestro mayor apuesta , y tambien debemos mostrar el poder de la ia , y todo lo que hacemos con ella en general, lfujos de tbasrjoa workflows, orqustacion etc." y "dale, Kairo y la IA en el hero". La técnica de pantallas reales en capas de `/prototype/layers` se conserva para el momento 4 de la home (sistemas de seguros).
> Nota de retiro 2026-11-06 (Kairo como hero y anillo 3D): Kairo deja de ser el hero de la home y el anillo 3D de todos los proyectos (`AllProjects`, commit 73e2a23) sale de la home. También sale la sección dedicada de seguros (`InsuranceSystems`). El dueño pidió que la home venda primero a Samuel, después su trabajo y al final Kairo (ver "Home v3: personal primero"). Los archivos `AllProjects.tsx`, `ring.module.css`, `InsuranceSystems.tsx` e `insurance.module.css` se conservan sin borrar hasta que el dueño decida.
> Reemplaza / supersede parcialmente: `docs/ai/specs/portfolio-product-engineer-v2.spec.md` (ver "Riesgos y contradicciones").

## Objetivo

Portafolio personal de todo el trabajo del dueño, encabezado por "Senior Software Engineer | System Architecture & AI Engineering". Debe evitar el aspecto genérico o típico hecho por IA. La home es la prioridad máxima y la superficie de mayor calidad: es lo primero que ve cualquier visitante.

Correcciones del dueño (2026-11-06, textuales):

- "oka pero que es eso? es algo real? no entiendo bien ese modelo 3d, tambien psor que menconas Before software, I supervised a production line building exhaust systems for BMW, VW and Toyota. That is why this site draws software as assemblies. dijimos que este es un potafolio de Senior Software Engineer | System Architecture & AI Engineering"
- "lo que quioero es un portafolio personal, de todo, entiendo que este prototipo es unicamente para el producto kairo runtime?"
- "hay que mostrar todos lso poreyuctos no? y solo los mas relevantes dale el 3d y una seccion especial quiza, pero si necsitas agregare mas de eso 24 agrealos, recuerda que la pagina home, sera la mas improatnte, es lo primero que todo mundo vera al llegar a mi pagina, asi que debe ser lo mejor de lo mejor ahi"

Corrección previa (2026-11-05): "puede ser, pero ahora lo que somos es Senior Software Engineer | System Architecture & AI Engineering, y el portafolio debe de mostrar eso".

Correcciones del dueño (2026-11-06, textuales, sobre el hero y Kairo):

- "kairo es nuestro mayor apuesta , y tambien debemos mostrar el poder de la ia , y todo lo que hacemos con ella en general, lfujos de tbasrjoa workflows, orqustacion etc."
- "NO BUSCAMOS SATURAR AL USUAROI DE TEXTO, BUSCAMOS CREASTIVIDAD Y DINAMISMO"
- "dale, Kairo y la IA en el hero"
- Sobre una escena previa de Kairo: "es algo real? no entiendo bien ese modelo 3d"
- "no busco nada plano... cosas 3d, alta calidad"

Retirado: "vista explotada" como concepto del sitio, la escena de placas apiladas de Kairo como protagonista, la frase de planta de producción, y el hilo narrativo de ingeniería mecánica con su criterio de aceptación. La educación queda como dato simple en la sección de carrera.

## Home v3: personal primero (2026-11-06)

Petición del dueño, textual: "no olvidemos que es mi pportafolio pesonal, es decir demos habalr sobre mi y l oque hacemos no? no se si com otal eta iamgen 3d sea lo primero que vean al enrar, oezsea esun gran proucto que estmao haiendo pero lo primero no es venderme a mi? y hay muhcos proeyctos sin imagen"

Respuesta del dueño al plan: "usa la ilustración por ahora, dale con el plan"

Esta sección prevalece sobre "Home (la superficie más importante): 6 momentos" en lo que se contradiga.

### Orden nuevo de la home

Decisión posterior del dueño (2026-11-06), textual: "kairo deberia ser la sgunda seccio no?" y, tras la propuesta, "dale, muévelo con ese orden". Este orden reemplaza al del plan inicial, que ponía el trabajo en segundo lugar.

1. Hero personal (`id="home"`): nombre grande, a qué se dedica, para quién ha trabajado, retrato, botones de CV y contacto. Sin 3D.
2. Kairo como "lo que estoy construyendo" (`KairoStage`, con su escena 3D, dentro de `id="building"`), seguido de `KairoRuntime` (`id="kairo"`).
3. Trabajo (`id="projects"`): destacados con imagen grande y, debajo, un índice compacto con todos los demás proyectos.
4. IA en acción (`id="ai"`).
5. Carrera y contacto (`id="career"`, `id="contact"`).

`SectionNav`: Home, Kairo, Work, AI, Career, Contact.

### Reglas

- Todo dato sale de datos existentes: `COPY` (nombre, título, titular), `CAREER_ROWS` (empresas de software: Ensamble, Grupo KC, Lumston, Lemu; sin Faurecia ni Miga), `PROJECTS` (conteo y cada proyecto) y `metaLine`. Sin métricas, testimonios ni clientes inventados. `COPY.line` describe Kairo y no va en el hero.
- Cada proyecto de `PROJECTS` aparece exactamente una vez entre destacados e índice. Kairo tiene su propia sección y se queda en el índice.
- Destacados: 8, elegidos por calidad de captura y rango (IA, seguros, móvil, web), con seguros sin dominar y sin organizar el trabajo por seguros. Sin pantallas de solo login ni capturas de teléfono pequeñas a tamaño grande. Maximus no abre la lista.
- Índice: nombre, empresa, rol o relación, y año solo cuando `MapProject.year` lo trae de una fuente. Cada enlace conserva su destino. Filtro por área simple, con todo visible sin JavaScript.
- Retrato: `public/assets/images/sam.png` no se toca. Se genera un derivado recortado (sin el borde blanco de sticker) en `public/assets/images/home/`. Sobre fondo casi negro el cabello y la barba se pierden, así que se coloca sobre un recuadro de acento lima.
- Kairo: la sección enmarca la escena con "What I'm building", el nombre, el eslogan y `COPY.line`. La escena 3D se carga con `dynamic`. Como el escenario queda justo debajo del hero, el WebGL no se inicia en la primera carga: espera a la primera interacción del visitante (scroll, rueda, toque o tecla) y a que el escenario esté cerca del viewport (margen de 700 px). Se inicia de inmediato si la página carga ya desplazada (scroll restaurado o hash `#building`), si no hay scroll posible, sin `IntersectionObserver`, o en la página independiente `/prototype/kairo`. El dibujo estático renderizado en servidor sigue siendo la versión completa sin JavaScript.
- Movimiento: el hero y los destacados usan movimiento con propósito solo con `prefers-reduced-motion: no-preference`; el marcado base es el estado final completo.
- Activos sin usar: Card Tu Agente (captura real legible) se integra como derivado WebP; Batalla vs Thanos (arte con derechos de terceros) y CVA (fotos de la congregación) quedan fuera por decisiones previas del dueño.
- Criterios de aceptación: el orden del DOM es hero, Kairo, Kairo Runtime, trabajo, IA, carrera y contacto; el hero es lo primero visible y no hay `canvas` WebGL al cargar sin hacer scroll; sin errores de consola en un recorrido completo; sin scroll horizontal a 375, 768 y 1440 px; `SectionNav` refleja el orden real y sus anclas resuelven.
- Sin runner de tests (`docs/ai/testing.md`): no hay RED posible; se valida con lint, tipos, build y un recorrido en navegador real.

## Work v4: banco de trabajo, pila como navegación y archivo por empresa (2026-11-06)

Petición del dueño, textual: "Selected work\ny Every other project, estan horribles y simples, sin snetido y amontodnada, una lsita simple parace, 0 informacijn tecnica ni visual;, tgampoco vemos cosa siporantes como stack etcx, nuestro portafolio aun se ve generico"

Al pedirle los datos que faltaban, respondió, textual: "para eso tene os skills de diseno, todo esa informacin esta en el github"

Restricciones vigentes del dueño: "NO BUSCAMOS SATURAR AL USUAROI DE TEXTO, BUSCAMOS CREASTIVIDAD Y DINAMISMO" (el detalle solo aparece para lo que el visitante eligió); no alargar el scroll (el trabajo ya empieza 4 viewports abajo); sin inventar nada; Card Tu Agente se queda ("son mock, déjala"); Maximus no abre la lista; seguros no domina; Volaris Analytics y Acolyte Health (solo login), las capturas pequeñas de Lemu, Batalla vs Thanos y CVA quedan fuera como pantalla grande.

Esta sección prevalece sobre las reglas "Destacados" e "Índice" de "Home v3" en lo que se contradiga. Se conserva: cada proyecto de `PROJECTS` aparece exactamente una vez entre banco y archivo (42), Kairo conserva su sección y queda en el archivo, y el HTML del servidor trae todos los proyectos y enlaces.

### Concepto aprobado (propuesto al dueño)

1. Selected work como banco de trabajo, una pantalla: los proyectos a un lado, la captura grande al otro, con qué es, rol, impacto y pila. Elegir un proyecto cambia todo el panel. En móvil, deslizar.
2. La pila como navegación: una tira de tecnologías con conteos reales. Tocar Flutter ilumina sus proyectos en toda la sección.
3. Los demás proyectos agrupados por empresa, para que se lea para quién se construyó cada cosa. Cada proyecto es una tarjeta compacta con su línea, su pila y una miniatura si tiene.

Costo aceptado: más información, por eso el detalle solo se muestra del proyecto elegido.

### Banco (`Work.tsx`, `workData.ts`)

- 8 proyectos en el banco, en orden: ARI & MAYA (abre el banco), CRM Comercial, Red Médica, ATLAS, SegunNet, EoS Mobile, Seguros KC, Card Tu Agente. Seguros tiene 3 de 8. GitHub Search salió: su pantalla es una portada con dos botones, sin contenido; EoS Mobile (captura de teléfono llena de dashboard) lo reemplaza. Kairo sigue con su sección.
- Patrón de interacción (nuevo, documentado aquí): tablist WAI-ARIA con activación automática. `role=tablist`/`tab`/`tabpanel`, `aria-selected`, `aria-controls`, tabindex móvil (solo la pestaña activa está en el orden de tabulación), flechas, Inicio y Fin con vuelta circular, foco visible. Funciona por clic, teclado y toque; no depende de hover (no hay vista previa por hover). En móvil además: deslizar horizontalmente el panel, botones anterior/siguiente y una tira de pestañas desplazable que centra la activa.
- Sin salto de layout: los 8 paneles comparten una celda de grid (`grid-area: 1 / 1`) y los inactivos usan `visibility: hidden`, así que la altura de la sección es la del panel más alto y no cambia al cambiar de proyecto. Los teléfonos van contenidos en el marco, no estirados.
- Transición con propósito: el panel entrante sube 14 px y aparece, la captura entra con un zoom de 1.04 a 1 y el detalle entra escalonado, todo con transiciones CSS (sin GSAP, así no hay conflicto con `fill-mode`). Con `prefers-reduced-motion: reduce` el cambio es instantáneo y todo el contenido del panel activo está visible.
- Carga: las capturas son `loading="lazy"`; al cambiar de panel se precargan los vecinos.
- Detalle del panel: nombre, empresa y área (y año si una fuente lo da), "What it is" (el `blurb` existente, sin la nota "description pending"), "Role" (solo si hay rol o relación declarados), "Impact" (solo si `proyects.ts` trae `impact`) y la pila como botones que activan el filtro, más el enlace al proyecto con el mismo destino de siempre.
- Sin JavaScript: el HTML del servidor trae los 42 proyectos y enlaces una vez cada uno; solo el primer panel del banco es visible.

### Pila como navegación

- `TECHS` se deriva de `MapProject.stack`: 51 tecnologías con su conteo real, normalizadas (p. ej. "TailwindCSS" a "Tailwind CSS", "Astro.js" a "Astro", "Next.js 14" a "Next.js").
- La tira muestra las 12 más usadas y un botón "All 51" (`aria-expanded`) que despliega el resto. En pantallas estrechas la tira es una sola línea deslizable.
- Selección múltiple (unión: un proyecto se ilumina si usa cualquiera de las elegidas), `aria-pressed` en cada botón, "Clear" visible solo con selección, y un `role=status` `aria-live=polite` que dice "N of 42 projects use X or Y".
- Atenuar, no ocultar: los proyectos que no coinciden bajan de peso (pestañas con trazo ligero, miniaturas en gris al 30 %) pero conservan el texto legible (contraste 4.5:1) y los 42 siguen visibles; los que coinciden llevan un punto (pestañas), borde acento (tarjetas) y la tecnología elegida resaltada. Los encabezados de grupo muestran "coinciden / total".
- Reemplaza el filtro por área: el dueño encontró la sección saturada, el área sigue visible como etiqueta de cada tarjeta.

### Archivo por empresa

- Grupos: Grupo KC (20), Personal (7), Ensamble (2), Lumston (2), Lemu (1), Other contributions (2). El grupo sale del campo `company` donde existe; los proyectos propios van a Personal; las entradas añadidas cuyos repos el dueño confirmó como de Grupo KC van a Grupo KC; lo que no tiene dueño declarado (Report server, RA agents portal) va a "Other contributions" en vez de asignarle una empresa sin evidencia.
- Cada tarjeta: nombre, área (y año si hay fuente), una línea, pila y miniatura si existe (variante `lo` de la captura). Dentro de un grupo se ordena por área y luego por nombre, para que los 17 de seguros se lean por bloques. Rejilla de tarjetas con el encabezado de grupo pegajoso en escritorio; en pantallas de menos de 900 px cada grupo es una tira deslizable (dos filas en los grupos largos) para no alargar el scroll.
- Las tarjetas son un solo enlace con el mismo destino que antes (enlace propio en pestaña nueva, o ancla en `/projects`).

### Procedencia de los datos (`prototype/map/data.ts`)

- `MapProject` gana tres campos opcionales: `stack`, `impact` y `group`. Los consumidores existentes no cambian.
- `stack` de las 24 entradas de `proyects.ts`: el arreglo `technologies`, recortado a las 3 a 6 que un lector reconoce; se descartan descriptores genéricos ("Responsive UI", "Enterprise Dashboard UI") y no se agrega ninguna tecnología que la fuente no liste.
- `stack` de las 16 entradas añadidas: manifiestos de dependencias de los repositorios del dueño en GitHub, leídos el 2026-11-06. Los repositorios son privados: no se publican sus nombres, URLs ni fechas de creación, y esas fechas no se usan como años (`yearSource` no cambia). RA agents portal y Prometeo no tienen pila (repo ambiguo o desconocido) y se muestran sin fila de pila.
- `impact`: el texto `impact` de `proyects.ts`, condensado sin cifras nuevas; solo existe donde la fuente lo trae.
- `metaLine` no cambia. El banco muestra empresa (Grupo KC, Lemu) y área.

### Decisiones y avisos

- Prometeo y ATLAS ya declaraban `company: 'KC'` por el texto de login y pie de las capturas; se agrupan en Grupo KC y no en "Other contributions". Si el dueño no confirma esa evidencia, mover Prometeo.
- Commercial area system podría ser el mismo producto que Maximus, e IP agents system el mismo que Titan. No se fusionan: el total sigue en 42. Pendiente de confirmación del dueño.
- Sin runner de tests (`docs/ai/testing.md`): no hay RED posible. Se valida con `pnpm lint:types`, `pnpm lint`, `pnpm build` y recorrido en navegador real a 1440, 768 y 375 px.

## Work v5: lenguaje ciberpunk, mapa del sistema y marcos por plataforma (2026-11-06)

Segunda ronda de comentarios del dueño sobre la sección de proyectos, textuales:

- "toda la parte de proeyctos deberia tener el estgilo de ciberpunk no? algo asi no? que ya esta muy aprecido por lo que veo pero la partede other prokects esta mal aun ,parece una simple lsita de cards, tambien ha yiamngens que son de mobile y las tomas como si fduera web, hay poryectos que no tienen imagen, por eso es imporatne que veas el readme"
- "si alguno no tien iamgen, hay que poner algo, crea algun disneo o algo queasemeje de que va, quiza no sea nedcsario que todos los proyectos trengan iomagen, y lso que si tengan son lso que deben de brillar no?/Users/kal-el/Desktop/fotos"
- "hay muhcos que ya tenbiamos aqui guardadas, y hay poroeyctos qwue son puro back paor eso no hay iamgen como tal"

Esta sección prevalece sobre "Archivo por empresa" de Work v4 (las tarjetas del archivo se reemplazan por el mapa). Se conservan: el banco, la tira de pila, el total de 42 y los destinos de cada enlace.

### Lenguaje visual (toda la sección)

- Base existente: casi negro y acento lima; sin marcas, juegos ni películas copiadas. Recursos: esquinas achaflanadas (dos esquinas cortadas con `clip-path` y la diagonal dibujada con pseudo-elementos), rejilla tenue, marcos de dispositivo, líneas de barrido sobre las capturas y una línea que barre la pantalla una vez al activarla, etiquetas mono en mayúsculas.
- Ningún valor de HUD es falso: cada número o etiqueta en pantalla sale de los datos (conteos, años de una fuente, plataforma, área, grupo).
- Movimiento con propósito (barrido al activar, pulso a lo largo de las trazas elegidas, entrada escalonada del inspector) y, con `prefers-reduced-motion: reduce`, todo en reposo y completo.

### El mapa del sistema (`WorkMap.tsx`)

- Un clúster por grupo (Grupo KC, Personal, Ensamble, Lumston, Lemu, Other contributions) colgado de una columna vertebral; cada nodo es un proyecto y se conecta a la barra de su clúster. Los clústeres de más de 4 nodos ocupan el ancho completo; los pequeños se acomodan de a dos.
- Jerarquía: los proyectos con captura brillan (bloque superior del clúster, miniatura real enmarcada por su plataforma y la mayor parte del espacio); los que no tienen captura son nodos más pequeños y callados (borde tenue, glifo del esquema en lugar de imagen).
- La pila gobierna el mapa: elegir una tecnología ilumina las trazas (la conexión de cada nodo que la usa y una cadena ortogonal entre ellos, con pulso animado), atenúa el resto (la imagen baja de peso, el texto conserva contraste 4.5:1 o más) y los encabezados de grupo muestran "coinciden / total".
- Inspector: elegir un nodo abre su pantalla (o su esquema) con nombre, empresa, área, plataforma, qué es, rol, impacto, pila (botones que activan el filtro) y el enlace al proyecto. A 1100 px o más es una columna pegajosa junto al mapa; debajo, va arriba del mapa. Los 34 nodos conservan su enlace (`href` y `target` de siempre); un clic simple selecciona, un clic con modificador abre el destino.
- Teclado: roving tabindex (solo el nodo elegido está en el orden de tabulación), flechas (izquierda y derecha siguen el orden visual, arriba y abajo van al nodo más cercano), Inicio, Fin y Espacio; Tab desde el nodo elegido llega al inspector.
- Móvil (menos de 900 px) tiene su propia forma: pestañas de grupo (con conteo de coincidencias), inspector arriba y mosaicos de dos columnas del grupo elegido; no hay trazas. Al elegir un nodo el inspector se acerca a la vista.
- Sin JavaScript: todos los clústeres y los 34 enlaces están en el HTML como una lista agrupada y legible (nombre, plataforma y área, miniatura) y el inspector del primer nodo viene renderizado. El enlace de ese nodo aparece dos veces (nodo e inspector).
- Altura de la sección a 1440 px: unos 2.99 viewports (antes 3.50).

### Marcos por plataforma (`WorkScreen.tsx`)

- Campo nuevo y opcional `platform` en `MapProject` (`mobile`, `web`, `api`, `cli`, `widget`), llenado desde las descripciones del dueño y los manifiestos de los repositorios.
- Web: marco de navegador (barra con tres puntos y barra de direcciones vacía, para no inventar una dirección); la captura se recorta desde arriba, como lo muestra una ventana. Móvil: marco de teléfono con la proporción propia de la captura, `object-fit: contain`, sin recortar ni estirar y sin ampliar más de 1.25 veces su tamaño real (Cinemapedia 288x625 y Atlas de la Biodiversidad 186x373 se muestran chicos). Capturas que ya traen su dispositivo (Card Tu Agente) se muestran tal cual, sin marco adicional.
- Fuera: pantallas de solo login (Volaris, Acolyte, el login de NEXUS), `ra-home.png` (captura de este portafolio), Batalla vs Thanos y CVA (decisiones previas del dueño).
- Capturas nuevas (derivados WebP en `public/assets/images/home/`, `work-<id>.webp` y miniatura `-t`): Solcrédito Autos, Grupo KC Corporate Site, Alianza Red Magisterial, NEXUS (portada de Riesgos Amparados), Prometeo (portal de apps), Seguros KC (sitio público) y GitHub Search (pantalla de búsqueda de usuarios, en lugar de la portada vacía), todas de las capturas del dueño en `Desktop/fotos` salvo GitHub Search (`public/assets/projects`); Atlas de la Biodiversidad usa su captura chica de `public/assets/projects`. El resto reutiliza los derivados ya cableados.

### Esquemas para proyectos sin captura (`Diagram`)

- SVG generado por tipo, que se lee como diagrama y nunca imita una captura ni inventa interfaz. Dos variantes: `flow` (etapas de izquierda a derecha con un riel de servicios de apoyo debajo, p. ej. Cliente, Fastify, PDFMake y QuickChart, con Redis para el límite de peticiones) y `hub` (un nodo con sus partes alrededor). Los backends muestran su arquitectura.
- Cada etiqueta es un hecho declarado: qué es el proyecto, con qué está hecho, qué conecta. Sin hechos, el esquema es un `hub` de la plataforma con su pila. Los hechos salen de las descripciones del dueño y de la documentación y manifiestos de cada proyecto (2026-11-06); nunca se publican nombres de repositorios, URL de repos, hosts internos, detalles de autenticación, nombres de módulos internos ni nombres de personas de los README.
- En el mapa, el esquema se dibuja en miniatura (glifo sin texto); en el inspector, completo y con `aria-label` que lo describe en texto.
- Esquemas: Kairo, Maze Chase 2D level editor, Getmore homepage layout, AI talent and initiative platform, KC coding harness, Commercial area system, IP agents system, Agent personal portal, Digital insurance widget, Digital insurance sales channel, RA agents portal, Reports API, Report server, Notifications API, Testing center, Batalla vs Thanos, CVA Church Page, Volaris Analytics y Acolyte Health (19). Los otros 15 del mapa y los 8 del banco llevan captura.

### Correcciones de la verificación independiente

- Elegir una tecnología fuera de las 12 primeras movía el banco 39 px: la lista completa ahora es un `<details>` que se abre como capa sobre la sección (no empuja nada y funciona sin JavaScript) y las tecnologías elegidas se muestran en una fila de altura fija; el desplazamiento medido es 0.
- `aria-orientation` del tablist: `vertical` a 1100 px o más y `horizontal` debajo.
- Datos: `RA agents portal` y `Prometeo` ya tienen pila (familia de repositorios y documentación interna) y `CRM Mobile` corrige la suya a Vite, React, Dexie y Workbox (antes decía Next.js, que no es su manifiesto).

### Correcciones de la revisión independiente (Work v5)

- Privacidad: se corrigió en el origen, `prototype/map/data.ts`, porque el archivo entero viaja en un chunk del cliente (y sus cadenas aparecen en `/prototype/map`, `/prototype/wall` y en los source maps del servidor): Prometeo ya no nombra módulos internos (ahora: plataforma y tecnologías), ATLAS ya no nombra el departamento y se quitaron las notas "description pending" de Testing center y Alianza Red Magisterial (Testing center describe su shell de Vite y React). Se retiraron del `WORK_LINES` los overrides que ya coinciden con la fuente (Prometeo, ATLAS y Testing center). Se auditaron las cadenas de todo `data.ts` y `workData.ts` (no solo las visibles) y el build ya no contiene nombres de módulos internos en `.next/static` ni `.next/server/pages`.
- Móvil: al cambiar de grupo se elige su primer nodo (con captura si la hay) y, al estrechar la ventana, el grupo pasa a ser el del nodo elegido, así que siempre hay un nodo visible con tabindex 0 y el inspector coincide con el grupo.
- Sin JavaScript: un `<noscript><style>` muestra los 8 paneles del banco uno tras otro y oculta las pestañas y flechas inertes; con JavaScript el diseño no cambia.
- Foco: los enlaces con esquina achaflanada (nodos y botones de proyecto) dibujan el indicador de foco dentro de la forma (`box-shadow` inset), porque `clip-path` recortaba el contorno; los carriles con desplazamiento horizontal reservan 6 px para que no recorten el contorno de sus botones.
- Movimiento: la navegación del banco usa `behavior: 'auto'` con `prefers-reduced-motion: reduce`.
- Años: se quitaron los años que venían de la fecha de creación de un repositorio (GitHub Search, Cinemapedia, DashBoard Next14, Maze Chase 2D level editor y Getmore homepage layout); Kairo conserva 2026 con el CV como fuente y ya no cita el repositorio. Siguen los años con fuente documentada (CV y línea de tiempo de carrera).

### Tercera ronda: imágenes bien dimensionadas y mapa claro (Work v5)

Comentario del dueño, textual: "hay muchis proetyctois que no se ve bien las iamgenes, etan mas dimensionadas, te das cyuenta?, igual en system map, muchas se ven mal te das cuenta en su viusalizacion, tambien no me queda claro el suystem map, es decir , ha ycosa que no entiendo y no se a que sr efiueren, hay algunas que no les pusiste imagen cuando si hay ,m lo qu dejaste en Other contributions , son parte de kc, y si no tienes iamgen, pero tienes la url pueds hacer una snapshot para ponerlo"

- Dimensiones: ninguna captura desborda su caja ni se recorta. La caja de cada pantalla es un contenedor de tamaño (`container-type: size`) y el dispositivo se calcula con `cqw`/`cqh`: la ventana de navegador toma la proporción de la captura y cabe entera (`contain`), el teléfono se mide por la altura de la propia captura con el marco incluido, y el tope es siempre el tamaño real del archivo (nunca se ve más grande que su original). Medido con DPR 1 a 1280, 1440, 1740, 1920, 2560, 768 y 375 px sobre 385 capturas (banco, mapa e inspector): desborde máximo 0 y escala máxima 0.74.
- Nitidez: los derivados WebP se rehicieron desde el mejor original (hasta 2000 px de ancho, calidad 82; miniaturas de 720 px de ancho o 400 px de alto). Se quitaron las líneas de barrido sobre las capturas reales; se conserva el barrido de entrada.
- Teléfonos: los proyectos móviles muestran hasta tres pantallas distintas lado a lado (Red Médica, EoS Mobile, Card Tu Agente con dos, Cinemapedia y Atlas de la Biodiversidad con tres, CRM Mobile con una), sin pantallas de login.
- Imágenes que sí existían: Batalla vs Thanos usa su captura (arte de terceros; la decisión anterior de excluirla se levantó por petición de la coordinación) y CVA usa una instantánea de su propia página pública (Playwright, 1440x900 a DPR 2, sin sesión). `ra-home.png` no se usa (es una captura de este portafolio, no de RA agents portal). Intentos de instantánea: `cva-page.vercel.app` bien; la instantánea del CRM Comercial termina en `/login` y se descarta; `github-search-app-nu.vercel.app` solo es una portada (se conserva la captura de búsqueda). Volaris y Acolyte siguen sin captura (solo login). Los proyectos solo de backend o CLI y los web sin captura conservan el esquema, solo en el inspector.
- Foco: el doble anillo rojo y amarillo venía de dos reglas globales que se sumaban: `:focus-visible` de `styles/base.css` (anillo `ring-accent-400`, rojo, vía `box-shadow`) y el contorno lima de la home. Dentro de Work, `.work :focus-visible` anula el `box-shadow` y deja solo el contorno lima.
- Mapa claro: se quitaron las palabras "System map", "nodes", "groups", "bench", "on the map", la leyenda y la línea de totales. La sección dice "42 projects"; el mapa se titula "All projects" ("The other 34, by company"). "Other contributions" desaparece: RA agents portal y Report server pasan a Grupo KC (los hrefs no cambian). Se quitaron los glifos; los proyectos sin captura son entradas compactas con su nombre y una línea de unas 8 palabras tomada de su descripción. Las etiquetas son legibles ("Web app · Insurance", "Mobile app", "API · Insurance", "CLI tool · AI"). El inspector del esquema lleva el rótulo "How it works".
- Renombres: ninguno; los datos no respaldan un nombre más claro para "Agent personal portal", "Commercial area system", "IP agents system", "Digital insurance widget" ni "KC coding harness", y la línea de cada entrada explica qué es.
- Equilibrio y altura: las baldosas con captura son grandes (tres por fila a 1440 junto al inspector) y los grupos pequeños (Ensamble, Lumston, Lemu) comparten una fila. La sección a 1440 mide 3235 px (3.59 viewports, antes 2.99): más larga porque cada captura se ve entera y grande; a 1740 mide 3.21. Se puede recortar pasando a cuatro baldosas por fila, a costa de legibilidad.

### Cuarta ronda: duplicados, enlaces reales, Lumston, datos de GitHub, orden por peso y hero (Work v5)

Comentario del dueño, textual: "agente personal portal creo que si tenemos imagen, y hay proiytectos que se repiten no?, tambien veo proyectos en kc que no son nada, su project page me lleva a ningun lado, lumston no tiene iamgene>? segun yuo si tenemos y en la parte de aqui no deberia de irse acomodando arode a lo que mas contruiimos? siento que falta mas inforamcion que da nuestro github y lkso repos tambien en la pantalla inmcial donde damos nuestro niomnbre, recurda que es un perfil de in ingerioro de software, I design systems teams can understand, operate, and evolve. siento que no dice muhco"

- Duplicados fusionados (42 pasa a 36; cada conteo se deriva de los datos): Commercial area system en Maximus, IP agents system en Titan, Digital insurance sales channel en Seguros KC, Agent personal portal en Card Tu Agente (que ya mostraba su captura), Report server en Reports API y RA agents portal en NEXUS / Riesgos Amparados. La pila del superviviente es la unión sin repetir. Reports API ahora dice que genera reportes PDF y Excel (su manifiesto trae `pdfmake`, `exceljs` y `quickchart-js`); la pila de Report server (Express) no se fusionó porque ningún manifiesto la respalda.
- Sin enlaces muertos: los anclajes `/projects#…` no existen en `/projects` (verificado con la página cargada; solo hay 9 `id` y ninguno es de un proyecto). Un proyecto solo tiene enlace si existe un destino real: su sitio público o un repositorio público. Se quitaron los enlaces a pantallas de inicio de sesión (NEXUS, CRM Comercial, CRM Mobile, Maximus, Titan). Enlaces nuevos: Card Tu Agente (tuagente.com.mx), Alianza Red Magisterial (seguros-redmagisterial.com), Seguros KC (seguroskc.com), Grupo KC Corporate Site (grupokc.com.mx, antes `www2`), Cinemapedia y DashBoard Next14 (sus repositorios públicos). Una entrada sin enlace sigue seleccionándose en el inspector, es un botón sin flecha y el inspector no muestra "Visit the project".
- Imágenes: Volaris Analytics usa su captura completa y Acolyte Health un recorte del logo (sin formulario ni la nota de 1Password); Getmore usa una instantánea de su despliegue público. No se usaron: la portada de Centro de Pruebas (muestra nombres de flujos internos), `admin-dashboard-lilac-xi.vercel.app` (portada con "Log in"), el sitio de AI talent (inicio de sesión) ni el despliegue público del widget de seguros digitales (404). Las capturas con dispositivo propio (EoS, CRM Mobile, Card Tu Agente) ahora tienen fondo transparente en lugar del gris, y se tapó el texto de la barra de direcciones de las dos que mostraban un host interno.
- GitHub (lectura con `gh`, constantes con fecha 2026-11-06; sin llamadas en ejecución ni token en el cliente): contribuciones 241 (2023), 263 (2024), 376 (2025) y 5,428 (2026), y 5,476 en los últimos 12 meses, que coincide con la gráfica de carrera; 43 repositorios propios y de la organización sin forks (un fork de otro autor no se cuenta ni se lista); lenguajes por bytes de código. El encabezado de Work muestra "36 projects · 43 repositories" y una barra segmentada de lenguajes con sus porcentajes en texto.
- Pilas enriquecidas desde los manifiestos (solo tecnologías): Maximus (+Tailwind CSS, Redis, Chart.js), Titan (+Tailwind CSS, Azure Service Bus, NextAuth.js), Seguros KC (+Vue, Vite, Tailwind CSS, Pinia, Supabase), Card Tu Agente (+React, Tailwind CSS, Redis), NEXUS (+Vite, Tailwind CSS, Azure Service Bus), CRM Comercial (+Tailwind CSS, Redis, Zustand), CRM Mobile (+Tailwind CSS), Grupo KC Corporate Site (corregido a React, Vite, TypeScript y Tailwind CSS), Solcrédito Autos (corregido a Astro y Tailwind CSS), Portal BI, Batalla vs Thanos, CVA (+Supabase, PostgreSQL), Alianza (+Vite), ATLAS (+Recharts) y Reports API (+PDFMake, ExcelJS, QuickChart).
- Orden por lo que más se construyó: en el banco, ARI & MAYA primero y luego por cantidad de proyectos de la empresa (Grupo KC, Ensamble), y dentro de cada empresa por cantidad de tecnologías; en el mapa, las empresas por cantidad de proyectos y, dentro de cada una, primero las entradas con captura y luego por pila. Al elegir una tecnología, los proyectos que la usan pasan al frente (pestañas y mapa) sin mover la altura, las trazas se redibujan, el foco se conserva, el orden de las flechas sigue el orden visual y con movimiento reducido el cambio es instantáneo. Al limpiar se restaura el orden por defecto.
- Hero: "I build production software end to end: insurance platforms, mobile apps and tools that put AI agents to work." Se conservan nombre, título, retrato y botones; la fila de datos muestra "Worked with", "Projects" (36, derivado), "In software since", "Contributions in 2026" (5,428) y "Core stack" (las cinco tecnologías con más proyectos). A 1440 la altura del hero no cambia (900 px).
- Aviso: Prometeo, ATLAS y los repositorios privados sin proyecto ([repo privado], [repo privado], [repo privado], [repo privado] y otros) no se agregan como proyectos: se consultan al dueño.

### Correcciones menores tras la cuarta ronda (Work v5)

- Seguros KC pasa a Vue, Vite, TypeScript, Tailwind CSS, Pinia y Supabase (su manifiesto no tiene React ni Next.js); la barra de lenguajes se recalcula sin cuatro repositorios privados sin proyecto (uno de ellos copia del de Single sign-on): 39 repositorios, TypeScript 47 %, JavaScript 36 %; la línea de pila del hero pasa a TypeScript, React, Next.js, Node.js, PostgreSQL y Flutter; las cifras del hero usan la misma tipografía y peso; y al elegir una tecnología el banco muestra el primer proyecto que la usa si el actual no coincide (al limpiar se conserva la selección).

### Quinta ronda: más proyectos, orden por commits, selector de compañías y 3D (Work v5)

Comentarios del dueño, textuales:

- "si, agrégalos, todo lo que pdamos agregar hay que agregarlo. el apartado de slected work,m sigue mostrando como numero uno a air y maya? no deberia ordenarse solo acorde a lamayor ocntirnbuicon o algo asi? en all porjects ,se siente demasiado plano todo, podemos darle mas estilo 3d quiza tambien, y faltan links al proeycto o a la pagina no?, si te falta alguno dime cual. ... al final buscamos cretividad en lo priemro que vean no? que el usiario al entra se quede y quyira vcer toda la pagina"
- "https://titan.grupokc.com.mx/ https://maximus.grupokc.com.mx/ https://crm.grupokc.com.mx/dashboard https://nexus.grupokc.com.mx/ https://eos.grupokc.com.mx/#/login https://atlas.grupokc.com.mx/login — Deploy privado o sin URL pública clara: AI talent, Portal BI, Testing center, CRM Mobile, Batalla vs Thanos, Digital insurance widget. Red Médica, SegunNet, Prometeo, Admin Vacunas, Vacunas, Atlas de la Biodiversidad, Volaris, Acolyte. Reports API, Notifications API, KC coding harness. en estos invetale algo, se ingenioso y si se puede un link a su repo si es publico si ni, pon algo ingenioso"
- "no es necsario ese button, basta qcon decir que el repo es privado. y en esta seccion falt que se acomode por mayro contrinucion a menor no? en teroi el numero 1 debria de ser kairo no ari"
- "en la aprte de all projects , hay manera de que esten como quie pocultos los paneles por compania>? es decir que pueda yo abrirlos acorde al que yo queora pra poder verlos, ahi es ya dodne tednria ya un estilo com ode videijuego no? reucrda que kairo com otal es back asi que no tiene una imagen web como tal"

Decisiones (esta ronda reemplaza las excepciones anteriores sobre Kairo y los enlaces):

- Proyectos nuevos (README y manifiesto leídos con `gh`; nombres genéricos, sin nombres de repositorio): Help desk, Desktop AI assistant, Employee benefits app, Single sign-on, Pizza ordering app, Repository explorer, Map and charts SPA y Portfolio site (44 proyectos en total). Se pliegan, sin ser nuevos: un repositorio en ARI & MAYA, uno en Card Tu Agente, dos en Grupo KC Corporate Site y uno en Single sign-on. Excluidos: tres repositorios privados sin proyecto y cleanyourtv (fork). Turnitin no se agregó: es un ejercicio de entrevista de un tercero con un solo commit, incómodo de mostrar a un reclutador. El README del repositorio de SSO describe otro proyecto (un chatbot), así que su línea sale solo de la descripción del repositorio y de las dependencias (Express, JWT).
- Commits: constante estática fechada (2026-11-07) por proyecto, de `gh api repos/<repo>/commits?author=Kal-elSam&per_page=1` (última página del encabezado Link) en la rama por defecto, sumando los repos plegados; sin conteo (nunca "0 commits") para Ensamble, Lumston, Lemu, Prometeo, Notifications API y Desktop AI assistant. Se muestra en cada pestaña del banco y en el inspector.
- Orden estricto por commits, sin excepción (reemplaza la excepción de Kairo): el banco son los 8 proyectos con mayor número de commits que tienen pantalla real, más Kairo, que el dueño nombró como única excepción backend por no tener pantalla. Banco: 01 Kairo (1473), 02 ARI & MAYA (872), 03 Titan (221), 04 CVA Church Page (186), 05 Grupo KC Corporate Site (94), 06 Portfolio site (91), 07 Seguros KC (78), 08 Maximus (68). La regla es automática. Kairo no usa un marco de navegador ni una captura web: su panel es el esquema `Diagram` en grande con "Trace a request" y su comando real `npx @kal-elsam/kairo-runtime` como texto plano en un bloque.
- Enlaces: Titan, Maximus, CRM Comercial, NEXUS, EoS Mobile y ATLAS enlazan a las URL exactas del dueño con el botón "Open live system" y la nota "sign-in required" (el nombre de host no se imprime como texto). Los proyectos sin destino público no muestran botón ni `mailto:`: una línea mono con un candado dice "Private repository" cuando existe un repo privado atado al proyecto y "Private project" cuando no se puede atar ninguno. Ningún consumidor (banco, mapa, prototipos de mapa y muro, AllProjects) renderiza `/projects#…`: `MapProject.href` es opcional y los consumidores dibujan un control que no navega.
- All projects es un selector de compañías: cada compañía es un panel blindado cerrado, ordenado por commits, con nombre, número de proyectos, commits, tecnologías principales y una escotilla sellada con candado; al abrirse la escotilla se abre en 3D, un impulso recorre las trazas y los tiles salen de la profundidad (alrededor de 700 ms, nunca bloquea la entrada, sin sonido). Se abre una compañía a la vez; elegir otra cierra la actual en el mismo gesto y elegir la abierta la cierra; el botón pulsado no se mueve (se compensa el scroll). El inspector aparece solo con una compañía abierta y empieza en su primer proyecto. Filtro y `work:pick`: los paneles cerrados muestran "n / total", se iluminan con coincidencias y se atenúan sin ellas; si solo una compañía coincide se marca con "only match" y no se abre sola. En móvil los paneles se apilan y se abren en su lugar (reemplaza las pestañas de grupo). Accesibilidad: `button` con `aria-expanded` y `aria-controls`, Enter y Espacio, Escape cierra y devuelve el foco al botón, tabindex móvil solo dentro del panel abierto. Sin movimiento: apertura instantánea. Sin JavaScript todos los paneles quedan abiertos y los cuerpos cerrados siguen en el DOM; con JavaScript se ocultan con `display: none`, así que sus imágenes `lazy` no cargan hasta abrir.
- 3D (solo CSS 3D y GSAP): cada tile es una losa con borde achaflanado extruido, la pantalla o el dispositivo flota en `translateZ` con sombra real, inclinación de unos 6 grados con brillo móvil y paralaje (un solo listener y un rAF, solo `transform`, solo con puntero fino y sin reducir movimiento, se restablece al salir), el tile elegido se adelanta y el dispositivo del inspector se inclina y entra con una transición de profundidad. Las entradas sin pantalla llevan una placa con su tipo (API, CLI, WEB, MOBILE, WIDGET, DESKTOP) y sus tecnologías. Cada compañía abierta es una placa elevada con grosor visible y un riel luminoso. Con movimiento reducido la profundidad es estática.
- Trace a request: los proyectos backend y CLI (Reports API, Notifications API, KC coding harness, Single sign-on y Kairo) tienen en su esquema un botón real con `aria-pressed` que lanza un pulso etapa por etapa (unos 1.5 s, reiniciable) resaltando cada caja con las etiquetas del esquema; con movimiento reducido se iluminan todas de inmediato.
- Contrato con el hero: Work escucha `window.dispatchEvent(new CustomEvent('work:pick', { detail: 'TypeScript' }))`, elige esa tecnología (sustituyendo la anterior) y no hace scroll; exporta `STACK_COUNTS`, `PROJECT_COUNT` y `CONTRIBUTIONS_2026` desde `workData.ts` (`PROJECT_COUNT` ya existía). El hero recibió una órbita de tecnologías (a cargo de otro constructor).

- Portfolio site: el dueño avisó, textual, "tambien reucerda que ya cambio el disneo de mi portafolio site, asi que esta iamgen que tnemos sera otra". La captura anterior (diseño claro "DevSam") se reemplazó por una captura real del home actual a 1440x900 con DPR 2, con la órbita de tecnologías asentada; su pila sale del `package.json` del repositorio (Next.js, React, TypeScript, Tailwind CSS, MDX, GSAP y Three.js).

### Avisos que siguen abiertos

- Commercial area system podría ser el mismo producto que Maximus, e IP agents system el mismo que Titan. No se fusionan: el total sigue en 44.
- Prometeo y ATLAS ya declaraban `company: 'KC'` por el texto de login y pie de sus capturas y se agrupan en Grupo KC.

## Contexto

- Cita del dueño: "con toda esta informacion, lo que bisucamos primera mente y sobre todo es mejorar potencialment el diseno y conteido, que no sea un portafolio generico, ni que sea con el tipico estilo hecho por ia".
- Stack actual: Next.js 13 Pages Router, React 18, Tailwind, framer-motion. Sin runner de tests (`docs/ai/testing.md`).
- Estado actual a eliminar (evidencia en código):
  - Plus Jakarta Sans con `font-[1000]` en `Header/HeaderTitle.tsx`.
  - Acento violeta, glow radial (`Header/HeaderImage.tsx`), tarjeta con gradiente (`components/wireframes/ProjectCard.tsx`), `backdrop-blur` decorativo (11 archivos).
  - Grids repetidos de tarjetas de 3-4 columnas y métricas de número grande (`ImpactMetrics`, `FeaturedCaseStudies`, `RoleImpactSection`, `HeaderTechStack`).
  - Eyebrows en mayúsculas sobre títulos, pill con `animate-ping` (`Header/HeaderCta.tsx`), emoji e iconos decorativos.
- Contenido actual: 24 proyectos; hero dice "Software Engineer"; `ImpactMetrics` dice "5 companies" (`contents/index/ImpactMetrics.tsx:18`) mientras `contents/work/careerTimeline.ts` lista 6; 4 de 5 posts del blog están en indonesio y son de 2023; TIL con último contenido 2024-02-03.
- Hechos del CV (fuente de verdad): Senior Software Engineer | System Architecture | AI Engineering; 6+ años; Ensamble Administrador de Riesgos y Sistemas, sep 2021-presente, Software Engineer / Frontend Lead 2023-presente, productos empresariales de seguros y operaciones; mejora aproximada de 30% en rendimiento frontend; reducción aproximada de 30% en tiempo de entrega de features; contrato Lumston 2025; Lemu 2022 (Flutter); Grupo KC dic 2020-jul 2022; Kairo Runtime 2026-presente (npm `@kal-elsam/kairo-runtime`, fuente `github.com/Kal-elSam/harness`, enruta entre Claude Code, Codex y OpenCode por capacidad, elegibilidad, cuota y costo); ARI & MAYA 2026 (flujos conversación-a-acción con WhatsApp Cloud API, Google Calendar OAuth, PostgreSQL); B.S. Ingeniería Mecánica, Tecnológico de Chiapas 2017; M.S. Project Management, UNITEC 2021.
- Hechos de LinkedIn (fuente: export en PDF de LinkedIn entregado por el dueño):
  - Faurecia, Production supervisor, ene 2018-sep 2018, Querétaro.
  - miga ingenieria, Projects Engineer, sep 2018-ago 2020, Querétaro.
  - Biblioteca publica Jaime Sabines, Technical support, nov 2016-may 2017, Tuxtla Gutiérrez.
  - Lumston: ene 2025-dic 2025. Lemu: abr 2022-sep 2022.
  - Educación: Instituto Tecnológico de Tuxtla Gutiérrez, Ingeniería mecánica (2012-2017); Universidad Tecnológica de México (UNITEC), Maestría en Dirección de proyectos (2019-2021).
- Verdad de producto de Kairo, según su README: es la capa de costo y cuota sobre gentle-ai. gentle-ai define cómo trabaja el equipo; Kairo aporta evidencia de quién hace cada tarea, con qué modelo y a qué costo. Un analista elegido propone un equipo, un humano lo aprueba, las tareas se reparten entre modelos calificados según la cuota restante por encima del piso de calidad del rol, el fallback se queda dentro del rol, y los veredictos alimentan la calidad medida.

## Alcance

### Home (la superficie más importante): 6 momentos

Principio del dueño: "NO BUSCAMOS SATURAR AL USUAROI DE TEXTO, BUSCAMOS CREASTIVIDAD Y DINAMISMO". Cada momento se entiende con a lo sumo una línea de texto; el movimiento y el 3D explican. Kairo y la IA son la apuesta principal de la home.

1. Hero (protagonista: Kairo como orquestador visible; lo implementa otro escritor en `components/prototype/kairo`, la home solo lo importa): Kairo y la IA en movimiento, con identidad. Primera pantalla: "Samuel Gomez Serrano", título exacto "Senior Software Engineer | System Architecture & AI Engineering", headline "I design systems teams can understand, operate, and evolve.", una línea corta de qué hace Kairo (menos de 14 palabras, coherente con el README), Download CV, Contact y un enlace pequeño al repositorio de Kairo. Nada más. Detrás, una escena 3D viva: una tarea entra, un sistema de IA decide quién la hace y por qué, y cuando se acaba la capacidad la reencamina. Prototipo: `/prototype/kairo`.
   - Headline (borrador, pendiente de aprobación final del copy por el dueño): "I design systems teams can understand, operate, and evolve." (proviene del resumen de LinkedIn del dueño).
2. Kairo, la sección más grande (nombre de producto en la home y el hero: "Kairo", nunca "Kairo Runtime"; el paquete npm `@kal-elsam/kairo-runtime`, la URL del repo y la ruta `/work/kairo-runtime` son identificadores reales y no cambian). Debajo del título va un eslogan: "The right agent for every task." (no afirma más de lo que dice el README). Una tarea, modelos que compiten, quién gana y por qué, y luego se acaba la cuota y el trabajo se mueve. Ordenado y verificado contra `github.com/Kal-elSam/harness` (ver "Orden de decisión verificado"). Etiquetas mínimas y reales.
3. La IA en acción: flujos, workflows y orquestación, incluidos agentes que se reparten el trabajo y un mensaje de WhatsApp que se convierte en una reserva (ARI & MAYA).
4. Sistemas de seguros: representa el ecosistema, no un producto. Varias pantallas reales y completas (CRM Comercial, Titan, NEXUS) se suceden con el scroll en un solo movimiento de cámara con CSS 3D (sin canvas): cada una nítida, con luz desde arriba a la izquierda, borde iluminado, sombra de contacto y las siguientes en penumbra detrás; la que se va sube hacia la cámara y sale por arriba, siempre opaca (sin transparencias superpuestas). Cada pantalla lleva un pie con el nombre del proyecto; la pantalla de Maximus/un nombre interno queda fuera hasta que el dueño decida su nombre (decisión 9). El estado abierto con la placa gris queda eliminado. El movimiento solo empieza con la sección ya fija y sigue la rueda sin suavizado (tres pantallas: es lo que se lee bien en media altura de scroll fijo). Sin movimiento (reduced motion, ancho < 900px, sin JS) hay una composición estática diseñada con las mismas pantallas, cargadas sin lazy. Se mantienen el título "Insurance systems" y una línea. [Nota 2026-11-06, L-T3-v6: el dueño pidió reemplazarla por un recorrido 3D ("a tour through the business", etapas Lead, CRM, Quote, Policy, Analytics). SUPUESTO pendiente de confirmación del dueño: ese orden es una propuesta, no una afirmación sobre integraciones reales. El dueño cuestionó después por qué seguros tendría un recorrido propio ("tenemos diferentes clientes con los que hemos trabajado y diversos proyectos tanto personales como individuales"): el recorrido se detuvo y esta sección queda como está en el último commit hasta que llegue la nueva taxonomía. El trabajo construido se archivó fuera del árbol, ver el informe de T3 v6.]
5. Todos los proyectos, "el archivo": un anillo 3D de paneles alrededor del espectador, en el mismo mundo oscuro del hero, con todos los proyectos (el conteo sale de los datos: 44). Los proyectos con imagen real y utilizable (20; Volaris y Acolyte pasan a panel tipográfico porque su imagen es solo un login) muestran la pantalla completa (sin recortar) en un panel curvo, oscura con el tratamiento de las pantallas de fondo hasta que queda al frente y entonces a plena fidelidad; los demás (21) tienen un panel tipográfico oscuro con sus datos reales (nombre, área, rol o "Contribution", año si se conoce), sin imagen inventada. Kairo va primero y es el más prominente, con un panel de terminal real: `npx @kal-elsam/kairo-runtime`. El orden del anillo agrupa por área (IA con Kairo, seguros, móvil, web) sin dar prioridad a ninguna; el filtro por área (con el conteo real de cada una y "All") gira el anillo hasta ese bloque, resalta esa área y atenúa el resto. Interacción: arrastre con inercia, flechas del teclado y botones anterior/siguiente; el scroll por la sección corta (1 altura de viewport fija, sin atrapar la página) también gira el anillo. El proyecto al frente muestra nombre, rol y enlace. Accesible: la lista HTML de todos los proyectos con enlaces es la fuente de verdad (enfocar un enlace gira el anillo), el canvas es `aria-hidden`. Táctil, estrecho (< 900px), movimiento reducido, sin WebGL, contexto perdido y sin JS: galería horizontal con los mismos paneles más la lista; todos alcanzables. Las descripciones viven en `/projects`. Se excluyen las imágenes ya descartadas (fotos de congregación de CVA, arte de Batalla vs Thanos, páginas con fotos de stock o retratos, logins, tuagente). Los carriles/áreas actuales se mantienen hasta que llegue una nueva taxonomía.
6. Carrera y contacto: línea de tiempo por empresa y gráfico de contribuciones real y fechado, sin 3D. La educación es un dato simple aquí. Contacto: email, LinkedIn, GitHub, CV.

Retirado como hero: el muro 3D de pantallas reales (`/prototype/wall`). Historial: commits 013f810, 0049691, 339d83a. El recorrido fijado del muro (antiguo momento 2) también se retira.

### Orden de decisión verificado (Kairo, `github.com/Kal-elSam/harness`, leído el 2026-11-06)

Fuente: `src/global/team/project-router.js` (función `resolveRoute`), `src/global/intelligence/quota-pacing.js`, `src/global/team/exhaustion.js`, README. Solo estos pasos pueden aparecer en la visualización; lo que no se pudo verificar no se muestra.

1. Sin estrategia activa o sin entrada para el rol: espera, no hay delegación (`project-router.js:267-280`). Un humano aprueba el equipo antes (README: analista elegido propone, humano aprueba).
2. Banda y piso de calidad del rol: solo candidatos compatibles con el rol y con capacidad verificada (`project-router.js:305-322`). La calificación usa percentiles de capacidad (`capability-scoring.js:312`, `:536-595`).
3. Rechazos explicados: fuera de banda, no calificado, sin derecho de uso, agotado (`project-router.js:385-397`).
4. Admisión por costo y cuota, solo si hay muestras y registro de ejecuciones: elige el de mayor `utility` entre los admitidos; si ninguno, espera hasta el reset (`project-router.js:420-489`).
5. Distribución entre candidatos calificados según la cuota restante, omitida si la cuota es desconocida; los proveedores bajo presión se excluyen (`project-router.js:517-531`, `:128-129`).
6. Presión de cuota: `paceFactor = restante / tiempo restante de la ventana`, acotado a [0.01, 4] (`quota-pacing.js:56`); por debajo de 0.5 reencamina al alternativo calificado más barato fuera del proveedor presionado (`project-router.js:155-163`, `:576-601`).
7. Agotado (`remainingPercent === 0` o agotamiento registrado): `quota-reroute` al primer alternativo calificado y ejecutable, sin salir del rol (`project-router.js:380-384`, `:622-632`). Si no hay ninguno, espera (`:630`).
8. Detección de agotamiento: clasificación pura del texto de error del proveedor, sin sondas ni reintentos (`exhaustion.js:1-20`).
9. Si nada fuerza un cambio, se usa el modelo aprobado para el rol (`project-router.js:639-646`).

Entradas de pacing: niveles HEALTHY / WATCH / CONSERVE / CRITICAL según la proyección al reset (`quota-pacing.js:96-113`); tiempo muerto esperado = `max(0, reset − agotamiento)` (`quota-pacing.js:170`). Muestra real registrada (2026-11-05): Claude 5h 82%, semana 92%; Codex 5h 52%, semana 47%; Codex proyectado sin usar unas 93 h. Proveedores con soporte verificable: Claude, Codex y OpenCode Go (capacidad legible); Cursor aporta acceso, no cuota legible (README).

### Regla de atribución (Kairo y gentle-ai)

- No afirmar que Kairo orquestó este sitio salvo que exista una ejecución real con un equipo aprobado. `kairo team analyze` falló en este proyecto (L6), así que hoy no se afirma.
- Acreditar a gentle-ai el flujo de trabajo, la revisión, las skills y la memoria. Kairo aporta quién hace el trabajo y a qué costo (README).
- No usar logos de marcas ni métricas, benchmarks o afirmaciones de rendimiento inventados. Todo lo ilustrativo lleva la etiqueta "Illustrative"; las cifras reales llevan fecha.

### Páginas: 6

1. Home.
2. Projects: índice filtrable de todo, incluidos los repos más allá de los 24 donde existan repos confirmados. Aquí viven las descripciones.
3. Kairo Runtime (`/work/kairo-runtime`): caso largo.
4. ARI & MAYA (`/work/how-i-built-ari`): caso largo, con el AI Workflow Simulator.
5. Ecosistema de seguros (página nueva): caso largo.
6. About (`/about`): fusiona experiencia, habilidades, principios, diseño de sistemas, contacto y hire-me.

### Resto del sitio

- Redirecciones (permanentes, con ancla): `/work/experience` -> `/about#experience`; `/work/skills-and-tools` -> `/about#skills`; `/work/engineering-principles` -> `/about#principles`; `/work/system-design` -> `/about#system-design`; `/work/contact` y `/hire-me` -> `/about#contact`. Las URLs de casos largos se conservan.
- `/blog` y sus 5 posts redirigen a la home; `/today-i-learned` queda retirado. El blog y TIL siguen retirados.
- AI Workflow Simulator pasa de la home al caso de ARI.

### Reglas de datos de proyectos

- Todo proyecto aparece. No se inventan hechos, roles, conexiones ni métricas.
- Las conexiones solo se dibujan cuando son verificables.
- Un repo conocido solo por metadatos de listado se etiqueta como contribución hasta que el dueño entregue README y rol.
- cleanyourtv es un fork: no se presenta como trabajo original.
- Los nombres de organizaciones privadas y repos privados no aparecen en el sitio hasta resolver la decisión 7; se usan nombres funcionales.
- Kairo se muestra con decisiones y consecuencias, no como una máquina. El "control plane" del CV y la descripción del repo "AI governance harness" difieren; es un riesgo de unificar.

### Diseño

- Campo casi negro y un solo acento ácido `#c8ff2e`.
- Schibsted Grotesk en todo el sitio. IBM Plex Mono solo para datos reales.
- Metal oscuro y luz real para el 3D. Sin glitch ni scanlines.
- Layouts variados en lugar de grids repetidos de tarjetas.
- Copy en inglés. Solo tema oscuro (supuesto pendiente del prototipo).
- Sin violeta, glow radial decorativo, gradiente ni blur decorativo.
- Se eliminan eyebrows en mayúsculas, el pill `animate-ping` y emoji/glifos de icono.
- Cuerpo de texto de 65-75ch; contraste mínimo 4.5:1; animar solo `transform` y `opacity`.

### Movimiento

- El scroll es normal salvo las secciones pegajosas (sticky) 2, 3 y 4. El hero NO se fija: un scroll normal lo deja de inmediato y su bucle automático sigue mostrando el reencaminado.
- Recorrido total antes de All projects, en alturas de viewport (dueño: "dale, con esos números"): hero 1, Kairo 2, AI in action 1.5, Insurance systems 1.5; total 6 (antes 15). All projects pasa de 6 a unas 1.5 alturas al quitar el muro de 42 nombres (dueño: "aqui en all prjects se ve todo amopntodado").
- Bucle del hero: el primer reencaminado empieza a los 1.5 s de aparecer el hero (antes 5 s de reposo); el ciclo dura 12.5 s.
- Respuesta inmediata: sin suavizado del scrub (`scrub: true` o `onUpdate` directo); sin librerías de smooth-scroll, sin snap, sin secuestrar el scroll. La página fija `scroll-behavior: auto` para que los saltos sean instantáneos.
- El contenido se recorta, no se acelera: Kairo muestra 4 pasos (Analyze & approve, Assign, Distribute, Fall back & learn); AI in action muestra 4 líneas de chat y 4 saltos; el estado final se mantiene al final del recorrido.
- Navegador de secciones: marcas discretas en el borde derecho (Home, Kairo, AI, Insurance, Projects, Career, Contact), anclas reales (funcionan sin JS), `aria-current="location"`, etiqueta al pasar el cursor o enfocar, oculto por debajo de 768px, sin animación de scroll.
- Una idea de animación por sección, con GSAP y three.
- Con `prefers-reduced-motion` y sin JS se muestra todo estático y completo.
- El 3D carga por separado, sin retrasar el primer render ni otras páginas.

### Móvil

- El 3D actual exige 1280px. Objetivo: 3D simplificado para teléfonos capaces y estático en el resto (supuesto, a validar en el prototipo).
- Si la home no sostiene el rendimiento, se recorta el peso de la escena en lugar de publicarla lenta.

### Contenido

- Contribuciones: un gráfico real y fechado como evidencia, nunca un número gigante como métrica de héroe. Verificado el 2026-11-05: 3,956 contribuciones en el último año; 1,486 commits, 413 PRs, 104 issues, 1,948 privadas. El valor publicado lleva fecha o fuente.
- Oferta del dueño: los README de los repos privados están disponibles si se piden, y muchos proyectos ya existen en local.
- Solo afirmaciones verificables. Las cifras de ~30% dicen "approximately", como el CV.
- Texto mínimo en la home: nada de párrafos largos; las descripciones viven en `/projects`.
- Corregir "5 companies" frente a 6 en `careerTimeline.ts`.
- Blog retirado entero (decisión 4): los 5 posts redirigen a la home y `/blog` sale de la navegación. TIL oculto hasta tener contenido nuevo.

### Herramientas

- GSAP y three en las animaciones por sección, vía `useGSAP` de `@gsap/react` (gsap 3.15.1, @gsap/react 2.1.2, limpieza con `gsap.context`, seguro para SSR). framer-motion se mantiene en el código existente.
- `pbakaus/impeccable` (detector determinista de 62 reglas) y `taste-skill` son parte del proceso de trabajo. Si alguna señala un elemento elegido, se corrige o se justifica por escrito.
- `three`/WebGL aprobado mediante la petición de 3D del dueño (decisión 3).
- `ai-design-skills` es referencia de consulta únicamente.

### Debe preservarse
- Reactions, ShareButton, Activity, vistas y shares (acoplados a Prisma; montados con `WithReactions` en layouts de Post y Project).
- Nombres de componentes MDX: `TIL`, `Stack`, `CareerTimeline`, `ArchitectureDiagram`, `StackByCategory`, `Callout`, `Labels`.
- Claves de frontmatter `caption` y `layout`.
- `#page-header`, `#skip-navigation`, `?simpleLayout`, clase `fm` de focus mode.
- Rutas de imágenes OG y sus fuentes TTF locales.
- Next.js 13 Pages Router, sin migración a App Router.

## No alcance
- Migrar framer-motion a GSAP.
- Migración a App Router.
- `scroll-world` (rechazado: ~US$27 por 6 escenas, pesado y produce el aspecto de IA que se evita).
- Cambios en Prisma, API de reactions, CI/CD, deploy o `.env`.
- Escribir contenido nuevo de blog en nombre del dueño.
- Requisitos no listados en el brief aprobado.
- Publicar el número de teléfono del dueño: no se publica en el sitio.

## Criterios de aceptación

### Home y contenido
- [ ] La primera pantalla muestra exactamente el título "Senior Software Engineer | System Architecture & AI Engineering" y el copy final del hero fue aprobado por el dueño.
- [ ] La primera pantalla contiene solo: nombre, título exacto, headline, una línea de Kairo (menos de 14 palabras, coherente con el README), Download CV, Contact y un enlace pequeño al repositorio de Kairo.
- [ ] El hero es una escena 3D viva en la que un desconocido entiende en segundos que llega una tarea, un sistema de IA decide quién la hace y por qué, y al agotarse la capacidad se reencamina; las etiquetas son pocas, grandes y reales; lo ilustrativo dice "Illustrative" y la muestra real dice su fecha ("Pacing sample, 2026-11-05").
- [ ] La home tiene 6 momentos con texto mínimo; cada uno se entiende con a lo sumo una línea.
- [ ] El sitio no afirma que Kairo orquestó el sitio salvo que exista una ejecución real con equipo aprobado; gentle-ai queda acreditado por flujo, revisión, skills y memoria.
- [ ] Las páginas son 6 (Home, Projects, Kairo Runtime, ARI & MAYA, Ecosistema de seguros, About) y las URLs antiguas redirigen.
- [ ] La home muestra un índice compacto de todos los proyectos con enlaces, y existe `/projects` filtrable con todo, incluidos los repos confirmados más allá de los 24.
- [ ] Los destacados son Kairo Runtime, ARI & MAYA y el ecosistema de seguros, y solo ellos llevan 3D y sección especial.
- [ ] Cada paso de la visualización de Kairo coincide con `github.com/Kal-elSam/harness`; la verificación queda registrada en el PR.
- [ ] La visualización de ARI & MAYA muestra paso a paso cómo un mensaje de WhatsApp se convierte en acciones y una reserva.
- [ ] El ecosistema de seguros solo dibuja conexiones verificables, usa nombres funcionales, y ningún nombre de organización privada ni de repo privado se publica sin confirmación del dueño (decisión 7).
- [ ] Todo proyecto aparece; ningún dato, rol, conexión o métrica es inventado; los repos solo con metadatos de listado se etiquetan como contribución; cleanyourtv no se presenta como trabajo original.
- [ ] La carrera muestra línea de tiempo por empresa y gráfico de contribuciones real y fechado, sin 3D y sin número gigante de héroe.
- [ ] El sitio muestra el conteo de empresas consistente con `careerTimeline.ts`.
- [ ] Toda cifra de ~30% está escrita con "approximately" y se puede rastrear al CV; no hay estadísticas ni testimonios inventados.
- [ ] Existen las páginas `/work/kairo-runtime`, `/work/how-i-built-ari` y la del caso de seguros como casos largos; `/work/system-design` y `/work/engineering-principles` siguen en el nuevo diseño; el AI Workflow Simulator está en el caso de ARI y no en la home.
- [ ] Las URLs de los 5 posts redirigen a la home, `/blog` redirige a la home y no aparece en la navegación; TIL no aparece en navegación ni listados.

### Diseño (cada punto es verificable por inspección o por auditoría)
- [ ] Ya no existe `font-[1000]`, violeta, glow radial, gradiente en `ProjectCard`, ni `backdrop-blur` decorativo.
- [ ] Una sola tipografía (Schibsted Grotesk) y un solo acento (`#c8ff2e`); IBM Plex Mono solo en datos reales; sin glitch ni scanlines.
- [ ] Lo nuevo evita estos tells: texto o fondos con gradiente, grids idénticos de icono+título+texto, tarjetas nidadas, bordes de color de un solo lado, eyebrows, numeración 01/02/03 de secciones, bloques de métricas de héroe, glass decorativo, emoji como iconos, fade-up uniforme en cada sección, monoespaciada como disfraz (fuera de datos reales), SVG estilo boceto, página crema con serif fina y acento en cursiva, estadísticas o testimonios inventados, verbos de relleno.
- [ ] Los layouts varían según el contenido, sin repetir grids de tarjetas.
- [ ] Cuerpo de 65-75ch; contraste >= 4.5:1; solo se animan `transform` y `opacity`.
- [ ] Una auditoría de `impeccable` y la revisión con `taste-skill` no dejan tells sin corregir o sin justificar por escrito.

### Movimiento y rendimiento
- [ ] El scroll es normal salvo la sección fijada del recorrido y las secciones destacadas; cada sección usa una sola idea de animación.
- [ ] Con `prefers-reduced-motion: reduce` y sin JS todo se muestra estático y completo.
- [ ] El 3D carga por separado y no retrasa el primer render ni otras páginas.
- [ ] En móvil (viewport 375px) el contenido es legible y usable sin scroll horizontal; los teléfonos capaces reciben 3D simplificado y el resto una versión estática (validado en el prototipo).
- [ ] El rendimiento de la home se midió en dispositivos más débiles (móvil de gama media/baja y portátil sin GPU dedicada) y cumple el umbral acordado; si no, se recortó el peso de la escena.

### Preservación
- [ ] Reactions, ShareButton, Activity, vistas y shares siguen funcionando en layouts de Post y Project.
- [ ] Los componentes MDX, claves de frontmatter, IDs, `?simpleLayout`, clase `fm` y rutas OG listados siguen operando.

### Validación técnica
- [ ] `pnpm lint`, `cd apps/devSam && pnpm lint:types` y `pnpm build` pasan.

## Estados de UI

| Caso | Resultado esperado |
| --- | --- |
| Scroll con JS y movimiento normal | Scroll normal; solo los momentos 2, 3 y 4 son pegajosos y animan; el hero no se fija (GSAP, three, solo `transform`/`opacity` en DOM) |
| `prefers-reduced-motion: reduce` | La escena 3D se renderiza como un fotograma completo con todas las etiquetas, sin pin ni bucle (no se reemplaza por otra cosa; supuesto pendiente, ver decisión 11) |
| Sin JS / SSR | Todo el contenido estático y legible; nada oculto a la espera de JS |
| Sin WebGL, contexto perdido (se maneja `webglcontextrestored`), sin JS o ancho estrecho | SVG estático diseñado del mismo sistema con las mismas etiquetas; el resto renderiza |
| Móvil (<= 375px) | 3D simplificado en teléfonos capaces, estático en el resto; sin scroll horizontal |
| Dispositivo débil con rendimiento insuficiente | Se reduce el peso de la escena; no se publica lenta |
| Proyecto solo con metadatos de listado | Etiquetado como contribución, sin rol ni conexiones |
| Capturas publicadas | Muestran solo datos mock (ver decisión 1) |
| Foco por teclado | Foco visible; `#skip-navigation` operativo |
| `?simpleLayout` / clase `fm` | Comportamiento actual intacto |

## Casos de error

| Caso | Resultado esperado |
| --- | --- |
| Paso o etiqueta de Kairo no existe en `harness` | No se publica; se corrige contra el repositorio |
| Conexión entre proyectos no verificable | No se dibuja |
| Fallo al cargar GSAP, three o error en la escena | Cae a la versión estática; el resto de la página renderiza |
| Ruta de post de blog o `/blog` retirados | Redirect a la home (decisión 4) |
| Fuente tipográfica no carga | Fallback del sistema sin romper layout |
| Falta de insumo del dueño (capturas, README o rol de repos privados) | No se publica placeholder; el repo se etiqueta como contribución |

## Estrategia de testing

El proyecto no tiene runner. Esta spec propone un E2E mínimo; agregar cualquier dependencia de desarrollo requiere confirmación del dueño (`AGENTS.md`, `docs/ai/testing.md`).

- E2E mínimo (Playwright, propuesto en `docs/ai/testing.md`):
  - Home renderiza con el título exacto completo "Senior Software Engineer | System Architecture & AI Engineering", el mapa y las seis secciones en orden.
  - Versión estática bajo `prefers-reduced-motion: reduce` y sin JS.
  - `/projects` lista todos los proyectos y los filtros funcionan; `/blog` redirige a la home.
  - Flujo de Reactions preservado en una página con layout Project (no quedan posts de blog; el código del layout Post se conserva para una reapertura futura).
- Estático: `pnpm lint`, `pnpm lint:types`, `pnpm build`.
- Auditoría: `impeccable` sobre el resultado; hallazgos corregidos o justificados.
- Medición: rendimiento en dispositivos más débiles (fps, LCP, CLS) con umbral acordado antes de publicar; recortar escena si no cumple.
- Manual: revisión móvil y sin JS; contraste 4.5:1; verificación de la visualización de Kairo contra `harness`; revisión de datos de proyectos contra fuentes.
- Unit: no aplica salvo que se agregue lógica nueva en `lib/` o `helpers/`.

## Riesgos y contradicciones

- Contradicción con `docs/ai/ui.md`: esa guía fija Plus Jakarta Sans, acento `red`/`blue` y Framer Motion como librería de animación. Este brief prevalece: Schibsted Grotesk, acento `#c8ff2e` y GSAP/three para las animaciones por sección. `ui.md` debe actualizarse tras la aprobación.
- Contradicción con `portfolio-product-engineer-v2.spec.md` (supersede parcialmente):
  - Hero y título "Software/Product Engineer" -> "Senior Software Engineer".
  - Vitrina de proyectos y secciones de impacto (`ImpactMetrics`, `RoleImpactSection`, `FeaturedCaseStudies`) -> índice completo y destacados con layouts variables.
  - Blog técnico de Fase 5 -> se retira entero; sin blog nuevo en esta spec.
  - Su no-alcance "sin librerías nuevas sin ADR" -> GSAP propuesto, sujeto a confirmación y registro como ADR.
- Contradicción con `docs/ai/testing.md`: ahí los flujos E2E prioritarios incluyen "Blog listing y post individual"; esta spec retira el blog, así que ese flujo se reemplaza por Reactions en una página con layout Project.
- `harness` es MIT con 0 stars (verificado 2026-11-05; `portfolio-product-engineer-v2.spec.md` está desactualizado). El copy puede llamarlo "open source"; no debe usar las stars como prueba social.
- Unificar la descripción de Kairo: el CV dice "control plane" y la descripción del repo dice "AI governance harness". El README lo define como capa de costo y cuota sobre gentle-ai. El copy debe elegir una formulación única y verificable.
- Licencia de GSAP no verificada: gsap.com bloqueó la lectura automática (decisión 2, pendiente).
- Rendimiento: tres escenas 3D más un mapa en la home pueden afectar LCP/CLS y la fluidez en dispositivos débiles; el 3D actual exige 1280px (medido en un Apple M4, no representativo). Mitigación: carga diferida, escena simplificada o estática en móvil, medición en dispositivos débiles, recortar antes que publicar lento.
- Mapa 3D con datos de proyectos: riesgo de dibujar conexiones o roles no verificables; mitigación con las reglas de datos de proyectos.
- Repos privados sin README ni rol: solo pueden mostrarse como contribución hasta que el dueño los entregue (decisión 8).
- Mostrar todos los proyectos de golpe en la home puede saturar la superficie; el índice debe ser compacto y la versión completa vive en `/projects`.
- El README del perfil de GitHub está desactualizado frente al CV y a LinkedIn. El CV y LinkedIn coinciden, así que prevalecen. El README queda fuera del alcance de este repositorio.
- Diferencias de título entre CV y LinkedIn: Grupo KC es "Junior Frontend Developer" en el CV y "Frontend Engineer" en LinkedIn; Lemu es "Flutter Developer" frente a "Product Owner & Mobile Engineer"; Lumston es "Frontend Software Engineer" frente a "Software Engineer / Frontend". El sitio usa la redacción del CV hasta que el dueño indique otra cosa (supuesto).
- El empleo en software empieza en dic 2020, así que "6+ años" pasa a ser exacto en dic 2026 (supuesto: se cuentan solo los roles de software).
- Las fechas de empleo se solapan (Grupo KC, Ensamble y Lemu en 2021-2022; Ensamble y Lumston en 2025); la línea de tiempo debe mostrarlas con exactitud.
- Las capturas se apoyan en la declaración del dueño de que los datos son mock. En la auditoría del muro (2026-11-06) se vieron imágenes que parecen mostrar nombres, rostros, RFC o números de póliza (CRM, Maximus dashboard, Titan indicadores/inicio/chat, NEXUS tickets, SegunNet tickets, Portal BI, tarjeta de agente, CRM Mobile, CVA, Admin Vacunas listado); se excluyen del muro hasta que el dueño confirme. También se excluye Batalla vs Thanos por arte con derechos de terceros.
- Dependencias nuevas (`impeccable`, runner E2E) no se instalan sin confirmación (`AGENTS.md`).
- El conteo de contribuciones de GitHub cambia a diario: el valor publicado necesita fecha o fuente (3,956 verificado el 2026-11-05).
- Publicar nombres de la organización privada o de repos internos sin confirmación del dueño expone información de un empleador (decisión 7).
- Una dirección visual intensa puede derivar en tells de IA (neón, glow, glass, monoespaciada decorativa); se mitiga con el prototipo, `impeccable` y `taste-skill`.
- Solo tema oscuro es un supuesto pendiente del prototipo.
- Kairo en el hero: riesgo de sobreafirmar. Mitigación: la regla de atribución (no se dice que Kairo construyó el sitio), solo pasos verificados contra `harness`, la muestra real con fecha y todo lo demás marcado "Illustrative".
- Texto mínimo frente a veracidad: menos texto puede dejar una afirmación sin contexto; cada etiqueta debe poder rastrearse al README o al código de `harness`.

## Open decisions

1. RESUELTA. Permiso para mostrar capturas de productos del empleador. Respuesta del dueño: "si dale hay permiso" y "todo son datos mock asi que no haytema".
2. RESUELTA (con pendiente). Dependencias `gsap`, `@gsap/react`, `impeccable` y runner E2E. Respuesta del dueño: "dale, aprobadas las dependencias"; commit 2f9b57c en `feat/exploded-view-redesign` con turbo fijado en 2.9.16. PENDIENTE: la licencia de GSAP todavía requiere revisión manual del dueño.
3. RESUELTA. Dirección visual con 3D real (WebGL), versión B descartada. WebGL/`three` aprobado por la petición del dueño: "sigamos con tus recomednaciones, no busco nada plano, buscamos cosas modelrnas actuales y que lo visual sea lo mucho mas atacxtivo, cosas 3d, alta calidad etc". Dependencias: three 0.187.0, @react-three/fiber 8.18.0, @react-three/postprocessing 2.19.1, @types/three 0.187.0. El concepto de escena fue reemplazado el 2026-11-06 por el mapa de trabajo.
4. RESUELTA. URLs de blog eliminadas. Respuesta del dueño: "1, retirarlo entero". Los 5 posts redirigen a la home y `/blog` sale de la navegación; puede reabrirse cuando haya contenido nuevo.
5. RESUELTA. Fuentes de hechos: el CV, el export en PDF de LinkedIn que entregó el dueño y el perfil público de GitHub.
6. RESUELTA (corregida). Los casos profundos ya no se limitan a dos: los destacados con 3D son Kairo Runtime, ARI & MAYA y el ecosistema de seguros. NEXUS no es destacado.
7. Nombres de la organización privada y de repos internos. Por defecto se usan nombres funcionales como "Notifications API"; no se publica nada más hasta que el dueño confirme. (Abierta)
8. README y rol de cada repo privado. Hasta que el dueño los entregue, esos repos se etiquetan como contribución. (Abierta)
9. Nombre del screenshot de Maximus: la captura publicada muestra un nombre interno dentro de la interfaz. Decidir si se recorta, se difumina o se deja. (Abierta)
10. Nota de datos mock sobre las pantallas: decidir si cada captura lleva una nota visible de que son datos mock. (Abierta)
11. Movimiento reducido: decidir si el 3D se sigue renderizando bajo `prefers-reduced-motion: reduce`. Supuesto actual del prototipo: sí, como fotograma completo sin bucle ni pin, porque el reemplazo de `/prototype/wall` le pareció roto al dueño. (Abierta)

## Notas finales (2026-11-07)

- El hero muestra el stack real de Samuel como una órbita 3D en CSS alrededor de su retrato: un solo anillo que va rotando por las tecnologías de `STACK_COUNTS`. Las etiquetas pasan por delante y por detrás del retrato, enlazan a `#projects` y emiten `work:pick` al hacer clic. Con reduced-motion o sin JS la disposición es estática y sigue enlazada. Se elimina la línea de texto 'Core stack'.
- Navbar: Work, Career, Contact y CV, todos dentro de la home. El nombre se oculta mientras se ve el nombre grande del hero. El botón Contact del hero baja a `#contact`.
- Las páginas `/work/kairo-runtime` y `/work/how-i-built-ari` se rediseñaron con el lenguaje de la home, sin el layout viejo: ahora son páginas `.tsx` con `getLayout` propio y componentes en `components/case/`. El nombre visible es solo 'Kairo'. La sección 'How a team runs' se mantiene por decisión del dueño.
- 'Bug Hunt' es un shooter en primera persona original (raycaster propio sobre Canvas 2D, arte procedural, sin assets ni código de otro juego), última sección de la home. No carga nada hasta pulsar Play. El dueño pidió un juego clásico existente; se decidió construir uno original.
- Las capturas con arte o pósters de terceros (Batalla vs Thanos, Cinemapedia) se conservan por decisión del dueño: son ilustrativas.
