// Обработчики onKeyDown

// e.code, e.ctrlKey, e.shiftKey, e.altKey
// Декларация обработчиков onKeyDown
Game.prototype.onKeyDown_Array =
	[
		['Escape',         'key_Escape',         false, false, false],	// Главное меню
		['F10',            'key_F10',            false, false, false],	// Конфигурация масштаба экрана
		['Backquote',      'key_Backquote',      false, false, false],	// Задание на миссию по клавише '~'

		// Клавиши масштаба
		['Backquote',      'key_Scale',          false, true,  false],
		['Equal',          'key_Scale',          false, true,  false],
		['Minus',          'key_Scale',          false, true,  false],
		['NumpadAdd',      'key_Scale',          false, true,  false],
		['NumpadSubtract', 'key_Scale',          false, true,  false],

		// Клавиши хода и паузы
		// < > / Enter End Pause
		['Comma',          'key_Step',           false, 0,     false],
		['Period',         'key_Step',           false, 0,     false],
		['Slash',          'key_Step',           false, 0,     false],
		['Enter',          'key_Step',           false, 0,     false],
		['NumpadEnter',    'key_Step',           false, 0,     false],
		['End',            'key_Step',           false, 0,     false],
		['Home',           'key_Step',           false, 0,     false],
		['Pause',          'key_Step',           false, 0,     false],
		['ArrowUp',        'key_Step',           false, 0,     false],
		['ArrowDown',      'key_Step',           false, 0,     false],
		['ArrowRight',     'key_Step',           false, 0,     false],
		['ArrowLeft',      'key_Step',           false, 0,     false]
	];

// Обработка масштаба
// Если нажаты клавиши "+" или "-" на основной или цифровой клавиатуре, а также "~" (тильда == "Backquote")
// "Equal" - это "+" на обычной клавиатуре
Game.prototype.key_Scale =
function(e)
{
	if (e.code == "Equal" || e.code == "NumpadAdd")
	{
		increaseScale();
	}
	else
	if (e.code == "Backquote")
	{
		setScale(1.0, true);
	}
	else
	{
		decreaseScale();
	}

	this.Repaint();
};

// Конфигурация масштаба экрана
Game.prototype.key_F10 =
function(e)
{
	if (this.GameRegime.setConfigurationMenu())
		return;
};

// Главное меню
Game.prototype.key_Escape =
function(e)
{
	if (this.GameRegime.dialog)
	{
		this.GameRegime.hideDialog();
		return;
	}

	if (this.GameRegime.setEscapeMenu())
		return;
};

Game.prototype.key_Backquote =
function(e)
{
	// Если окно уже открыто - закрываем его
	if (this.GameRegime.dialog && this.GameRegime.dialog.NameOfMenu == "MissionTargetsMenu")
	{
		this.GameRegime.hideDialog();
		return;
	}

	// Открываем окно задания на миссию
	if (this.GameRegime.ShowMissionTargetsMenu())
		return;
};

// Сделать ход
Game.prototype.key_Step =
function(e)
{
	// Если нажата клавиша shift, то количество ходов увеличивается в два раза
	var M = e.shiftKey ? 2 : 1;

	if (e.code == 'Comma')
	{
		this.doStep(1*M);
	}
	else
	if (e.code == 'Period')
	{
		this.doStep(4*M);
	}
	else
	if (e.code == 'Slash' || e.code == 'Enter' || e.code == 'NumpadEnter')
	{
		this.doStep(16*M);
	}
	else
	if (e.code == 'End' || e.code == 'Pause')
	{
		// Восстанавливаем скорость игры к той, которая была до этой
		// 'End' скорость игры не восстанавливает специально. Чтобы не было проблем с двойными нажатиями (всегда пауза - без вариантов)
		if (this.GameSpeed == 0 && e.code == 'Pause')
			this.setGameSpeed(this.lastGameSpeed);
		else
			this.setGameSpeed(0);
	}
	else
	if (e.code == 'Home')
	{
		this.incrementGameSpeed(4, M);
	}
	else
	if (e.code == 'ArrowUp')
	{
		this.incrementGameSpeed(0, M);
	}
	else
	if (e.code == 'ArrowDown')
	{
		this.decrementGameSpeed(0, M);
	}
	else
	if (e.code == 'ArrowRight')
	{
		this.incrementGameSpeed(1, M);
	}
	else
	if (e.code == 'ArrowLeft')
	{
		this.decrementGameSpeed(1, M);
	}
};

loadProgressInc();
