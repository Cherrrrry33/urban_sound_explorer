# Urban Sound Explorer

## Project Overview

This project explores how urban sound environments can be visualised and experienced through interactive design. It focuses on how different locations within a city can feel distinct in terms of noise, atmosphere, and activity.

Rather than presenting sound data as static information, this project aims to create an interactive experience where users can explore and compare different urban environments.

---

## Concept

Cities are experienced not only visually, but also through sound. However, sound is often overlooked or taken for granted.

This project attempts to:
- Make urban sound visible
- Allow users to explore different sound environments
- Highlight differences between noisy and quiet areas

The project combines:
- Personal sound recordings (primary data)
- Simplified noise level values (interpreted data)

---

## Interaction Design

The project is designed as an exploratory interface rather than a purely informational tool.

Key interactions include:

- **Hover / proximity interaction**  
  Data points become clearer as the user moves the cursor closer, encouraging exploration.

- **Click interaction**  
  Users can click on points to reveal detailed information and associated sound.

- **View switching (City ↔ Abstract)**  
  Users can switch between:
  - A map-based view (spatial context)
  - An abstract visualisation (data-focused view)

This approach allows users to experience both:
- The physical location
- The data representation

---

## Data Strategy

Due to the complexity of official environmental datasets, this project adopts a simplified data model.

- Primary data:  
  Sound recordings collected from different urban locations

- Secondary data:  
  Noise level values (in dB) based on observed patterns and research

Official datasets (e.g. UK Environmental Noise Directive) were explored but not directly used due to their complexity and lack of suitability for interactive web visualisation.

---

## Technical Implementation

The project is implemented as a web-based interactive visualisation using:

- HTML / CSS
- JavaScript
- p5.js (for dynamic rendering and interaction)

The system uses layered design:
- Background: simplified city map
- Canvas: dynamic data points
- UI: interaction and information display

---

## Current Progress

- Basic interaction system implemented
- Map + point visualisation working
- View switching between city and abstract modes
- Data structure defined

---

## Next Steps

- Integrate real sound recordings
- Refine visual design and aesthetics
- Improve mapping between data points and locations
- Add insights to support interpretation
- (Optional) explore live microphone input

---

## Reflection (Initial)

This project focuses on transforming data into an experience rather than simply presenting information. It explores how interaction can encourage users to engage more deeply with urban environments and reflect on how sound shapes their perception of the city.


# Urban Sound Explorer

## Project Overview
Urban Sound Explorer is an interactive soundscape map of London that visualises urban noise patterns and allows users to explore selected locations through audio recordings.

## Features
- Interactive map
- City View and Abstract View
- Audio playback
- Audio-reactive visualisation
- Insight panel

## Data Sources
- UK Government Environmental Noise Dataset
- Self-collected field recordings

## Technologies
- HTML
- CSS
- JavaScript
- p5.js
- p5.sound

## How to Run
1. Clone repository
2. Open with Live Server
3. Explore the map

## Author
Cherry Liu