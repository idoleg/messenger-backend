
## Node.js
Требуемая версия не ниже 10.

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
Для отладки кода написанного на TypeScript под WebStorm создайте в окне Run/Debug Configuration новую Node.js конфигурацию, где во вкладке Configuration укажите:
 1. Node interpreter: Project
 2. Node params: --inspect
 3. Working directory: %путь до репозитория%
 4. JavaScript file: \dist\app\index.js
 
 Теперь, если у вас созданы map-файлы, вы можете ставить точку останова в файлах TS и ваш код будет останавливаться на них.
 
 ## Юнит тестирование
 Модульное тестирование очень важно для написания поддерживаемого и исправно работающего кода. Также это позволяет писать код по методологии TDD. И документировать с помощью BDD.
  1. [Mocha](https://mochajs.org/) - Фреймворк для тестирования
  2. [Chai](https://www.chaijs.com/guide/styles/) ([API](https://www.chaijs.com/api/bdd/)) - Библиотека для создания утверждений
  3. [Sinon](https://sinonjs.org/releases/v7.2.2/) - Библиотека для создания шпионов, стабов и мок
 
 При тестировании маршрутов подключайте сбилженные js файлы, а не ts.
 
 ##### Команды
  1. `npm run test` - запустить тесты и вывести результаты в консоль
  2. `npm run test:report` - запустить тесты и сформировать html-отчет с результатами тестов по пути _/test/.report/mochawesome.html_
  2. `npm run test:coverage` - азапустить тесты и сформировать html-отчет покрытия кода тестами по пути _/test/.coverage/index.html_
 
 ##### Настройка WebStorm
 Для отладки кода написанного на TypeScript под WebStorm создайте в окне Run/Debug Configuration новую Mocha конфигурацию, где во вкладке Configuration укажите:
  1. Node interpreter: Project
  2. Working directory: %путь до репозитория%
  3. Mocha packages directory: %путь до репозитория%\%путь до mocha в папке node_modules%
  4. User interface: bdd
  5. File Pattern ☑
  6. Test file pattern: **/*.spec.ts
 
 Для дополнительного прочтения 
 1. [Хабр: Сравнение инструментов для тестирования](https://habr.com/company/ruvds/blog/349452/)
 2. [Хабр: Тестирование RESTful API ](https://habr.com/post/308352/)
 3. [Медиум: Введение в модульное тестирование](https://medium.com/devschacht/node-hero-chapter-9-68041507aec)
 3. [Медиум: Мокирование](https://medium.com/@cakeinpanic/%D1%8E%D0%BD%D0%B8%D1%82-%D1%82%D0%B5%D1%81%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-angular2-%D0%BC%D0%BE%D0%BA%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-bad6bb7a6a5c)
 3. [Медиум: Mocking in TypeScript](https://medium.com/@michal.m.stocki/when-it-comes-to-mocking-in-typescript-be8531d39327)
 4. [Istanbul: Формирование отчета покрытия кода тестами](https://istanbul.js.org/)
 4. [Mongoose models and unit tests](https://codeutopia.net/blog/2016/06/10/mongoose-models-and-unit-tests-the-definitive-guide/)
 
## Пуш кода в репозиторий
Перед пушем кода в репозиторий, убедитесть, что:
 1. Код соответсвует правилам линтера - `npm run lint`
 2. Код проходит все тесты - `npm run test`
 3. Незабывайте, что у вас должен быть глобально утсановлен комитизен _npm i -g commitizen_
 4. Добавьте в коммит только файлы, решающие ту задачу, за которую вы взялись
 5. Дайте осмысленное название комиту согласно правилам [Conventional Commits](https://habr.com/company/yandex/blog/431432/) командой `git cz` 
 6. Запуште ваш код в ветку *develop* или *feature/%name*
  
## Приложение
При написании своего функционала выносте параметры, которые можно изменять в файлы конфигураций, находящиеся в папке /config.
Для параметров, которые зависят от среды выполнения (например, конфигурация для доступа к серверу БД) ипользуйте .env файл.

##### Развертывание и запуск приложения
 1. Скопируйте файл .env.example и переименуйте его в .env
 2. Скомпилируйте исходный TS-код в код на JS командой `npm run build` либо средствами вашей среды разработки
 2. Запустите приложение в обычном режеме командой `npm start`
 3. Либо запустите приложение с авторестартом при изменениях командой `npm run dev`

##### Заполнение фейковыми данными
Введите в консоле `npm run faker` для того, что бы заполнить БД фейковыми данными. Вы можете указать множитель, что бы сгенерирвать больше данных: `npm run faker 5`. **При больших значениях операция может продолжатьься слишком долго!**

##### Документация к используемым пакетам
 1. [Mongoose](https://mongoosejs.com/docs/index.html)
 2. [Express](https://expressjs.com/en/4x/api.html)
 3. [Validator](https://github.com/hapijs/joi/blob/v14.3.1/API.md)
 4. [JWT](https://github.com/auth0/node-jsonwebtoken)
 5. [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node/tree/58f301a6e245ee25c4ca50dbd6e3d30c69c9d3d1/docs)




