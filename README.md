# 🎮 Pokémon Trainer App

## Descripción
Aplicación web para la gestión de perfiles de entrenadores Pokémon, desarrollada con **Angular 20** y **Angular Material 20**.

## 🛠️ Tecnologías Utilizadas

### Framework Principal
- **Angular** 20.3.3
- **Angular CLI** 20.3.4
- **TypeScript** 5.9.3

### Paquetes Adicionales
- **Angular CDK** 20.2.7 — *Virtual Scroll* (requerido por la prueba)
- **Angular Material** 20.2.7 — Componentes UI
- **RxJS** 7.8.2 — Programación reactiva

### APIs Externas
- **PokeAPI** — Datos de Pokémon de primera generación

## 📦 Requisitos Previos
- **Node.js** v20.19.2 o superior
- **npm** v11.5.2 o superior

Verifica tus versiones:

- node -v 
- npm -v

## 🚀 Instrucciones para Hacer Funcionar el Proyecto

1) **Instalar Angular CLI (v20)**  
   Ejecuta: `npm install -g @angular/cli@20`

2) **Clonar el Repositorio**  
   `git clone https://github.com/l1teeee/prueba_tec_pokemon.git`  
   `cd prueba_tec_pokemon`

3) **Instalar Dependencias**  
   `npm install`

4) **Ejecutar en Desarrollo**  
   `ng serve`

La aplicación quedará disponible en: **http://localhost:4200/**

## 📝 Comentarios Adicionales

### Angular CDK Scrolling (Virtual Scroll)
- **Módulo usado:** `@angular/cdk/scrolling`
- **Implementación:** *Virtual Scroll* para optimizar el renderizado de la lista de Pokémon (mejora de rendimiento con grandes listados).
