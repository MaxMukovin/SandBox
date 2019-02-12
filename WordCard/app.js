// Запрет перезагрузки
// window.onbeforeunload = function() {
//   return "";
// }

var counterTrue = 0, //Счётчик ответов Верно
    counterFalse = 0, //Счётчик ответов Неверно
    buttonHeight = 40, //Высота Кнопок
    element, //Элемент массива, выбранный рандомно
    structureArray = [], //Массив со структурой
    appDictionary = [], //Массив состоящий из активных словарей
    appDictionaryLength = 0,
    addCard = card, //Образец новой карточки HTML
    newCard = {}, //Новая карточка, объект для добавления
    addDictionary = dictionarySample, //Образец нового словаря HTML
    settingState = 0, //Состояние поля настроек открыто/закрыто
    modeState = 0; //Состояние переключателя режима

// Удаляем всё из Контейнера
container.removeChild(container.children[0]);
dictionarysField.removeChild(dictionarysField.children[0]);

// Создаём список словарей
for (var i = 0; i < dictionary.length; i++) {
  !function(){
    var newDictionary = addDictionary.cloneNode(true);
        newDictionary.id = i;
        newDictionary.children[1].children[0].innerHTML = dictionary[i].name;

        var transcription = 0;
        for (var n = 0; n < dictionary[i].dictionary.length; n++) {
          if (dictionary[i].dictionary[n][2] != undefined) {
            transcription++
          }
        }
        transcription = Math.round(transcription / dictionary[i].dictionary.length * 100);

        newDictionary.children[1].children[1].innerHTML = `Элементов:${dictionary[i].dictionary.length}; Транскрипция: ${transcription}%`

        newDictionary.onclick = function(){
          if (newDictionary.className == "dictionaries") {
            newDictionary.className = "dictionaries active"
            structureArray[this.id] = 1;
          } else {
            newDictionary.className = "dictionaries"
            structureArray[this.id] = 0;
          }
        }
    dictionarysField.appendChild(newDictionary);
  }();
}

// Создаём массив со структурой
for (var i = 0; i < dictionary.length; i++) {
  structureArray.push(0)
}
structureArray[0] = 1;

// Создаём словарь на основании массива структуры
addDictionarys();

function addDictionarys() {
  appDictionary = [];
  for (var i = 0; i < structureArray.length; i++) {
    if(structureArray[i] == 1){
      appDictionary = appDictionary.concat(dictionary[i].dictionary);
      dictionarysField.children[i].className = "dictionaries active";
    }
  }
  appDictionaryLength = appDictionary.length;
}
//
// Запускаем функцию генерации карточки
init();

// Функция генерации карточки
function init(){
  newCard = addCard.cloneNode(true);

  container.insertBefore(newCard, container.children[0]);
  // container.appendChild(newCard);

  if (appDictionary.length == 0) {
    alert("Весь словарь пройден! Начать заново");
    counterTrue = 0;
    counterFalse = 0;
    if (structureArray.reduce((accumulator, currentValue) => accumulator + currentValue) == 0) {
      structureArray[0] = 1;
    }
    addDictionarys()
  }
  element = parseInt(Math.random() * appDictionary.length);
  var transcription = appDictionary[element][2];
  if (appDictionary[element][2] == undefined) {
    transcription = ''
  }

  if (modeState == 0) {
    word.children[1].appendChild(document.createTextNode(`${appDictionary[element][0]}`));
    word.children[2].appendChild(document.createTextNode(`${transcription}`));
    // translation.children[1].appendChild(document.createTextNode(`${appDictionary[element][1]}`));
    translation.children[1].innerHTML = `${appDictionary[element][1]}`
  } else {
    word.children[1].appendChild(document.createTextNode(`${appDictionary[element][1]}`));
    translation.children[1].appendChild(document.createTextNode(`${appDictionary[element][0]}`));
  }

  btnShow.style.height = `${buttonHeight}px`;

  // translation.children[1].style.opacity = "0";
  btnShow.style.marginTop = "0";
  btnShow.style.opacity = "1";
  btnTrue.style.height = "0";
  btnFalse.style.height = "0";
  btnShow.addEventListener("click", btnShowEvent);
  btnTrue.addEventListener("click", btnTrueEvent);
  btnFalse.addEventListener("click", btnFalseEvent);
  setTimeout(function(){
    card.style.opacity = "1";
    card.style.transform = "scaleY(1)"
  }, 300)

  progressBar.style.width = `${100 - parseInt(appDictionary.length/appDictionaryLength * 100)}%`;
  progressBar.innerHTML = `${100 - parseInt(appDictionary.length/appDictionaryLength * 100)}%`;
  progress.innerHTML = `${appDictionaryLength - appDictionary.length}/${appDictionaryLength}`

  answerTrue.style.width = `${parseInt(100 * counterTrue / (counterTrue + counterFalse))}%`;
  answerFalse.style.width = `${100 - parseInt(100 * counterTrue / (counterTrue + counterFalse))}%`;
  answerTrue.innerHTML = `${Math.round(100 * counterTrue / (counterTrue + counterFalse + .001))}%`;
  answerFalse.innerHTML = `${100 - Math.round(100 * counterTrue / (counterTrue + counterFalse + .001))}%`;
}

// События

function btnShowEvent(){
  translation.children[1].style.opacity = "1";
  btnShow.style.height = "0";
  btnShow.style.opacity = "0";
  btnShow.style.marginTop = "-12px";
  btnTrue.style.height = `${buttonHeight}px`;
  btnTrue.style.display = "block";
  btnFalse.style.height = `${buttonHeight}px`;
  btnFalse.style.display = "block";
}

function btnTrueEvent(){
  appDictionary.splice(element,1);
  counterTrue++;
  remove();
}

function btnFalseEvent(){
  counterFalse++
  remove();
}

function remove(){
  card.id = "cardOld";
  text.id = "";
  word.id = "";
  translation.id = "";
  control.id = "";
  btnShow.id = "";
  btnTrue.id = "";
  btnFalse.id = "";
  cardOld.style.transform = "scaleY(0)";
  cardOld.style.opacity = "0";
  cardOld.style.marginLeft = "-50%";
  init();
  // setTimeout(init, 0);
  setTimeout(function(){
    while (container.children.length > 1) {
      container.removeChild(container.children[1])
    }
  }, 300);
}

// Панель настроек
btnShowSettings.onclick = function(){
  if (settingState == 0) {
    showSetting();
  } else {
    closeSetting();
  }
}

btnEngRus.onclick = function() {
  modeState = 0;
  btnEngRus.className = 'button active';
  btnRusEng.className = 'button';
}
btnRusEng.onclick = function() {
  modeState = 1;
  btnEngRus.className = 'button';
  btnRusEng.className = 'button active';
}

btnConfirm.onclick = function(){
  closeSetting();
  addDictionarys();
  counterTrue = 0;
  counterFalse = 0;
  remove();
}

function showSetting() {
  settingsField.style.transform = "scaleY(1)";
  settingsField.style.opacity = "1";
  settingState = 1;
  btnShowSettings.children[0].style.transform = "rotate(-180deg)";
  stat.style.opacity = ".15"
  container.style.opacity = ".15"
}
function closeSetting() {
  settingsField.style.transform = "scaleY(0)";
  settingsField.style.opacity = "0";
  btnShowSettings.children[0].style.transform = "rotate(0deg)";
  settingState = 0;
  stat.style.opacity = "1"
  container.style.opacity = "1"
}
