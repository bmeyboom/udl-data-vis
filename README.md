# About this Map
This map was produced by modifying the kepler.gl backend to change the regular components into what we wanted to have for our data vis demo for the Natural Assets team at the UBC Urban Data Lab. You can find more information about the code under the folder called src. Each folder has a README to help explain the code and hopefully allow for a smooth transition of knowledge to the next map editor.

## How to modify components
To modify features go into _node_modules > kepler.gl > dist_ and most components can be found in the components folder. 

## How to run the map locally
To run the map locally I would suggest you use the virtual environment set up (find out more about those here: https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)
Enter the following into your terminal in your code editor of choice: 
- source env/bin/activate
- npm start
The map should now load in your browser automatically (it could take a minute).


# original kepler.gl README: 
## Replacing components

Example showing how to replace kepler.gl default components using `injectComponents` method.

#### 1. Install

```sh
npm install
```

or

```sh
yarn
```


#### 2. Mapbox Token
add mapbox access token to node env

```sh
export MapboxAccessToken=<your_mapbox_token>
```

#### 3. Start the app

```sh
npm start
```
