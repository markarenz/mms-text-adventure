# Reversed Engineered Adventure

- Description: ReactJS interpreter for text adventure games inspired by the work of Scott and Alexis Adams many decades ago.

## Background

- I have always admired games like Pirate Adventure from 1978 for its ability to pack so much personality and gameplay onto a system that could only handle 16 kilobytes.
- The developer created one of the first game engines, allowing the coder and writer to quickly create several games on the same engine.
- The original engine featured clever features like synonym catchers and bitflags along with event triggers to handle ambient effects.The more I dug into this, the more I loved what they built.
- Since several modern interpreters for the original Scott and Alexis Adams games already exist, I took their work and extended it a bit with a few creature comforts like local game saves and dev tools that significantly cut the time needed for development.
- The data format for this engine uses JSON rather than the flat text files of the original, but the obfuscation remains in effect. Looking at the .json files you can get a sense of the items and rooms that exist, but it's no good for telling you where to go and what to do in order to complete the game.

## Running this project

- You can play the games packaged in this repo by running the app locally on your machine or by visiting the project online (when finished) at adventure.ridiculopathy.com.
- Locally, simply run npm i to install all the necessary packages

```
npm i
```

- Then to run the game, use npm run dev. You can toggle the dev mode default by updating the relevant value in the constants.js file.

```
npm run dev
```

## Further Development

- I plan to create 3 games for the initial release and hope to extend the engine and make more at a later time.
- The dev tools are included in case someone feels the urge to make their own.
