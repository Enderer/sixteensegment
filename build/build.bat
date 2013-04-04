@ECHO OFF

pushd ..
set parent=%cd%
popd

echo Compiling file:
echo %parent%\segment.min.js
echo.

java -jar compiler.jar ^
--js_output_file=../segment.min.js ^
--js=../src/ElementArray.js ^
--js=../src/SegmentCanvas.js ^
--js=../src/SixteenSegment.js ^
--js=../src/SevenSegment.js ^
--warning_level verbose

echo Compile complete!

pause