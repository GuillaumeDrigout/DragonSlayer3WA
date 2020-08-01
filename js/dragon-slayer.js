'use strict';   // Mode strict du JavaScript

/*************************************************************************************************/
/* **************************************** DONNEES JEU **************************************** */
/*************************************************************************************************/
// L'unique variable globale est un objet contenant l'état du jeu.
var game;

// Déclaration des constantes du jeu, rend le code plus compréhensible
const PLAYER = 'player';
const DRAGON = 'dragon';


const LEVEL_EASY   = 1;
const LEVEL_NORMAL = 2;
const LEVEL_HARD   = 3;

const PLAYER_KNIGHT = 1;
const PLAYER_ROGUE = 2;
const PLAYER_WIZARD = 3;


/*************************************************************************************************/
/* *************************************** FONCTIONS JEU *************************************** */
/*************************************************************************************************/

/**
 * Simule un lancé de dés
 * @param {number} dices - Nombre de dés que l'on souhaite lancer
 * @param {number} sides - Nombre de faces par dé
 * @returns {number} - Le total de la somme des dés
 */
function throwDices(dices, sides)
{
    // Déclaration des variables locales à la fonction throwDices()
    var index;
    var sum;

    // Initialisation de la somme des dés à 0
    sum = 0;
    
    // Pour chaque dé...
    for(index =0 ; index < dices ; index++) 
    {

        sum += getRandomInteger(1, sides);
        
    }
    
    // Retour en résultat de la somme totale des dés
    return sum;
}

/**
 * Initialise les paramètres du jeu
 */
function initializeGame()
{
 // Initialisation de la variable globale du jeu.
 game       = new Object();
 
 game.round = 1;
 
  // Choix du niveau du jeu
  
  game.level = requestInteger('Choisissez le niveau de difficulté\n' + '1. Facile - 2. Normal - 3. Difficile', 1, 3);
  
  
  //bonus 2 : choix du type de player 
  
  game.typePlayer = requestInteger('Choisissez le type de joueur\n' + '1. Chevalier - 2. Voleur - 3. Mage', 1, 3);
  
  /*
     * Détermination des points de vie de départ du joueur et du dragon selon
     * le niveau de difficulté.
     */
     
    switch(game.level) {
        case LEVEL_EASY:
            game.hpDragon = 100 + throwDices(5, 10);
            game.hpPlayer = 100 + throwDices(10, 10);
            break;

        case LEVEL_NORMAL:
            game.hpDragon = 100 + throwDices(10, 10);
            game.hpPlayer = 100 + throwDices(10, 10);
            break;

        case LEVEL_HARD:
            game.hpDragon = 100 + throwDices(10, 10);
            game.hpPlayer = 100 + throwDices(7, 10);
            break;
    }
    
    /* bonus1 */
    game.hpDragonLimit = Math.round(game.hpDragon * 30 /100);
    game.hpPlayerLimit = Math.round(game.hpPlayer * 30 /100);
    
    /* bonus 3 */
    game.hpDragonStart = game.hpDragon;
    game.hpPlayerStart = game.hpPlayer;
}

/**
 * Affichage de l'état du jeu, c'est-à-dire des points de vie respectifs des deux combattants
 */
function showGameState()
{
    
    var filename;
    var jauge;
    
// Affichage du code HTML
    document.write('<li class="game-state">');

    // Affichage de l'état du joueur
    document.write('<figure>');
    
    //bonus1
    filename = 'knight.png'; 
    if (game.hpPlayer < game.hpPlayerLimit) {
        filename = 'knight-wounded.png';
    }

    document.write('<img src=images/' + filename + ' alt="Chevalier">');

    // Si le joueur est toujours vivant, on affiche ses points de vie
    if (game.hpPlayer > 0) {
        document.write('<figcaption>' + game.hpPlayer + ' PV</figcaption>');
        /* bonus 3 */
        jauge = Math.ceil(game.hpPlayer * 100 / game.hpPlayerStart);
        document.write('<div class="jauge"><div style = "height:2rem; width:' + jauge + '%; background-color: green"></div></div>');
    } else { // game.hpPlayer <= 0
        // Le joueur est mort, on affiche 'GAME OVER'
        document.write('<figcaption>GAME OVER</figcaption>');
    }

    document.write('</figure>');

    // Affichage de l'état du dragon
    document.write('<figure>');
    
    //bonus1
    filename = 'dragon.png'; 
    if (game.hpDragon < game.hpDragonLimit) 
    {
        filename = 'dragon-wounded.png';
    }
    
    document.write('<img src=images/' +  filename + ' alt="Dragon">');

    // Si le dragon est toujours vivant on affiche ses points de vie
    if (game.hpDragon > 0) {
        document.write('<figcaption>' + game.hpDragon + ' PV</figcaption>');
        /* bonus 3 */
        jauge = Math.ceil(game.hpDragon * 100 / game.hpDragonStart);
        document.write('<div class="jauge"><div style = "height:2rem; width:' + jauge + '%; background-color: green"></div></div>');
    } else { // game.hpDragon <= 0
        // Le dragon est mort on affiche 'GAME OVER'
        document.write('<figcaption">GAME OVER</figcaption>');
    }

    document.write('</figure>');
    document.write('</li>');
  
  
}

/**
 * Détermine qui du joueur ou du dragon prend l'initiative et attaque
 * @returns {string} - DRAGON|PLAYER
 */
function getAttacker()
{
    // Déclarations de variables locales
    var playerInitiative;
    var dragonInitiative;
    
    // On lance 10D6 pour le joueur et pour le dragon
    playerInitiative = throwDices(10, 6);
    dragonInitiative = throwDices(10, 6);

    // On compare les scores d'initiatives et on retourne le résultat
    if( playerInitiative > dragonInitiative ){
        return PLAYER;
    }

    return DRAGON;
    
    
}

/**
 * Calcule les points de dommages causés par le dragon au chevalier
 * @returns {number} - le nombre de points de dommages 
 */ 
function computeDragonDamagePoint()
{
   // Déclarations de variables locales à la fonction computeDragonDamagePoint()
   var damagePoints;
   
   // On tire 3D6 pour le calcul des points de dommages causés par le dragon
   damagePoints = throwDices(3, 6);

    //bonus 2
    if (game.typePlayer == PLAYER_KNIGHT) {
    damagePoints -= Math.round(damagePoints * throwDices(1, 10) / 100);    
    }
    else {
   // Majoration ou minoration des points de dommage en fonction du niveau de difficulté
   switch(game.level) {
        case LEVEL_EASY:
            // Au niveau Facile, on diminue les points de dommage de 2D6 %
            damagePoints -= Math.round(damagePoints * throwDices(2, 6) / 100);
            break;

        case LEVEL_HARD:
            // Au niveau difficile, on augmente les points de dommage du dragon de 1D6 %
            damagePoints += Math.round(damagePoints * throwDices(1, 6) / 100);
            break;
    }        
    }

    
    
   
   
   
   // On retourne les points de dommage
    return damagePoints; 
}

/**
 * Calcule les points de dommages causés par le chevalier au dragon
 * @returns {number} - le nombre de points de dommages 
 */
function computePlayerDamagePoint()
{
    // Déclarations de variables locales à la fonction computePlayerDamagePoint()
    var damagePoints;

    // On tire 3D6 pour le calcul des points de dommages causés par le dragon
    damagePoints = throwDices(3, 6);

    // Majoration ou minoration des points de dommage en fonction du niveau de difficulté
    switch (game.level) {
        case LEVEL_EASY:
            // Au niveau Facile, on augmente les points de dommage de 2D6 %
            damagePoints += Math.round(damagePoints * throwDices(2, 6) / 100);
            break;

        case LEVEL_HARD:
            // Au niveau Difficile, on diminue les points de dommage de 1D6 %
            damagePoints -= Math.round(damagePoints * throwDices(1, 6) / 100);
            break;
    }
    
    //bonus 2 : majoration en fonction du type de joueur
    



    switch (game.typePlayer) {
        case PLAYER_ROGUE:
            // code
            damagePoints += Math.round(damagePoints * throwDices(1, 6) / 100);
            break;
            
        case PLAYER_WIZARD:
            // code
            damagePoints += Math.round(damagePoints * throwDices(1, 10) / 100);
            break;
    }

    // On retourne les points de dommage
    return damagePoints; 

}

/**
 * Boucle du jeu : répète l'exécution d'un tour de jeu tant que les 2 personnages sont vivants
 */
function gameLoop()
{
    // Déclarations de variables locales à la fonction gameLoop()
    var attacker;
    var damagePoints;

    // Le jeu s'exécute tant que le dragon et le joueur sont vivants.
    while(game.hpDragon > 0 && game.hpPlayer > 0) {
    // lancer d'un tour
    // Qui va attaquer lors de ce tour de jeu ?
    attacker = getAttacker();
    
    // Est-ce que le dragon est plus rapide que le joueur ?
    if(attacker == DRAGON) {
            // Oui, le joueur se prend des dégâts et perd des points de vie.
            damagePoints = computeDragonDamagePoint();
            
            // Diminution des points de vie du joueur.
            game.hpPlayer -= damagePoints; // Identique à game.hpPlayer = game.hpPlayer - damagePoint;
    }
    else {
        // Non, le dragon se prend des dégâts et perd des points de vie.
        damagePoints = computePlayerDamagePoint();
        
        // Diminution des points de vie du dragon.
        game.hpDragon -= damagePoints; // Identique à game.hpDragon = game.hpDragon - damagePoint;
        

    }
    
        // Affichage du journal : que s'est-il passé ?
        showGameLog(attacker, damagePoints);

        // Affichage de l'état du jeu
        showGameState();

        // On passe au tour suivant.
        game.round++;

    }
}

/**
 * Affichage du vainqueur
 */
function showGameWinner()
{
/*
<!-- Etat du jeu -->
<li class="game-end">
    <p class="title">Fin de la partie</p>
    <p>Vous avez perdu le combat, le dragon vous a carbonisé !</p>
    <img src="images/dragon-winner.png" alt="Dragon">
</li>
*/
document.write('<li class="game-end">');
document.write('<p class="title">Fin de la partie</p>');
// Si les points de vie du dragon sont positifs, c'est qu'il est toujours vivant, c'est donc lui qui a gagné le combat
    if(game.hpDragon > 0) {
      document.write('<p>Vous avez perdu le combat, le dragon vous a carbonisé !</p>');
     document.write('<img src="images/dragon-winner.png" alt="Dragon wins">');  
    }
    else {
        document.write('<p>Vous avez vaincu le dragon, vous êtes un vrai héros !</p>');
        document.write('<img src="images/knight-winner.png" alt="Knight wins">'); 
    }
document.write('<li>');

}

/**
 * Affiche ce qu'il s'est passé lors d'un tour du jeu : qui a attaqué ? Combien de points de dommage ont été causés ?
 * @param {string} attacker - Qui attaque : DRAGON ou PLAYER
 * @param {number} damagePoints - Le nombre de points de dommage causés
 */
function showGameLog(attacker, damagePoints)
{
/*
<!-- Journal de la partie - TOUR N°1 -->
<li class="round-log player-attacks">
    <h2 class="subtitle">Tour n°1</h2>
    <img src="images/knight-winner.png" alt="Chevalier">
    <p>Vous êtes le plus rapide, vous attaquez le dragon et lui infligez 11 points de dommage !</p>
</li>

<!-- Journal de la partie - TOUR N°35 -->
<li class="round-log dragon-attacks">
    <h2 class="subtitle">Tour n°35</h2>
    <img src="images/dragon-winner.png" alt="Dragon">
    <p>Le dragon prend l'initiative, vous attaque et vous inflige 8 points de dommage !</p>
</li>
*/
var liClass;
var imageFilename;
var message;

if (attacker == DRAGON) {
    liClass = 'dragon-attacks';
    imageFilename = 'dragon-winner.png';
    message = 'Le dragon prend l\'initiative, vous attaque et vous inflige ' + damagePoints + ' points de dommage !';
}
else {
    liClass = 'player-attacks';
    imageFilename = 'knight-winner.png';
    message = 'Vous êtes le plus rapide, vous attaquez le dragon et lui infligez ' + damagePoints + ' points de dommage !';
}

document.write('<li class="round-log ' + liClass + '">');
document.write('<h2 class="subtitle">Tour n°' + game.round + '</h2>');
document.write('<img src="images/' + imageFilename + '" alt="' + attacker + '">');
document.write('<p>' + message + '</p>');
document.write('</li>');

}

/**
 * Fonction principale du jeu qui démarre la partie
 */
function startGame()    
{
    // Etape 1 : initialisation du jeu
    initializeGame();
    
    // Etape 2 : exécution du jeu, déroulement de la partie
    showGameState();
    gameLoop();
    
    // Fin du jeu, affichage du vainqueur
    showGameWinner();
}

/*************************************************************************************************/
/* ************************************** CODE PRINCIPAL *************************************** */
/*************************************************************************************************/
startGame();