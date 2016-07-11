# Test task (Phone pay)

After git-clone do "npm install"

After all npm-packages installed, do "npm run dev" to build dev-version

### For example
Run static server with Livereload with parametres:
```sh
$ HOST=10.0.100.20 PORT=8888 npm run dev
```

### Важное замечание

После сборки проекта нормальная его работа возможно только на работающем web-сервере. При прямом открытии index.html в браузере произойдет ошибка CORS, т.к. используется require.js 
