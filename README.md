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

### Day 1

#### What did I do?

Assembled project boilerplate of bouncing ball with audio. Explored Tone.js, using Tone.Sampler instead of the three.js audio player. Adjusted Sampler volume based on the collision impact velocity.

#### Any Trouble?

The Tone.js Sampler was hard to understand since the documentation didn't match up with the version I am using. I will refer to the type definitions in the package I downloaded when I'm stuck in the future.

#### What did I learn?

I learned some details around implementing physics with cannon.js. I also learned how to generate sounds with Tone.js.

### Day 2

#### What did I do?

#### Any Trouble?

#### What did I learn?

## Attributions
