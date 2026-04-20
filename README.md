# Polymarket Whale Tracker

Un dashboard analítico en tiempo real construido con Next.js para rastrear y agregar grandes transacciones ("Ballenas") en el mercado de predicciones Polymarket.

---

## Objetivo del Proyecto

El objetivo principal de este proyecto es **educativo y de demostración técnica**, centrado específicamente en el **consumo avanzado de APIs de terceros**. A lo largo del desarrollo, se han abordado y resuelto retos reales de ingeniería de datos, tales como:

* **Integración de APIs Múltiples:** Consumo simultáneo de la Gamma API (mercados) y la Data API (transacciones) de Polymarket.
* **Agregación de Datos y Algoritmia:** Creación de un motor en el servidor que descarga miles de transacciones crudas de múltiples mercados, las cruza y las consolida por dirección de cartera (wallet) en tiempo real para filtrar el "ruido".
* **Manejo de CORS y Rate Limiting:** Implementación de *Server Actions* en Next.js para actuar como proxy, inyectando cabeceras (`User-Agent`) y procesando datos secuencialmente para evitar bloqueos de Cloudflare.
* **Gestión de Estado y Refresco:** Implementación de *polling* dinámico y manejo de caché avanzado (`cache: "no-store"`) para asegurar que el dashboard siempre muestra información viva y real.

## Tecnologías Utilizadas

* **Frontend:** React, Next.js (App Router), Tailwind CSS.
* **Backend:** Next.js Server Actions, Node.js.
* **Base de Datos:** SQLite local con **Prisma ORM** (para guardar carteras favoritas).
* **Visualización de Datos:** Recharts (D3.js).
* **Fuentes de Datos:** Polymarket REST APIs.

---

## Cómo Empezar (Instalación y Ejecución)

Si has hecho un *pull* o *clone* de este repositorio, sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### 1. Prerrequisitos
Asegúrate de tener instalado en tu sistema:
* [Node.js](https://nodejs.org/) (v18 o superior recomendado)
* Git

### 2. Clonar el repositorio
```bash
git clone [https://github.com/SteveSel/Polymarket-Tracker.git](https://github.com/SteveSel/Polymarket-Tracker.git)
cd Polymarket-Tracker
```

### 3. Instalar dependencias
Instala todos los paquetes necesarios de Node:
```bash
npm install
```

### 4. Configurar la Base de Datos (Prisma)
El proyecto utiliza una base de datos SQLite local que no se sube a GitHub (por el `.gitignore`). Necesitas generar el cliente de Prisma y crear el archivo de tu base de datos local:

```bash
# Sincroniza el esquema de Prisma con tu base de datos local vacía
npx prisma db push

# (Opcional) Genera el cliente de Prisma explícitamente
npx prisma generate
```

### 5. Iniciar el Servidor de Desarrollo
Una vez la base de datos esté lista, levanta el servidor:
```bash
npm run dev
```

### 6. ¡Abre la aplicación!
Navega en tu navegador a [http://localhost:3000](http://localhost:3000) para ver la aplicación funcionando en tiempo real.

---