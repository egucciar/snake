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


For this I looked into some options to create this type of pattern with ES6, and settled on the **AbstractFactory pattern.** This pattern will allow me to provide a base implementation expected from the View, so that all Views will have to follow the same patterns and expectations.

*** ES6 Classes or "Module" Function Pattern?
I was unable to come to a conlusion whether ES6 Classes or a leaner Module pattern would be better.
I attempted both patterns in order to test I used both initially, and then moved forward with the Module pattern.
My reasoning behind this is that I still am not completely certain that the ES6 Syntactical Sugar "Classes" 
solve all the problems with ES6 Classes. Though it was nice to get a good start into understanding them,
you can accomplish the same thing and then some with regular modules. In the future, I'd like to continue to
build out the ES6 Class Imp of Snake so that I can compare the two Implementations one to one and see which one I prefer.
But in short, "this" does not work as nicely with ESLint, and forces you to make all variables public, which I don't love.
If you want the "best of both" then you're looking at less consistent code style within the same file (i.e. mixing This and regular variables). 

## Other choices

1) Use a reset.css to normalize browser styles
2) set height 100% on the html/body and box-sizing: border-box for more reasonable style behaviour
3) Use Eslint to ensure consistent code style

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

## References

In the process of making the application, I referred to the following resources

1) Design Patterns: http://loredanacirstea.github.io/es6-design-patterns/
