# CEO Gamer Store - Proyecto TUP

Este es el proyecto de una tienda de e-commerce simple, desarrollada como parte del TUP. Incluye funcionalidades como un carrito de compras, modo oscuro y un sistema de login simulado.

## Características

- Visualización de productos por categorías.
- Carrito de compras persistente con `localStorage`.
- Sistema de login de usuarios contra un servidor local simulado.
- Modo oscuro.

## Prerrequisitos

Para poder ejecutar el servidor de login, necesitarás tener Node.js instalado en tu sistema.

## Instalación y Ejecución

1.  **Clona o descarga el repositorio.**

2.  **Instala JSON Server:** Abre una terminal y ejecuta el siguiente comando para instalar la dependencia que simula el servidor de la API.
    ```bash
    npm install -g json-server
    ```

3.  **Inicia el servidor:** Navega hasta la carpeta raíz del proyecto en tu terminal y ejecuta el siguiente comando.
    ```bash
    json-server --watch db.json
    ```
    Esto iniciará un servidor local en `http://localhost:3000`. Mantén esta terminal abierta mientras usas la aplicación.

4.  **Abre la página:** Abre el archivo `index.html` o `pages/login.html` en tu navegador para empezar a usar el sitio.