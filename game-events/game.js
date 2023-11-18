// Загрузка данных, обработка нажатий клавиш
var Game = function()
{
	this.GameRegime = new GameRegime(this);
	this.setGameSpeed(0);
	this.GameCycleNumber    = 0;
	this.GameSubCycleNumber = 0;
};

Game.prototype =
{
	// Эта функция вызывается в самом начале загрузки игры
	// Предназначена только для однократного вызова
	LoadGame:
		function ()
		{
			loadProgressDiv.textContent = "Ждём загрузки данных игрока";
			this.LoadPlayerData
			(
				undefined,
				function(isSuccess)
				{
					loadProgressDiv.style.display = "none";

					topPanelDiv .style.display        = "block";
					leftPanelDiv.style.display        = "block";
					topPanelDiv .style["min-height"]  = getCellSize() *  1 + "px";
					leftPanelPaddingDiv.style.height  = getCellSize() *  1 + "px";
					leftPanelDiv.style.width          = getCellSize() * 12 + "px";


					if (isSuccess)
					{
						topPanelDiv.textContent = "Данные игрока успешно загружены";
					}
					else
					{
						topPanelDiv.textContent = "Игра действует без сохранения прогресса (авторизуйтесь на yandex.ru)";
						this.GameRegime.ShowNoHaveOnlineDialog();
					}

					// Если игра запущена в первый раз
					this.SetPlayerDataIfNotSet({  version:           1     },  0, true);
					this.SetPlayerDataIfNotSet({  maxMission:        0     },  0, true);
					this.SetPlayerDataIfNotSet({  scale:             1.0   },  0, true);
					this.SetPlayerDataIfNotSet({  education_g:       false },  0, true);

					AC2(this.Repaint, this);
					this.AddEventListeners();

					// На всякий случай ставим фокус на canvas, чтобы нормально обрабатывались все клавиши
					setFocus();

					game.startGameCycle();
				}.bind(this)
			);
		},

	PlayerData: {},

	LoadPlayerData:
	function(keys, callback)
	{
		if (!YandexPlayer)
		{
			callback(false);
			return false;
		}

		YandexPlayer.getData(keys)
		.then
		(
			(data) =>
			{
				console.log("start of load data from yandex");
				console.log(data);
				for (var dt in data)
				{
					// dt - это имена параметров в data
					// Задаём эти параметры в PlayerData, не переопределяя то, что не задано
					this.PlayerData[dt] = data[dt];
					
					if (dt == 'scale')
					{
						setScale(this.PlayerData[dt]);
					}

					console.log(dt);	// TODO: убрать после отладки
					console.log(this.PlayerData[dt]);
				}
				console.log(this.PlayerData);
				console.log("end of load data from yandex");

				if (callback)
					callback(true);
			}
		)

		return true;
	},

	SetPlayerDataIfNotSet:
	function(data, callback, onlyLocal)
	{
		var setOccured = false;
		for (var dt in data)
		{
			if (typeof(this.PlayerData[dt]) == 'undefined')
			{
				this.PlayerData[dt] = data[dt];
				setOccured = true;
			}
		}

		if (setOccured && !onlyLocal)
			this.SetPlayerData({}, callback);
	},

	// Сохраняет данные локально - в объекте game, но не на сервере
	SetLocalPlayerData:
	function(data)
	{
		for (var dt in data)
		{
			this.PlayerData[dt] = data[dt];
		}
		// console.log(this.PlayerData);
	},

	// Отложенное запоминание данных пользователя: например, при изменении масштаба (прокрутка колёсиком мыши генерирует очень много событий)
	SetPlayerDataDelayed:
	function(data)
	{
		this.SetLocalPlayerData(data);
		this.DelayedSetPlayerData = true;

		var SetPlayerData = this.SetPlayerData.bind(this);

		setTimeout
		(
			() =>
			{
				if (this.DelayedSetPlayerData)
					SetPlayerData({});
			},
			10*1000
		);
	},

	SetPlayerData:
	function(data, callback)
	{
		this.DelayedSetPlayerData = false;
		this.SetLocalPlayerData(data);

		if (!YandexPlayer)
		{
			console.log('Player data saving within browser, not in yandex servers');

			if (callback)
				callback();

			return false;
		}

		// Посылаем все данные, т.к. яндекс не позволяет сохранять только часть данных
		YandexPlayer.setData(this.PlayerData)
		.then
		(
			() => 
			{
				if (callback)
					callback();
			}
		)
		.catch
		(
			() =>
			{
				console.error('Player data saving failed');
				alert('Player data saving failed');
			}
		);
	}
};

loadProgressInc();
