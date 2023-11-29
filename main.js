import _ from 'underscore';

const Juego = (() => {
  const LOCALPOINTS = document.querySelector('.localPoints');
  const LOCALCARDS = document.querySelector('.localCards');
  const GETCARDBUTTON = document.getElementById('getCard');
  const RED_CARD = document.getElementById('red_back');
  const GREY_CARD = document.getElementById('grey_back');
  const IAPOINTS = document.querySelector('.iaPoints');
  const IACARDS = document.querySelector('.iaCards');
  const NEW_GAME_BUTTON = document.getElementById('newGame');
  const CAMPO_CONTEO = document.querySelector('.conteo');
  const PASS_TURN_BUTTON = document.getElementById('passTurn');
  const card_numbers = [2,3,4,5,6,7,8,9,10,'A','J','K','Q'];
  const card_type = ['C','D','H','S'];
  let iaCards;
  let iaPoints;
  let localCards;
  let localPoints;
  let cards;
  let shuffled_cards;
  let conteo = 0;

  /**
   * @event
   * Establece un evento al cargar la página
   */
  window.addEventListener('load', () => {newGame()});
  NEW_GAME_BUTTON.addEventListener('click', () => {
      newGame();
  })

  /**
   * 
   * @param {String} card 
   * Calcula la puntuación del jugador local
   */
  let calculateLocalPoints = (card) => {
      let value;
      let regEx = /^10.$/;
      (regEx.test(card))? value = card.substring(0,2):value = card.substring(0,1);
          switch (value) {
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                  localPoints+=Number(value);
                  conteo+=4;
                  break;
              case '10':
              case 'J':
              case 'K':
              case 'Q':
                  localPoints+=10;
                  conteo-=9;
                  break;
              case 'A':
                  if (localPoints+11 <= 21) {
                      localPoints+=11;
                      conteo+=4;
                  }    
                  else {
                      localPoints+=1; 
                      conteo+=4;
                  }     
                  break;  
          }
      LOCALPOINTS.innerHTML=localPoints+' points';
      CAMPO_CONTEO.innerHTML='Conteo ' + conteo;
  }

  /**
   * 
   * @param {String} card 
   * Calcula la puntuación del crupier
   */
  let calculateIAPoints = (card) => {
          let value;
          let regEx = /^10.$/;
          (regEx.test(card))? value = card.substring(0,2):value = card.substring(0,1);
          switch (value) {
              case '2':
              case '3':
              case '4':
              case '5':
              case '6':
              case '7':
              case '8':
              case '9':
                  iaPoints+=Number(value);
                  conteo+=4;
                  break;
              case '10':
              case 'J':
              case 'K':
              case 'Q':
                  iaPoints+=10;
                  conteo-=9;
                  break;
              case 'A':
                  if (iaPoints+11 <= 21) iaPoints+=11;
                  else {
                      iaPoints+=1; 
                      conteo+=4;
                  }     
                  break;  
          }
          IAPOINTS.innerHTML=iaPoints+' points';
          CAMPO_CONTEO.innerHTML='Conteo ' + conteo;
  }

  /**
   * Esta función hace que el jugador local reciba una carta
   */
  let getCardLocal = () => {
      let card = shuffled_cards.pop();
      localCards.push(card);
      let img = document.createElement('img');
      img.setAttribute('src', 'img/cartas/'+card+'.png');
      LOCALCARDS.append(img);
      calculateLocalPoints(card);
      refreshBankCard();
  }

  /**
   * Esta función hace que el crupier reciba una carta
   */
  let getCardIA = () => {
      let card = shuffled_cards.pop();
      iaCards.push(card);
      let img = document.createElement('img');
      img.setAttribute('src', 'img/cartas/'+card+'.png');
      IACARDS.append(img);
      calculateIAPoints(card);
  }

  /**
   * 
   * @param {String} message 
   * Esta función muestra un mensaje por pantalla
   */
  let setMessage = (message) => {
      document.querySelector('.message h2').innerHTML=message;
  }

  /**
   * 
   * @returns Devuelve true si termina la aprtida o false si no
   */
  let checkWin = () => {
      if (localPoints==iaPoints && (localPoints>=21 && iaPoints>=21) ) {
          document.querySelector('.message h2').classList.remove('hide');
          setMessage('Tie!');
          return true;
      }
      if ((localPoints==21 && (iaPoints<21 || iaPoints>21))) {
          document.querySelector('.message h2').classList.remove('hide');
          setMessage('Local Wins!');
          return true;
      } else if (localPoints>21) {
          document.querySelector('.message h2').classList.remove('hide');
          setMessage('Local Burst!');
          return true;
      } else if (iaPoints==21 && (localPoints<21 || localPoints>21)) {
          document.querySelector('.message h2').classList.remove('hide');
          setMessage('Crupier Wins!');
          return true;
      } else if (iaPoints>21) {
          document.querySelector('.message h2').classList.remove('hide');
          setMessage('Crupier Burst!');
          return true;
      }
      return false;
  }

  /**
   * Va actualizando la carga del montón que se encuentra boca abajo
   */
  let refreshBankCard = () => {
      let lastCard = shuffled_cards[shuffled_cards.length-1];
      let letter;
      let regEx = /^10.$/;
      (regEx.test(lastCard))? letter = lastCard.substring(2,3):letter = lastCard.substring(1,2);
      switch (letter) {
          case 'H':
          case 'D':
              GREY_CARD.classList.add('hide');
              RED_CARD.classList.remove('hide');
              break;
          case 'C':
          case 'S':
              RED_CARD.classList.add('hide');
              GREY_CARD.classList.remove('hide');
              break;   
      }
      
  }

  /**
   * Esta función inicia un nuevo juego
   */
  const newGame = () => {
      document.querySelector('.message h2').classList.add('hide');
      LOCALCARDS.querySelectorAll('img').forEach(img => LOCALCARDS.removeChild(img));
      IACARDS.querySelectorAll('img').forEach(img => IACARDS.removeChild(img));
      GETCARDBUTTON.classList.remove('hide');
      PASS_TURN_BUTTON.classList.remove('hide');
      cards = [];
      shuffled_cards = [];
      conteo=0;
      CAMPO_CONTEO.innerHTML='Conteo 0';
      for (let number of card_numbers) {
          for (let i = 0; i<4; i++) {
              let card=number+card_type[i];
              cards.push(card);
          }
      }    
      shuffled_cards = _.shuffle(cards);
      localCards = [];
      localPoints = 0;
      iaCards = [];
      iaPoints = 0;
      for(let i = 0; i<2; i++) {
          getCardLocal();
          getCardIA();
      }
      refreshBankCard();
      if (checkWin()) {
          GETCARDBUTTON.classList.add('hide');
          PASS_TURN_BUTTON.classList.add('hide');
      }
  }

  /**
   * Este evento determina que al pulsar el botón el jugador local recibe una carta
   */
  GETCARDBUTTON.addEventListener('click', () => {
      getCardLocal();
      if (checkWin()) {
          GETCARDBUTTON.classList.add('hide');
          PASS_TURN_BUTTON.classList.add('hide');
      }
  });

  /**
   * Este evento determina que al hacer click en el botón el jugador local pasa el turno a la máquina
   */
  PASS_TURN_BUTTON.addEventListener('click', () => {
      GETCARDBUTTON.classList.add('hide');
      PASS_TURN_BUTTON.classList.add('hide');
      while(iaPoints<17) {
          getCardIA();
      }
      checkWin();
      document.querySelector('.message h2').classList.remove('hide');
      if (localPoints>iaPoints && localPoints<=21) {
          setMessage('Local Wins!');
      } else if (localPoints<iaPoints && iaPoints<=21){
          setMessage('Crupier Wins!');
      }
  })
  return {
      newGame : newGame,
  }
})();

Juego.newGame();