// Обработка нажатий клавиш клавиатуры и мыши
// Поставновка на "учёт" всех нужным нам событий
Game.prototype.AddEventListeners =
	function()
	{
		// https://developer.mozilla.org/ru/docs/Web/Events
		var events = [
						['click', 'onClick'], ['wheel', 'onWheel'], ['mousedown', 'onMouseDown'], ['keydown', 'onKeyDown'],
					  	['contextmenu', 'rightClick']
					 ];

		for (var event of events)
		{
			main_canvas.addEventListener(event[0], this[event[1]].bind(this));
		}
	};

Game.prototype.onKeyDown_Compare =
	function(e, key)
	{
		if (e.code != key[0])
			return false;

		var ctrl  = key[2];
		var shift = key[3];
		var alt   = key[4];

		if (ctrl === true || ctrl === false)
		if (ctrl !== e.ctrlKey)
			return false;

		if (shift === true || shift === false)
		if (shift !== e.shiftKey)
			return false;

		if (alt === true || alt === false)
		if (alt !== e.altKey)
			return false;

		return true;
	};

Game.prototype.onKeyDown =
	function(e)
	{
		if (!this.GameRegime.battle)
			return;

		var Found = false;
		try
		{
			console.log(e);	// TODO: убрать после отладки

			// Обработчики находятся в game_events_keys.js
			// Регистрация обработчиков там же
			for (var key of this.onKeyDown_Array)
			{
				if (this.onKeyDown_Compare(e, key))
				{
					Found = true;

					var funcName = key[1];
					try
					{
						this[funcName](e);
					}
					catch (ex)
					{
						console.error("Game.onKeyDown error");
						console.error(e);
						console.error(ex);
					}

					return;
				}
			}

			Found = false;
			return true;
		}
		finally
		{
			if (Found)
			{
				e.preventDefault();
				e.cancelBubble = true;
			}
		}
	};

Game.prototype.onClick =
	function(e)
	{
		if (!this.GameRegime.battle)
			return;

		// console.log(e);
		// e.clientX; e.clientY; altKey: false; shiftKey: false; ctrlKey: false;
		e.preventDefault();
		e.cancelBubble = true;

		if ( this.GameRegime.getUserCanControl() )
		{
			this.SetShowDirection(e);
		}

		this.Repaint();

		return true;
	};

Game.prototype.onMouseDown =
	function(e)
	{
		if (!this.GameRegime.battle)
			return;

		// console.log(e);
		// Средняя кнопка мыши (e.button == 1) сбрасывает масштаб
		if (e.button != 1)
			return false;

		e.preventDefault();
		e.cancelBubble = true;

		setScale(1.0, true);
		this.Repaint();

		return true;
	};

Game.prototype.onWheel =
	// https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent
	// Если крутим колёсико, то уменьшаем или увеличиваем масштаб
	function(e)
	{
		if (!this.GameRegime.battle)
			return;

		if (e.deltaY == 0 || this.GameRegime.showConfiguration.ScaleIsFixed)
			return false;
	
		if (!e.shiftKey)
			return false;

		e.preventDefault();
		e.cancelBubble = true;

		if (e.deltaY > 0)
			increaseScale();
		else
			decreaseScale();

		this.Repaint();

		return true;
	};

Game.prototype.rightClick =
	function(e)
	{
		if (!this.GameRegime.battle)
			return;

		// console.log(e);
		// 2 - правая кнопка мыши
		if (e.button != 2)
			return false;

		var battler = game.warField.SelectedBattler;
		if (!battler)
			return false;

		e.preventDefault();
		e.cancelBubble = true;

		if ( !this.GameRegime.getUserCanControl() )
			return;

		var [x, y, xc, yc] = this.getTruthCoordinated(e.clientX, e.clientY);
		xc = xc - battler.X;
		yc = yc - battler.Y;

		// Если кликнули точно на персонаже, значит движения не будет
		if (xc == 0 && yc == 0)
		{
			battler.MovementSpeed = 0;
		}
		else
		{
			battler.MovementDirection = Math.atan2(xc, -yc);
			battler.MovementSpeed     = 1.0;

			if (!e.shiftKey)
				this.SetShowDirection(e);
		}

		this.Repaint();

		return true;
	};

loadProgressInc();
