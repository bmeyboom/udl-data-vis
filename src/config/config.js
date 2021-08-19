export const config = {
  version: 'v1',
  config: {
    visState: {
      // add or manipulate layers here
      layers: [
        {
          type: 'point',
          config: {
            dataId: 'uav_data', // GREENNESS
            columns: {
              lat: 'Latitude',
              lng: 'Longitude'
            },
            color: [0, 179, 30],
            label: 'Greenness', // layer name
            isVisible: true,
            visConfig: {
              opacity: 0.01,
              worldUnitSize: 0.01, // controls how fine the grid is
              resolution: 0.01,
              colorRange: {
                name: 'ColorBrewer GnBu-6',
                type: 'exponential',
                category: 'ColorBrewer',
                colors: ['#006600', '#009900', '#00cc00', '#00ff00', '#33ff33', '#66ff66'],
                reversed: false
              }
            }
          },
          visualChannels: {

            colorField: {
              name: 'value', // what variable determines the point colours
              type: 'real'
            },
            // sizeField: {
            //   name: 'value',
            //   type: 'real'
            // },
            // sizeScale: 'exponential'
          }
        },
        // Tree sensor data vizualization,   
        {
          type: 'point', // TREE TYPE
          config: {
            dataId: 'tree_data',
            columns: {
              lat: 'Lat',
              lng: 'Lon'
            },
            color: [255, 0, 0],
            label: 'Tree type',
            isVisible: true,
            visConfig: {
              colorRange: {
                colorMap: [ // map colours to tree types (HTML)
                  ['NorthernRedOak_FairView', '#e03c31'],
                  ['NorthernRedOak_Kaiser', '#be4f62'],
                  ['PinOak', '#008000'],
                  ['WesternRedCedar', '#a52a2a']
                ]
              },
            }
          },
          visualChannels: {
            colorField: {
              name: 'Tree_type',
              type: 'string'
            }
            // , 
            // sizeField: {
            //   name: 'VWC',
            //   type: 'real'
            // }
            // ,
            // sizeScale: 'linear'
          }
        } 
        ,           
        // {
        //   type: 'hexagon',
        //   config: {
        //     dataId: 'tree_data',
        //     label: 'Greenness',
        //     color: [23, 184, 190],
        //     columns: {
        //       lat: 'Lat',
        //       lng: 'Lon'
        //     },
        //     isVisible: true,
        //     visConfig: {
        //       opacity: 0.2,
        //       worldUnitSize: 0.01, // controls how fine the hexagon grid is
        //       resolution: 0.01,
        //       colorRange: {
        //         name: 'ColorBrewer GnBu-6',
        //         type: 'sequential',
        //         category: 'ColorBrewer',
        //         colors: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac'],
        //         reversed: false
        //       },
        //       coverage: 1, // Change what portion of each grid cell is covered by a color square. https://docs.kepler.gl/docs/user-guides/d-layer-attributes
        //       sizeRange: [0, 4],
        //       percentile: [0, 100],
        //       elevationPercentile: [0, 100],
        //       elevationScale: 1,
        //       'hi-precision': true,
        //       colorAggregation: 'average',
        //       sizeAggregation: 'average',
        //       enable3d: true
        //     }
        //   },
        //   visualChannels: {
        //     colorField: 'null',
        //     colorScale: 'quantile',
        //     sizeField: null,
        //     sizeScale: 'linear'
        //   }
        // },
        
      //   UAV Data visualization

      //   sample for hexagon layer
      //   {
      //     type: 'hexagon',
      //     config: {
      //       dataId: 'uav_data', // data label
      //       label: 'Greenness', // layer label
      //       color: [23, 184, 190],
      //       columns: {
      //         lat: 'Latitude', // latitude title in csv
      //         lng: 'Longitude' // longitude title in csv
      //       },
      //       isVisible: true,
      //       visConfig: {
      //         opacity: 0.2,
      //         worldUnitSize: 0.01, // controls how fine the hexagon grid is
      //         resolution: 0.001,
      //         colorRange: {
      //           name: 'ColorBrewer GnBu-6',
      //           type: 'sequential',
      //           category: 'ColorBrewer',
      //           colors: ['#f0f9e8', '#ccebc5', '#a8ddb5', '#7bccc4', '#43a2ca', '#0868ac'],
      //           reversed: false
      //         },
      //         coverage: 1, // Change what portion of each grid cell is covered by a color square. https://docs.kepler.gl/docs/user-guides/d-layer-attributes
      //         sizeRange: [0, 4],
      //         percentile: [0, 100],
      //         elevationPercentile: [0, 100],
      //         elevationScale: 1,
      //         'hi-precision': true,
      //         colorAggregation: 'average',
      //         sizeAggregation: 'average',
      //         enable3d: true
      //       }
      //     },
      //     visualChannels: {
      //       colorField: null,
      //       colorScale: 'exponential', // can make exponential, quantile, linear
      //       sizeField: null,
      //       sizeScale: 'linear'
      //     }
      //   },

      //   sample for heat map layer
      //   {
      //     id: 'heatmap_layer',
      //     type: 'heatmap',
      //     config: {
      //       dataId: 'tree_data',
      //       label: 'Tree VWC',
      //       columns: {lat: 'Lat', lng: 'Lon'},
      //       isVisible: true,
      //       visConfig: {
      //         opacity: 0.8,
      //         colorRange: {
      //           name: 'Greenness',
      //           type: 'sequential',
      //           category: 'Trees',
      //           colors: ['#ffffff', '#b3ffb3', '#66ff66', '#1aff1a', '#00cc00', '#008000']
      //         },
      //         radius: 20
      //       }
      //     },
      //     visualChannels: {
      //       // colorField: {
      //       // name: 'value',
      //       // type: 'string'
      //       // },
      //       weightField: 'VWC', 
      //       weightScale: 'linear'
      //     }
      //   }
      // ],
        {
          id: 'heatmap_layer', // TEMPERATURE
          type: 'heatmap',
          config: {
            dataId: 'tree_data', // dataset
            label: 'Temperature', // layer name
            columns: {lat: 'Lat', lng: 'Lon'},
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              colorRange: {
                name: 'Temperature',
                type: 'sequential',
                category: 'Data Viz',
                colors: ['#dc143c', '#fd5e53', '#faf0be', '#1aff1a', '#e7feff', '#87cefa']
              },
              reversed: true,
              colorAggregation: 'average',
              radius: 20
            }
          },
          visualChannels: {
            colorField: {
              name: 'Temp',
              type: 'real'
            },
            colorScale: 'exponential',
            weightField: 'Temp', 
            weightScale: 'exponential'
          }
        }  
      ],

      // control which filters are visible here
      // filters: [
      //   {
      //     id:'timerange_slider',
      //     dataId: 'uav_data', // dataset ID
      //     name:'timestamp', // field to filter on
      //     type:'timeRange',
      //     plotType: 'histogram',
      //     enlarged: true
      //   },
      //   {
      //     id:'timerange_slider',
      //     dataId: 'tree_data', // dataset ID
      //     name:'timestamp', // field to filter on
      //     type:'timeRange',
      //     plotType: 'histogram',
      //     enlarged: true
      //   },
      //   // can add more after this
      // ], 

      // control which datasets can be interacted with here (only)
      interactionConfig: {
        tooltip: {
          fieldsToShow: {uav_data: ['value', 'Latitude', 'Longitude', 'timestamp']},
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        tooltip: {
          fieldsToShow: {tree_data: ['Tree_type', 'VWC', 'Temp', 'Lat', 'Lon', 'timestamp']},
          compareMode: false,
          compareType: 'absolute',
          enabled: true 
        }
      },
    },

    // mapStyle: {styleType: 'satellite'},
    mapStyle: {
      styleType: 'terrain',
      mapStyles: {
        terrain: {
          id: 'terrain',
          label: 'Outdoor',
          url: 'https://api.maptiler.com/maps/outdoor/style.json?key=ySQ0fIYn7eSl3ppOeEJd',
          icon: 'https://openmaptiles.org/img/styles/terrain.jpg',
          layerGroups: [
            {
              slug: 'label',
              filter: ({id}) => id.match(/(?=(label|place-|poi-))/),
              defaultVisibility: true
            },
            {
              slug: 'road',
              filter: ({id}) => id.match(/(?=(road|railway|tunnel|street|bridge))(?!.*label)/),
              defaultVisibility: true
            },
            {
              slug: 'terrain',
              filter: ({id}) => id.match(/(?=(hillshade))/),
              defaultVisibility: true
            },
            {
              slug: 'building',
              filter: ({id}) => id.match(/building/),
              defaultVisibility: true
            }
          ]
        }
      }
    },
    // initial map state
    mapState: {
      bearing: 0,
      dragRotate: false,
      latitude: 49.26434054538508,
      longitude: -123.24357677358684,
      pitch: 0,
      zoom: 13,
      isSplit: false
    }
  }
};

export default config;