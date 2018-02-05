# Snake

The aim of the game is to eat as much food as possible before dying.
There are many things that can be done to implement this game, but with limited amount of time,
I'll choose to focus on the following.

The incomplete game can be found here:
https://egucciar.github.io/snake/

## Usage

open index.html to see application.

to install deps and run, `npm install` and `npm run dev` for development / filewatcher mode, `npm run prod` for prod mode

## Tech Choices

Limited in what tech I can use, the idea here is to use something with minimal setup
which is still suited for frontend development. Thus, I'll choose Webpack 4 beta to start.

Another thing which I will use is Canvas. Since I've only had limited exposure to Canvas,
I felt this would be a great opportunity to get my hands on it.

## Architecture Design Choices

From a design perspective, it is possible that I will want to be able to swap out Canvas with other technology choices such as DOM or SVG or WebGL or any number of technologies. For that purpose I'll be sure to implement some form of abstraction over Canvas so a suitable technology can be swapped out.


For this I looked into some options to create this type of pattern with ES6, and settled on the **AbstractFactory pattern.** This pattern will allow me to provide a base implementation expected from the View, so that all Views will have to follow the same patterns and expectations.

*** ES6 Classes or "Module" Function Pattern?
I was unable to come to a conlusion whether ES6 Classes or a leaner Module pattern would be better.
I attempted both patterns in order to test I used both initially, and then moved forward with the Module pattern.
My reasoning behind this is that I still am not completely certain that the ES6 Syntactical Sugar "Classes" 
solve all the problems with ES6 Classes. Though it was nice to get a good start into understanding them,
you can accomplish the same thing and then some with regular modules. In the future, I'd like to continue to
build out the ES6 Class Imp of Snake so that I can compare the two Implementations one to one and see which one I prefer.
But in short, "this" does not work as nicely with ESLint (e.g. checking that your variables are named as expected), and forces you to make all variables public, which I don't love.
If you want the "best of both" then you're looking at less consistent code style within the same file (i.e. mixing This and regular variables). Maybe classes will be nicer with TypeScript

## Other choices

1) Use a reset.css to normalize browser styles
2) set height 100% on the html/body and box-sizing: border-box for more reasonable style behaviour
3) Use Eslint to ensure consistent code style

## Spec

1) The Snake starts as a small line and a random position for a block of food is chosen
2) The user directs the snake's direction with up/down/left/right keys
3) Whenever a food is eaten, the size of the snake increases by 1 block, and a new position for food is randomly generated
4) The position of food must not be in a position where the snake currently takes up space
5) Whenever snake colides with itself or the wall, the game ends

## Configuration Options

1) Blocks can be specified as a certain number of Pixels
2) Size of the Canvas in terms of Blocks can be specified
3) Velocity of the Snake should be specified

## References

In the process of making the application, I referred to the following resources

1) Design Patterns: http://loredanacirstea.github.io/es6-design-patterns/

# TODO - Incomplete Application

Since I was unable to complete the application in < 3 hours, I have a lot of ground left to cover.
I still had a lot to do, but I'm at least happy I was able to implement an abstraction of Canvas from Snake.

Here's what was left to do:

## Spec Implementation - Missing Features

1) Never got up to the point where the block of food was generated
2) Thus, never got up to the point where snake was eating the food and growing
3) Never got up to the point of detecting colision with itself

## What Was Implemented - Improvments

### Solidifying the basic mechanism of function

The very last thing I was able to do prior to submitting was fixing a few bugs. thus, you will see some comments where I was debugging things and finally some todo statements where I felt things could be consolidated, but kept them seperate so I can debug them. I would like to consolidate the removeOne and resize functions a bit, as they have duplicated logic therefore making it more error prone.

### Block of food generation & Detecting Self Cross-over

The biggest problem I didn't get to solve was determnining if at any point, I am drawing something across something else.

For this, a "virtual canvas" would be a good idea to keep track of where shapes are. I think for this a matrix (array of arrays) where each element = box size & is updated whenever snake is moved would be ideal. I.e. Snake.js will keep track of where Snake is at all times. This will be easy to add to the "move", "grow" and "shrink" logical portions of Snake.js. I think this would be more efficient than other means of checking, since each update is CONSTANT, and each read would be CONSTANT. Space complexity, unfortunately would be high but using more space I think is better than doing too many loops over snake's body to check if snake contains the new position.

When we're ready to calculate the position of the food, we can map our current matrix to find all the "unused" values then pick a random one out of this. the reason I'd do it this way is to avoid issues with randomly generating the food. Possibly I'd implement both - random generate & look up in matrix & repeat until position is free, or map matrix to unused spots & random pick from unused. Let's say if Snake size > n^2 / 2, it might be good to do one or the other for optimization purposes. Since I'm not sure which would be better, I'd probably implement both, since both would be rather trivial once I've got the main loop / snake function down. And I could do some testing with which one I thought was better.

The "overlap detection" matrix logic can also be used to check if I've touched the food! So, that reusable logic will be available to me and ready to either end the game if I've colided with myself or grow if I've colided with food. 

## More Specs I can Implement

1) Start Game Overlay
2) Game Ended Overlay w. stats
3) More integration with the config.json (i.e. speed)
