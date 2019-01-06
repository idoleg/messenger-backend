
## TypeScript
В проекте ипользуется TypeScript версии 3.2.2
 1. [➔ Официальная Докуменатция](https://www.typescriptlang.org/docs/handbook/basic-types.html)
 2. [➔ TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/docs/getting-started.html)
##### Настройка WebStorm
Откройте Settings проекта, выберете Languages & Frameworks ➔ TypeScript и в этой вкладке укажите:
 1. Node interpreter: Project
 2. TypeScript: ~AppData\Roaming\npm\node_modules\tslint
 3. ☑ TypeScript Language Service
 4. ☑ Recompile on changes
 5. Compile scope: project
 
 Теперь внизу появится вкладка TypeScrip, в которой вы сможете увидеть ошибки компиляции, а WebStorm будет авторматически компилировать файлы.

## Linting
Для линтинга используется пакет [TSLint](https://palantir.github.io/tslint/rules/) c прессетом [recommended](https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts).
**Перед пушем кода в репозиторий** убедитесь, что код соответсвует правилам линтера.

##### Команды
 1. `npm run lint` - анализирует весь проект и выводит в консоль ошибки, если они есть
 2. `npm run fix` - автоматически пытается исправить ошибки в проекте
 
##### Настройка WebStorm
Откройте Settings проекта, выберете Languages & Frameworks ➔ TypeScript ➔ TSLint и в этой вкладке укажите:
 1. ☑ Enable
 2. Node interpreter: Project
 3. TSLint package: %путь до репозитория%\node_modules\tslint
 4. Search for tslint.json
 5. Lint JavaScript Files ☑

## Отладка
Для отладки кода написанного на TypeScript под WebStorm создайте новую Run/Debug Configuration, где во вкладке Configuration укажите:
 1. Node interpreter: Project
 2. Node params: --inspect
 3. Working directory: %путь до репозитория%
 4. JavaScript file: \dist\app\index.js
 
 Теперь, если у вас созданы map-файлы, вы можете ставить точку останова в файлах TS и ваш код будет останавливаться на них.
 
 ## Тестирование
 https://medium.com/devschacht/node-hero-chapter-9-68041507aec
 https://habr.com/company/ruvds/blog/349452/
 https://www.chaijs.com/ 
 
## Приложение
При написании своего функционала выносте параметры, которые можно изменять в файлы конфигураций, находящиеся в папке /config.
Для параметров, которые зависят от среды выполнения (например, конфигурация для доступа к серверу БД) ипользуйте .env файл.

##### Запуск и развертывание приложения
 1. Скопируйте файл .env.example и переименуйте его в .env
 2. Запустите приложение в обычном режеме командой `npm start`
 3. Либо запустите приложение с авторестартом при изменениях командой `npm dev`
