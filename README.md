# Blood Vessel Rework

**R3F rework of @junkiyoshi Blood Vessel of Torus**

![Screenshot 2025-01-18 at 6 26 51 AM](https://github.com/user-attachments/assets/8fde38db-b1d0-45dd-ace2-072713c730bc)

Reworked from C++ (openFrameworks)
All credit to Junki Yoshi 🙏🏾
[Junkiyoshi’s Original Work](https://junkiyoshi.com/openframeworks20230911/)

**This project is a rework of Junkiyoshi's work on dynamic actor trails.** Their original implementation in C++ (openFrameworks). This adaptation leverages React Three Fiber and Three.js to bring the concept to the web.

## Walkthrough: Building the Project 🚀

### Laying the Groundwork

#### Generating Coordinate Path

A coordinate path was generated using trigonometric functions. This gave actors a cyclical structure to move along, mimicking the logic of Junkiyoshi's geometry.

Each actor’s movement was determined by edges between points, which were dynamically calculated to avoid hardcoding connections.

#### Introducing Dynamic Trails

Implemented a trail log to store an actor’s previous positions. This data was used to generate a visual history, creating the illusion of a continuous line.

**Performance optimization came into play here: instead of managing the trail with `useState`, we used `useRef`. This allowed us to avoid re-renders while maintaining direct control over the geometry.**

#### Adapting Actor Paths to the Surface

Initially, actors moved along discrete points, making their movement appear disconnected from the torus shape. To solve this:

#### Managing Edges and Transitions

Ensuring smooth transitions between edges required trial and error.

#### Adding Gradients to the Trails

Adding the trail:

Each trail segment was given a color gradient that transitioned from a solid starting color to fully transparent at the end.
Transparency was achieved by dynamically updating vertex colors and feeding them into a `lineBasicMaterial`.

#### Fine-Tuning and Optimization

In the later stages, we focused on iteration and improvement:

We adjusted the actor speed, trail length, and the frequency of their transitions to create a balanced, smooth visual experience.

### Technical Details ⚙️

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

## Future Directions 🔮

#### Interactivity

Allow users to influence actor paths or trail properties through mouse or touch input

#### New Geometries

Experiment with different shapes and structures for actor paths, such as helices or Möbius strips
