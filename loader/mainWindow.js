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

loadProgressInc();
