// Copyright (c) 2021 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// IMPORTS
// Kepler.gl components
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addDataToMap, wrapTo} from 'kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components';
import {theme} from 'kepler.gl/styles';

// CSV processor
import {processCsvData} from 'kepler.gl/processors';

// import and config data here
import UAVFlightGridCSV from './data/UAV_Flight_Grid'
import simulatedTreeDataCSV from './data/simulatedTreeData';
import config from './config/config'

// END IMPORTS

const StyledMapConfigDisplay = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 10px;
  background-color: ${theme.sidePanelBg};
  font-size: 11px;
  width: 300px;
  color: ${theme.textColor};
  word-wrap: break-word;
  min-height: 60px;
  padding: 10px;
`;

// Format datasets using: 
// const name = {
//   info:{id:, label: },
//   data:processCsvData()
// };
const uavData = processCsvData(UAVFlightGridCSV)
const treeData = processCsvData(simulatedTreeDataCSV)

var data = uavData
const uavDataset = {
  data, 
  info: {id: 'uav_data', label: 'UAV Data'},
 };

data = treeData
const treeDataset = {
  data,
  info: {id:'tree_data', label: 'Simulated Tree Data'},
};

// const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYm1leWJvb20iLCJhIjoiY2txdmNhcTJ1MDR3NjJ5cXlvb3J6aGR2YiJ9.ZrjEkNmTGFSJhydwdCuN-A'; // eslint-disable-line
const DATA_URL = 'https://raw.githubuseprcontent.com/bmeyboom/random/main/UAVFlightGrid.csv';


import {
  LayerHoverInfoFactory,
  injectComponents,
  PanelHeaderFactory
} from 'kepler.gl/components';

// Custom features
import CustomPanelHeaderFactory from './components/panel-header';
import CustomSidebarFactory from './components/side-bar';
import CustomPanelToggleFactory from './components/panel-toggle';
import CustomSidePanelFactory from './components/custom-panel';
import CustomLayerHoverInfoFactory from './components/custom-layer-hover';
import { TimeWidgetFactory } from 'kepler.gl/components';

// Inject custom components
const KeplerGl = injectComponents([
  [LayerHoverInfoFactory, CustomLayerHoverInfoFactory],
  [PanelHeaderFactory, CustomPanelHeaderFactory]
]);

// Create the app by adding data and configuration
class App extends Component {
  componentDidMount() {
    this.props.dispatch(wrapTo(
      'map1', 
      addDataToMap({
        // make sure to include all datasets you want to see here
        // datasets: [uavDataset, treeDataset],
        datasets: [treeDataset, uavDataset],
        options: {
          centerMap: false
        },
        config: config
      })
      )
    );
  }

  // render the App/map
  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl 
            mapboxApiAccessToken={MAPBOX_TOKEN} 
            // set map type here or in the theme
            // styleType='satellite'
            id="map1" 
            // define the width of the app
            width={width} 
            height={height} />
          )}
        </AutoSizer>
        <StyledMapConfigDisplay>
          {this.props.app.mapConfig
            ? JSON.stringify(this.props.app.mapConfig)
            : 'Click Save Config to Display Config Here'}
        </StyledMapConfigDisplay>
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
