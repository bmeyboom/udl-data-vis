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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addDataToMap, wrapTo} from 'kepler.gl/actions';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import styled from 'styled-components';
import {theme} from 'kepler.gl/styles';

import {processCsvData} from 'kepler.gl/processors';

import sampleData, {config, uavData} from './data/sample-data';

const uavDataset = {
  info: {id: 'uav_data', label: 'UAV Data'},
  data: processCsvData(uavData)
 };

// const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYm1leWJvb20iLCJhIjoiY2txdmNhcTJ1MDR3NjJ5cXlvb3J6aGR2YiJ9.ZrjEkNmTGFSJhydwdCuN-A'; // eslint-disable-line
const DATA_URL = 'https://raw.githubuseprcontent.com/bmeyboom/random/main/UAVFlightGrid.csv';

import {
  SidebarFactory,
  PanelHeaderFactory,
  PanelToggleFactory,
  CustomPanelsFactory,
  LayerHoverInfoFactory,
  injectComponents
} from 'kepler.gl/components';

import CustomPanelHeaderFactory from './components/panel-header';
import CustomSidebarFactory from './components/side-bar';
import CustomPanelToggleFactory from './components/panel-toggle';
import CustomSidePanelFactory from './components/custom-panel';
import CustomLayerHoverInfoFactory from './components/custom-layer-hover';
import { TimeWidgetFactory } from 'kepler.gl/components';

// Inject custom components
const KeplerGl = injectComponents([
  // [SidebarFactory, CustomSidebarFactory],
  // [PanelHeaderFactory, CustomPanelHeaderFactory],
  // [PanelToggleFactory, CustomPanelToggleFactory],
  // [CustomPanelsFactory, CustomSidePanelFactory],
  [LayerHoverInfoFactory, CustomLayerHoverInfoFactory],
]);

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

class App extends Component {
  componentDidMount() {
    this.props.dispatch(wrapTo(
      'map1', 
      addDataToMap({
        // datasets: sampleData, 
        datasets: [uavDataset],
        config: config
      })
      )
    );
  }

  render() {
    return (
      <div style={{position: 'absolute', width: '100%', height: '100%'}}>
        <AutoSizer>
          {({height, width}) => (
            <KeplerGl 
            mapboxApiAccessToken={MAPBOX_TOKEN} 
            id="map1" 
            width={width} 
            height={height} />
          )}
        </AutoSizer>
        {/* <StyledMapConfigDisplay>
          {this.props.app.mapConfig
            ? JSON.stringify(this.props.app.mapConfig)
            : 'Click Save Config to Display Config Here'}
        </StyledMapConfigDisplay> */}
      </div>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, dispatchToProps)(App);
