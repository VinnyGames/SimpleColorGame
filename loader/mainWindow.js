// Главное окно приложения
// Функция старта игры

// [min, max) - min - минимальный элемент, max - верхняя грань ( максимальный элемент: max - 1 )
function getRandom(min, max)
{
	var r = Math.random();
	r *= max - min;
	r += min;

	return Math.floor(r);
}

function funcToStart()
{
}

var CellSize = screen.height / 100;
function getCellSize()
{
	return Math.ceil(  CellSize * getScale()  );
}

var MainScale = 1.0;
function getScale()
{
	return MainScale;
}

// Делает картинку крупнее (кроме диалогов)
// После вызова этой функции нужно вызвать game.Repaint() для перерисовки
function increaseScale()
{
	var cs = getCellSize();
	while (cs == getCellSize())
	{
		MainScale *= 1.05;
	}

	if (Math.abs(MainScale - 1.0) < TOL)
		MainScale = 1.0;

	game.SetPlayerDataDelayed({  scale: MainScale  });
}

// Делает картину мельче (кроме диалогов)
// После вызова этой функции нужно вызвать game.Repaint() для перерисовки
function decreaseScale()
{
	// Не уменьшаем размер
	if (CellSize * MainScale < 1.0)
		return;

	var cs = getCellSize();
	while (cs == getCellSize() && cs > 1)
	{
		MainScale /= 1.05;
	}

	game.SetPlayerDataDelayed({  scale: MainScale  });
}

// Это установка масштаба
// Используется для загрузки из PlayerData и для сброса масштаба на 1.0
// saveToPlayerData == true, то будет сохранение в PlayerData
// После вызова этой функции нужно вызвать game.Repaint() для перерисовки
function setScale(scale, saveToPlayerData)
{
	MainScale = scale;

	if (saveToPlayerData)
		game.SetPlayerDataDelayed({  scale: MainScale  });
}
loadProgressInc();
