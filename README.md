# nc_files_to_json

## Windows Part
* by using command line app _anax.exe_ you can convert the _nc_ files to txt
* Use the following command to extract the data:
```
anax.exe file_name.nc -o TXT -time INDEX attribute(tempanomaly) -delim COMMA
```

## Any OS wich run nodejs
* copy _outputfile.txt_ into the dir with _app.js_ and rename to _base.txt_
* run:
```
node app.js
```
* wait and your json files are created
* if you exporting more than 50 years, look on the loop switch in the code of the app.js file
