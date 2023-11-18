// https://yandex.ru/dev/games/doc/dg/sdk/sdk-player.html
function getPlayer(funcToStart)
{
	ysdk.getPlayer({scopes: false})
	.then
	(
		_player =>
		{
			YandexPlayer = _player;

			console.log("yandex player ID: " + YandexPlayer.getUniqueID());

			// loader/mainWindow.js
			funcToStart();
		}
	)
	.catch
	(
		err =>
		{
			YandexPlayer = false;
			// Если игрок не авторизован, выбрасывает исключение USER_NOT_AUTHORIZED.

			funcToStart();
			// ysdk.auth.openAuthDialog()
		}
	);
}

loadProgressInc();
