export const config = {
  version: 'v1',
  config: {
    visState: {
      // add or manipulate layers here
      layers: [

        // UAV DATA VISUALIZATIONS: 
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
              opacity: 0.007,
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
            // UNCOMMENT THE FOLLOWING TO HAVE THE POINT SIZES CHANGE DEPENDING ON THE VALUES
            // sizeField: {
            //   name: 'value',
            //   type: 'real'
            // },
            // sizeScale: 'exponential'
          }
        },

        // TREE SENSOR DATA VISUALIZATIONS: 
        {
          type: 'point', // TEMPERATURE POINTS
          config: {
            dataId: 'tree_data',
            columns: {
              lat: 'Lat',
              lng: 'Lon'
            },
            color: [255, 0, 0],
            label: 'Temperature',
            isVisible: true,
            visConfig: {
              radius: 10,
              fixedRadius: false,
              opacity: 0.0001,
              outline: false,
              thickness: 2,
              radiusRange: [15, 20],
              'hi-precision': true,
              opacity: 0.0001, // has to be very low since there is a point for each data point
              worldUnitSize: 0.01, // controls how fine the grid is
              resolution: 0.01,
              colorRange: {
                name: 'Red-Orange Temperature',
                type: 'sequential',
                category: 'Temperature',
                colors: ['#FF7B2E','#F96815', '#BD3A02', '#E34602', '#FE0C0A', '#E62B09', '#BD3A02', '#B52838', '#751A24'],
                reversed: false
              },
            },
            coverage: 1, // Change what portion of each grid cell is covered by a color square. https://docs.kepler.gl/docs/user-guides/d-layer-attributes
          },
          visualChannels: {
            colorField: {
              name: 'Temp',
              type: 'real'
            }
            , 
            sizeField: {
              name: 'Temp',
              type: 'real'
            }
            ,
            sizeScale: 'linear'
          }
        },

        {
          type: 'point', // VWC POINTS
          config: {
            dataId: 'tree_data',
            columns: {
              lat: 'Lat',
              lng: 'Lon'
            },
            color: [255, 0, 0],
            label: 'Volumetric Water Content',
            isVisible: true,
            visConfig: {
              radius: 10,
              fixedRadius: false,
              opacity: 0.001,
              outline: false,
              thickness: 2,
              colorRange: {
                name: 'Water',
                type: 'sequential',
                category: 'VWC',
                colors: ['#EBF5FB ', '#AED6F1 ', '#5DADE2', '#2E86C1', '#21618C', '#1B4F72'],
                reversed: true
              },
              radiusRange: [5, 10],
              'hi-precision': true,
            }
          },
          visualChannels: {
            colorField: {
              name: 'Temp',
              type: 'real'
            }
            , 
            sizeField: {
              name: 'Temp',
              type: 'real'
            }
            ,
            sizeScale: 'linear',
          }
        }  

  // SOME SAMPLE LAYER CONFIGS
        // {
        //   type: 'point', // TREE TYPE POINTS
        //   config: {
        //     dataId: 'tree_data',
        //     columns: {
        //       lat: 'Lat',
        //       lng: 'Lon'
        //     },
        //     color: [255, 0, 0],
        //     label: 'Tree type',
        //     isVisible: true,
        //     visConfig: {
        //       colorRange: {
        //         colorMap: [ // map colours to tree types (HTML)
        //           ['NorthernRedOak_FairView', '#e03c31'],
        //           ['NorthernRedOak_Kaiser', '#be4f62'],
        //           ['PinOak', '#008000'],
        //           ['WesternRedCedar', '#a52a2a']
        //         ]
        //       },
        //     }
        //   },
        //   visualChannels: {
        //     colorField: {
        //       name: 'Tree_type',
        //       type: 'string'
        //     }
        //     // , 
        //     // sizeField: {
        //     //   name: 'VWC',
        //     //   type: 'real'
        //     // }
        //     // ,
        //     // sizeScale: 'linear'
        //   }
        // } 
        
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
         
        // ,
        // {
        //   id: 'heatmap_layer', // TEMPERATURE
        //   type: 'heatmap',
        //   config: {
        //     dataId: 'tree_data', // dataset
        //     label: 'Temperature', // layer name
        //     columns: {lat: 'Lat', lng: 'Lon'},
        //     isVisible: true,
        //     visConfig: {
        //       opacity: 0.9,
        //       colorRange: {
        //         name: 'Global Warming',
        //         type: 'sequential',
        //         category: 'Uber',
        //         colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
        //       },
        //       reversed: true,
        //       colorAggregation: 'average',
        //       radius: 20
        //     }
        //   },
        //   visualChannels: {
        //     colorField: {
        //       name: 'Temp',
        //       type: 'real'
        //     },
        //     colorScale: 'exponential',
        //     weightField: 'Temp', 
        //     weightScale: 'exponential'
        //   }
        // }  
      ],

      // control which filters are visible here
      filters: [
        {
          id:'timerange_slider',
          dataId: 'uav_data', // dataset ID
          name:'timestamp', // field to filter on
          type:'timeRange',
          plotType: 'histogram',
          enlarged: false
        },
        {
          id:'timerange_slider',
          dataId: 'tree_data', // dataset ID
          name:'timestamp', // field to filter on
          type:'timeRange',
          plotType: 'histogram',
          enlarged: true
        },
        // can add more after this
      ], 

      // control which datasets can be interacted with here (only)
      interactionConfig: {
        tooltip: {
          fieldsToShow: {uav_data: ['value', 'timestamp']},
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        tooltip: {
          fieldsToShow: {tree_data: ['Tree_type', 'VWC', 'Temp', 'timestamp']},
          compareMode: false,
          compareType: 'absolute',
          enabled: true 
        },
        layerBlending: 'normal' // https://docs.kepler.gl/docs/user-guides/b-kepler-gl-workflow/add-data-to-layers/d-blend-and-rearrange-layers
      },
    },

    // mapStyle: {styleType: 'satellite'}, // another map type option
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