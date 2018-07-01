'use strict';

// Character is an abstract class.
// it constains all the parameters (object's variables) and the methods (object's functions)
// that are common for all the characters in our game (player and enemy)
// this way, we'll only write them once.
class Character {
    // to construct a character, I want to know:
    // the category (cat) if cat is 'player' or 'enemy'
    // the personnal name of the character. Used for narration.
    // the lifePoints of this character
    // The immunity is a string. It gives the character immunity against a weapon.
    // a weapon is an object. 
    constructor(cat, name, lifePoints, immunity, weapon) {
        // dynamically create an element for the character.
        this.elm = document.createElement('h6');
        // adds the category classList to this character.
        // In css, 'player' class is on the left, and 'enemy' on the right
        this.elm.classList += cat;
        this.elm.id = cat;
        // passing along the name
        this.name = name;
        // passing along the lifePoints
        this.lifePoints = lifePoints;
        // passing along the immunity.
        // Optional argument. if immunity is not specified, it's undefined.
        this.immunity = immunity || undefined;
        // passing along the weapon.
        // optionnal argument. If weapon is not specified, the character is created with a knife.
        this.weapon = weapon || new Knife();
        // Display the name in the character's element.
        this.elm.innerHTML = name;
        // add the character's element to the arena
        document.getElementById('arena').appendChild(this.elm);
        // creates an event listener for when the player clicks on the character in the page.
        // the event listener will fire an event. The context of the function called by the event
        // will be the event. We don't want that. We want that the context of the function displayStats()
        // is this character.
        // we can bind 'this' context to the function with 'bind'
        // this.elm.addEventListener('click', this.displayStats.bind(this));
        // or we can use an array function, that passes along the context.
        this.elm.addEventListener('click', evt => this.displayStats(evt));
    }

    // Methods:

    // an attack is directed toward another character.
    // we pass along the taget character.
    attack(Target) {
        // the attack of this character calls the getHit function of the target character.
        // an attack is done with a weapon (There are more or less powerful weapons, doing more or less damages).
        Target.getHit(this.weapon);
        // then we change turn.
        changeTurn();
    }

    // getHit is a 'setter'. A setter is a method that changes the parameters of an object, from the inside.
    // here, the getHit changes the lifePoints.
    getHit(weapon) {
        // checks if this character is immune to the weapon.
        if (this.immunity === weapon.name) {
            // if immune, just tell it to the player.
            console.log(`${this.name} is immune to ${weapon.name}`);
        } else {
            // the weapon hits.
            // the life of this character is reduced by the attacker's weapon,
            // depending on the weapon's power.
            this.lifePoints -= weapon.attackPoints;
            // check if lifePoints are below zero. if below, lifePoints = 0
            if (this.lifePoints <= 0) this.lifePoints = 0;
            // feedback
            console.log(`${this.name} is hit and looses ${weapon.attackPoints}`);
        }
    }

    // displayStats is a 'getter'. A getter is a method that gets some or all of the parameters of an object,
    // and outputs them, from the inside.
    displayStats() {
        let stats = `${this.name}<br>Life: ${this.lifePoints}<br>Weapon: ${this.weapon.name}`;
        console.log(stats);
    }

    // well. when it's time...
    die() {
        console.log(`${this.name} dies.`);
    }
};

// The abstract class Character is now specialized into a player and a goblin.

// Keyword 'extends' is used to invoke the Character class, and allows us to add things to it. 
class Player extends Character {
    // to create a Player, we will just need a name.
    constructor(name) {
        // We call the Character's constructor function.
        // As category, we type 'player',
        // As name, we pass along the name of the player,
        // as LifePoints, we choose to set it to 20
        // Immunity will be undefined (default),
        // Weapon will be a knife (default)
        super('player', name, 20);
    }

    // we add the method pickObject() to the player.
    // This way, the player can pick up new weapons that are around.
    // the pickObject method need to be givent what weapon the player picks.
    pickObject(object) {
        // the player's weapon is now the one he picked.
        this.weapon = object;
        // and a feedback.
        console.log(`${this.name} picks up ${object.name}`);
    }
}

// Keyword 'extends' is used to invoke the Character class, and allows us to add things to it.
class Goblin extends Character {
    // to create a Goblin, we will just need a name.
    constructor(name) {
        // We call the Character's constructor function.
        // As category, we type 'enemy',
        // As name, we pass along the name of this particular goblin,
        // as LifePoints, we choose to set it to 15. They're just goblins
        // We set immunity to 'knife'.
        // This way, the player, with default weapon 'knife', will have to figure out another way to kill the goblin.
        // Weapon will be a knife (default)
        super('enemy', name, 15, 'knife');
        // we add another parameter. the category of the goblin
        this.categorie = 'goblin soldier';
    }

    // the goblin will need a function that lets him acts (An A.I.)
    // the actions are: attack the player, or grawl.
    // if the goblin attacks, we need to pass along the target (player)
    selectAction(target) {
        let randJesus = Math.floor((Math.random() * 2));
        console.log(randJesus);
        if (randJesus > 0) {
            this.attack(target);
        } else {
            this.grawl();
        }
    }

    // Grawl and looses turn. Gives the player a chance to understand what happens around.
    grawl() {
        console.log('The Goblin utters a Grawl that freezes you blood.');
        changeTurn();
    }
}

// Weapon is not an abstract class. We'll use it directly to create a sword, for exemple.
class Weapon {
    // a weapon has a name, to check for immunity
    // and a power; attackPoints.
    // we can create different weapons (like name: axe, attack: 150)
    constructor(name, attackPoints) {
        this.name = name;
        this.attackPoints = attackPoints;
    }
}

// the knife is a specialized kind of weapon, that we'll use for default.
class Knife extends Weapon {
    constructor() {
        // We call the constructor of Weapon, and pass it all the arguments needed.
        // thus, we just need to call: new Knife(), and that's all.
        super('knife', 2);
    }
}

// create all the variables needed for the game.
//
// ask for player's name
let playerName = prompt('Name your doomed character!');
// set turn to 0
let turn = 0;
// instanciate (create) the player, with the name we just asked,
let player = new Player(playerName);
// and a goblin names 'Noghul'
let goblin = new Goblin('Noghul');
// Then we create a sword. the sword is now in the room,
// in the same space with the player and the goblin.
// let's see if the player figures out how to pick it up.
let sword = new Weapon('sword', 10);

// the game loop.
//
function gameLoop() {
    // check if player and goblin are alive.
    if (player.lifePoints > 0 && goblin.lifePoints > 0) {
        // if alive, check the turn.
        // it turn === 1, it's goblin's turn.
        if (turn === 1) {
            // we call the selectAction() of the globlin
            // and change turn
            goblin.selectAction(player);
            turn = 0;
        }
        // then we set a timer, that will re-call the game loop in 3000 milliseconds.
        setTimeout(gameLoop, 3000);
    } else {
        // if either player or goblin's lifePoints is less than or equal to zero,
        // then this character dies.
        if (player.lifePoints <= 0) player.die();
        if (goblin.lifePoints <= 0) goblin.die();
    }
}

// fire!!! (call the game loop)
gameLoop();

// the changeTurn function is a helper function that we use all around.
// checks the turn, and then change it.
function changeTurn() {
    if (turn == 0) turn = 1;
    else turn = 0
}