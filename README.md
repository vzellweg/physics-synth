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

Added inputs for gravity, sample playback note, and contact material friction/bounciness. Post-processing "pixelSize" input that also applies BitCrusher to audio.

I also added reverb with a decay value that decreases with the impact velocity.

#### Any Trouble?

Yeah I realized the visual delay effect I wanted would require me to write a shader, which is a little beyond the scope of this project. Also, I could not get the feedback example from the three.js documentation to work as I wanted it to.

I looked into making breakable objects, but the work involved with that is pretty lengthy so I did not end up pursuing it. It would have been cool to be able to slice the balls by clicking them.

#### What did I learn?

How to manipulate frequencies in Tone.js, it's pretty straightforward and makes me want to try out a musical microtuning project sometime.

## Attributions
