# ToDo-App

release3 branch is the final branch for review

index.js is the starting point

data.js contains a singleton class for setting and getting app source of truth

todoUtils.js contains utility function getSavedData() to fetch data from local storage and debounce() for delay between autosaves

app.js initiates the app

pane.js contains the methods to manipulate data for pane

todos.js contains methods to manipulate data for todos

paintDOM.js contains paintPane and paintTodos for handling UI of pane and todos respectively
