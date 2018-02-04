# Snake

The aim of the game is to eat as much food as possible before dying.
There are many things that can be done to implement this game, but with limited amount of time,
I'll choose to focus on the following.

## Tech Choices

Limited in what tech I can use, the idea here is to use something with minimal setup
which is still suited for frontend development. Thus, I'll choose Webpack 4 beta to start.

Another thing which I will use is Canvas. Since I've only had limited exposure to Canvas,
I felt this would be a great opportunity to get my hands on it.

## Design Choices

From a design perspective, it is possible that I will want to be able to swap out Canvas with other technology choices such as DOM or SVG or WebGL or any number of technologies. For that purpose I'll be sure to implement some form of abstraction over Canvas so a suitable technology can be swapped out.

## Spec

1) The Snake starts as a small like and a random position for a block of food is chosen
2) The user directs the snake's direction with up/down keys
3) Whenever a food is eaten, the size of the snake increases by 1 block, and a new position for food is randomly generated
4) The position of food must not be in a position where the snake currently takes up space
5) Whenever snake colides with itself or the wall, the game ends

## Configuration Options

1) Blocks can be specified as a certain number of Pixels
2) Size of the Canvas in terms of Blocks can be specified
3) Velocity of the Snake should be specified