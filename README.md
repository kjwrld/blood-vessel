# Blood Vessel Rework

**R3F rework of @junkiyoshi Blood Vessel of Torus**

![My Rework](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTU2ZXl5cnpoZXF5aGJ6YWF5b28zYmxwazBjMnRiYTVmZ3cxdnYzaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/nvdtSVmWDhXg5GuNyh/giphy.gif)


Reworked from C++ (openFrameworks)
All credit to Junki Yoshi 🙏🏾
[Junkiyoshi’s Original Work](https://junkiyoshi.com/openframeworks20230911/)

**This project is a rework of Junkiyoshi's work on dynamic actor trails.** Their original implementation in C++ (openFrameworks). This adaptation leverages React Three Fiber and Three.js to bring the concept to the web.

## Technical Details ⚙️

#### Core Features

Dynamic Trails: Trails follow each actor, using a log of previous positions. The trail’s length and color are dynamically updated every frame.

Gradient Transparency: Trails transition from a defined starting color to full transparency, using a custom RGBA attribute.

Torus-Based Path: Actors move across a calculated toroidal geometry, ensuring cyclical, smooth motion.

#### Technologies Used

**React Three Fiber**
**Three.js**

## Running the Project

```bash
git clone <your-repo-link>
cd <your-repo-folder>
npm install
npm start
```

Open your browser and navigate to http://localhost:3000

## Walkthrough 🚀

### Laying the Groundwork

#### Generating Coordinate Path

A coordinate path was generated using trigonometric functions. This gave actors a cyclical structure to move along, mimicking the logic of Junkiyoshi's geometry.

Each actor’s movement was determined by edges between points, which were dynamically calculated to avoid hardcoding connections.

![Generating Coordinate Path](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjBkaThsb2VhMXU2bmxnd3B5NWpyODFqMHlsZHA4ejliZW0zZnUwOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/OZKSd81e8vasX8QFzF/giphy.gif)

#### Introducing Dynamic Trails

Implemented a trail log to store an actor’s previous positions. This data was used to generate a visual history, creating the illusion of a continuous line.

**Performance optimization came into play here: instead of managing the trail with `useState`, we used `useRef`. This allowed us to avoid re-renders while maintaining direct control over the geometry.**

![Introducing Dynamic Trails](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTR0N2Z5bHdha3Y4NnR2Zzd0OHhiYWY5bmF0M2x0aXRhZzI4d2dhOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ARzZKsDV068RRSrSA9/giphy.gif)

### Introducing Complexity

#### Adapting Actor Paths to the Surface

![disconnected](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2N2anRuZGFnczBxZHFkMDYxNGhoYmsweGhpbTUzNWVmeGQzbnF1MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VQ8xjjc9r3eceskICZ/giphy.gif)

Initially, actors moved along discrete points, making their movement appear disconnected from the torus shape. To solve this:

#### Managing Edges and Transitions Along Generated Faces

Ensuring smooth transitions between edges required trial and error.

![Vertical Edge Movement](https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2F2N2pqOXllMGNsbGw1dmtham1oYW4wZHlyNjM3ZWYweHA0NmIwMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/a1wgk7VAL3in14XQmd/giphy.gif)

### Final Touches 

#### Adding Gradients to the Trails

Adding the trail:

Each trail segment was given a color gradient that transitioned from a solid starting color to fully transparent at the end.
Transparency was achieved by dynamically updating vertex colors and feeding them into a `lineBasicMaterial`.

#### Fine-Tuning and Optimization

In the later stages, we focused on iteration and improvement:

We adjusted the actor speed, trail length, and the frequency of their transitions to create a balanced, smooth visual experience.

![Lines Move Along Generated Faces](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExenAzdzQ1Z3F2MzEwYnMzd3JlbjVuOG9ha3hzbHdta3U3eHk5ZW9iNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wxjwFEs0vRWnbbwhWS/giphy.gif)

## Future Directions 🔮

#### Interactivity

Allow users to influence actor paths or trail properties through mouse or touch input

#### New Geometries

Experiment with different shapes and structures for actor paths, such as helices or Möbius strips
