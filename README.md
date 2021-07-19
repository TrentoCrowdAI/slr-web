# slr-web

SLR, a system for supporting the search phase of systematic literature reviews. Frontend layer. Backend [here](https://github.com/TrentoCrowdAI/slr-api).

## deployment

### initial installation
- clone the repo ```git clone https://github.com/TrentoCrowdAI/slr-web.git && cd slr-web```
- *checkout on the develop branch  ```git checkout develop```*
- run ```npm install``` to install its modules

### API url endpoint setup
If you're connecting to the default endpoint you can skip this part. Otherwise, if you're running the API endpoint on localhost or a different server you should edit ```scr/config/index.js``` by changing the "home" property value to your API url

### starting the project
You can simply run the project by launching ```npm start```. Be sure to change the API and front-end default ports if you're runnig both of them on localhost
