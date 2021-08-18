export const config = {
  version: 'v1',
  config: {
    visState: {
      // add or manipulate layers here
      layers: [
        {
          type: 'heatmap_layer',
          id: 'UAV Data Heatmap',
          config: {
            dataId: 'uav_data',
            label: 'Heatmap',
            columns: {lat: 'Latitude', lng: 'Longitude'},
            isVisible: true,
            visConfig: {
              opacity: 0.8,
              colorRange: {
                name: 'Greenness',
                type: 'sequential',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
              },
              radius: 20
            }
          },
          visualChannels: {weightField: null, weightScale: 'exponential'},
        }
        ,
        {
          type: 'point',
          id: 'point_layer',
          config: {
            dataId: 'tree_data',
            label: 'Trees',
            color: [69, 138, 70],
            columns: {lat: 'Location_latitude', lng: 'Location_longitude', altitude: null},
            isVisible: true
          },
          visualChannels: {
            sizeField: {name: 'Plan', type: 'integer'}
          }
        }
        ,
        // {
        //   id: 'heatmap_layer',
        //   type: 'heatmap',
        //   config: {
        //     dataId: 'tree_data',
        //     label: 'Heatmap',
        //     columns: {lat: 'Location_latitude', lng: 'Location_longitude'},
        //     isVisible: true,
        //     visConfig: {
        //       opacity: 0.8,
        //       colorRange: {
        //         name: 'Global Warming',
        //         type: 'sequential',
        //         category: 'Uber',
        //         colors: ['#5A1846', '#900C3F', '#C70039', '#E3611C', '#F1920E', '#FFC300']
        //       },
        //       radius: 46.4
        //     }
        //   },
        //   visualChannels: {weightField: null, weightScale: 'linear'}
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
          enlarged: true
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
          fieldsToShow: {uav_data: []},
          compareMode: false,
          compareType: 'absolute',
          enabled: true
        },
        tooltip: {
          fieldsToShow: {tree_data: []},
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