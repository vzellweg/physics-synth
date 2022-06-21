# threejs-hackathon

## Project Setup

```bash
# Install dependencies (only the first time)
yarn

# Run the local server at localhost:8080
yarn dev

# Build for production in the dist/ directory and deploy to github pages
yarn deploy
```

## Goal

Create an interactive 3d scene, where the user can interact with 3d shapes to trigger some actions. Make the scene look as cool as possible.

## Helpful Resources

### [three.js Journey lesson plan](https://threejs-journey.com/)

Scroll down to section "What will you learn?" Have an understanding of the topics covered in the "Basics" chapter.

### [three.js examples](https://threejs.org/examples/)

### [Poly Haven HDRI's](https://polyhaven.com/hdris)

For use in environment maps.

### [three.js editor](https://threejs.org/editor/)

Helpful for debugging when loading models.

## Journal

### Days 1 -2

#### What did I do?

I completed the "Basics" chapter of the three.js journey course, coding along with the course instructions. Tomorrow I will start to create my three.js hackathon project.

#### Any Trouble?

Not much trouble. Some of the concepts take a little while to understand. Other than that, the course has some review information but I can skip through it easily.

#### What did I learn?

I learned about scenes, animations, cameras, geometries, textures, and materials in three.js.

### Day 3

#### What did I do?

I took two more three.js journey lessons: Lights, and Shadows. I began work on my hackathon project and deployed my code to github pages. I also spent some time looking at color palettes, greensock tutorials, and the tone.js API. I learned what greensock timelines are, and I learned

#### Any Trouble?

Nope, so far anything too complex for me has not been critical to the project goals.

#### What did I learn?

I learned about lights and shadows in three.js. I learned how easy it is to deploy a static website using `gh-pages`. I learned a little

### Day 4

#### What did I do?

Started messing around with reflections, cubemaps, and animated lights.

#### Any Trouble?

Yes, keeping my scope limited and not getting distracted by cool new features. I think I'm managing well by using github issues religiously though.

#### What did I learn?

I started learning about using ray tracing to create interactive objects. I learned the process of creating cubemaps from hdri images. I started the Shaders chapter of the three.js journey course. I'm hoping to learn enough to be able to use shaders that I find online as materials in three.js.

### Day 5

#### What did I do?

Added interactivity to the objects. Created a utility script for compressing cubemap png's to jpg's. Downloaded models to import into scene later.

#### Any Trouble?

Yeah I'm not very familiar with bash scripts (I've always used Python or C for projects that required filesystem operations). I had to learn a bit about them in order to write my file conversion script.

#### What did I learn?

That greensock is insanely simple to use and we should be using it on all our projects. I learned that the built-in Mac utility `sips` can be used in bash scripts to do batch file conversions. I learned some basic things about bash scripts.

### Day 6

#### What did I do?

Added a cat model to my scene. Created a shape that deforms its vertices over time. Added attributions and resources in the Readme. Adjusted rate usage so inputs in debug panel do not cause jarring jumps in modulation.

#### Any Trouble?

Yeah there was a [change in Three.js a year ago that got rid of the BufferGeometry types](https://discourse.threejs.org/t/three-geometry-will-be-removed-from-core-with-r125/22401). So some of the older examples I found on stackoverflow did not work without modification. Once I figured it out I had a better understanding of three.js though.

#### What did I learn?

How to manipulate a geometry over time by editing it's vertices. How to load 3d models found on sketchfab. How to implement gsap staggering on three.js objects.

### Day 7

#### What did I do?

Converted an old HDRI image from my library into a cubemap. Tweaked arrangement of objects. Looked into using shaders as materials.

#### Any Trouble?

I did not have enough time to successfully convert a shadertoy shader to use as a material.

#### What did I learn?

A bunch of stuff about shaders. I began the three.js Journey "shaders" lesson and started reading the [shadertoy page in the three.js docs](https://threejs.org/manual/?q=shadertoy#en/shadertoy)

### Day 8

#### What did I do?

Got a cool shader to work as a material for the plane

#### Any Trouble?

Yeah shaders are confusing! I still don't have a comprehensive understanding of them

#### What did I learn?

More stuff about shaders. I figured out how to refactor shadertoy shaders for use in three.js. I'm getting a better grasp of uniforms and varyings, and how they are passed between three, the vertex shader, and the fragment shader.

## Attributions

### Models:

-   [Federico.Villani: Cat - Static Pose](https://sketchfab.com/3d-models/cat-static-pose-27b4c1e4338d44278f46d409cd8c9b76)
-   [daniellaromanoo - Statue Cat](https://sketchfab.com/3d-models/statue-cat-86b5a7b0a4a348129ebe47f65e80a526)
