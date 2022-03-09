@echo off
setlocal

set "d=C:\Videos"
set "i=%~1"
set "i=%i:savetube:=%"
set "i=%i:SEPARATOR=|%"
for /f "tokens=1,2,3 delims=|" %%a in ("%i%") do (
	set "t=%%a"
	set "v=%%b"
	set "a=%%c"
)
set "f=mp4"
if not "x%v:video/webm=%"=="x%v%" set "f=webm"
if not "x%v:.webm=%"=="x%v%" set "f=webm"
if "%a%"=="" (
	if not "%v:.m3u8=%"=="%v%" (
		"C:\Program Files\ffmpeg\bin\ffmpeg.exe" -i "%v%" -c copy "%d%\%t%.%f%"
	) else (
		"C:\Program Files\ytdl\youtube-dl.exe "%v%" "%d%\%t%"
	)
) else (
	"C:\Program Files\ffmpeg\bin\ffmpeg.exe" -i "%v%" -i "%a%" -c copy "%d%\%t%.%f%"
)
