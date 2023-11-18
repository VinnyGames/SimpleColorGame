/*
Виноградов Сергей Васильевич
Россия, Московская область, Мытищи
Разработка 2023 года.
*/

// Погрешность
var TOL = 1e-12;

var main_element, YandexPlayer, game, topPanelDiv, leftPanelDiv, leftPanelPaddingDiv, leftPanelTextDiv;

var loadProgressDiv = document.getElementById("loadProgress");
var loadProgressInt = 0;
var loadProgressMax = 26;

function loadProgressInc()
{
	loadProgressInt++;
	loadProgressDiv.textContent = "Загрузка игры: " + Math.floor(loadProgressInt / loadProgressMax * 100) + "%";
};

window.onload = function()
{
	// Ошибка в величине константы, задающей количество загружаемых файлов
	if (loadProgressInt != loadProgressMax)
	{
		console.error("loadProgressMax = " + loadProgressInt);
		console.error("See main.js for correct the number");
	}

	// Глобальные переменные
	topPanelDiv         = document.getElementById("topPanel");
	leftPanelDiv        = document.getElementById("leftPanel");
	leftPanelPaddingDiv = document.getElementById("leftPanelPadding");
	leftPanelTextDiv    = document.getElementById("leftPanelTextDiv");

	main_element = document.getElementById("main");

	if (!main_element)
	{
		alert("Браузер не поддерживает HTML5 или произошла фатальная ошибка в игре.\r\nВозможно, вы пользуетесь старым браузером");
	}

	// Это нужно для того, чтобы можно было генерировать keydown на нажатых клавишах
	main_element.contentEditable = true;
	main_element.focus();

	YandexPlayer = null;
	game = new Game();


	// Инициализация
	if (typeof(YaGames) != "undefined")
	{
		YaGames.init
		(
			{
				screen:
				{
					// fullscreen: true
                    fullscreen: false
				}
			}
		)
		.then
		(
			ysdk =>
			{
				console.log('Yandex SDK initialized');
				window.ysdk = ysdk;

				// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
				// https://yandex.ru/dev/games/doc/dg/sdk/sdk-player.html
				getPlayer(  game.LoadGame.bind(game)  );
			}
		);
	}
	else
	{
		var errMsg = "Error: YaGames not found. Fatal game error";
		console.error(errMsg);
		alert(errMsg);

		// TODO: Это надо убрать из релиза игры
		game.LoadGame();
	}
};

loadProgressInc();
