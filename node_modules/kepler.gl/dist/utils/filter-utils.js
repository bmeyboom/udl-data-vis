"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultFilter = getDefaultFilter;
exports.shouldApplyFilter = shouldApplyFilter;
exports.validatePolygonFilter = validatePolygonFilter;
exports.validateFilter = validateFilter;
exports.validateFilterWithData = validateFilterWithData;
exports.getFilterProps = getFilterProps;
exports.getFilterFunction = getFilterFunction;
exports.updateFilterDataId = updateFilterDataId;
exports.filterDataByFilterTypes = filterDataByFilterTypes;
exports.getFilterRecord = getFilterRecord;
exports.diffFilters = diffFilters;
exports.adjustValueToFilterDomain = adjustValueToFilterDomain;
exports.getNumericFieldDomain = getNumericFieldDomain;
exports.getNumericStepSize = getNumericStepSize;
exports.getTimestampFieldDomain = getTimestampFieldDomain;
exports.histogramConstruct = histogramConstruct;
exports.getHistogram = getHistogram;
exports.formatNumberByStep = formatNumberByStep;
exports.isInRange = isInRange;
exports.isInPolygon = isInPolygon;
exports.isValidTimeDomain = isValidTimeDomain;
exports.getTimeWidgetTitleFormatter = getTimeWidgetTitleFormatter;
exports.getTimeWidgetHintFormatter = getTimeWidgetHintFormatter;
exports.isValidFilterValue = isValidFilterValue;
exports.getFilterPlot = getFilterPlot;
exports.getDefaultFilterPlotType = getDefaultFilterPlotType;
exports.applyFiltersToDatasets = applyFiltersToDatasets;
exports.applyFilterFieldName = applyFilterFieldName;
exports.mergeFilterDomainStep = mergeFilterDomainStep;
exports.generatePolygonFilter = generatePolygonFilter;
exports.filterDatasetCPU = filterDatasetCPU;
exports.validateFiltersUpdateDatasets = validateFiltersUpdateDatasets;
exports.getIntervalBins = getIntervalBins;
exports.getFilterIdInFeature = exports.featureToFilterValue = exports.getPolygonFilterFunctor = exports.LAYER_FILTERS = exports.FILTER_ID_LENGTH = exports.DEFAULT_FILTER_STRUCTURE = exports.FILTER_COMPONENTS = exports.LIMITED_FILTER_EFFECT_PROPS = exports.FILTER_UPDATER_PROPS = exports.PLOT_TYPES = exports.enlargedHistogramBins = exports.histogramBins = exports.TimestampStepMap = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _d3Array = require("d3-array");

var _keymirror = _interopRequireDefault(require("keymirror"));

var _console = require("global/console");

var _lodash = _interopRequireDefault(require("lodash.get"));

var _lodash2 = _interopRequireDefault(require("lodash.isequal"));

var _booleanWithin = _interopRequireDefault(require("@turf/boolean-within"));

var _helpers = require("@turf/helpers");

var _decimal = require("decimal.js");

var _defaultSettings = require("../constants/default-settings");

var _dataUtils = require("./data-utils");

var ScaleUtils = _interopRequireWildcard(require("./data-scale-utils"));

var _types = require("../layers/types");

var _utils = require("./utils");

var _h3Utils = require("../layers/h3-hexagon-layer/h3-utils");

var _FILTER_TYPES$timeRan, _FILTER_TYPES$range, _SupportedPlotType, _FILTER_COMPONENTS;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// TYPE

/** @typedef {import('./table-utils/kepler-table').FilterRecord} FilterRecord */

/** @typedef {import('./filter-utils').FilterResult} FilterResult */
var TimestampStepMap = [{
  max: 1,
  step: 0.05
}, {
  max: 10,
  step: 0.1
}, {
  max: 100,
  step: 1
}, {
  max: 500,
  step: 5
}, {
  max: 1000,
  step: 10
}, {
  max: 5000,
  step: 50
}, {
  max: Number.POSITIVE_INFINITY,
  step: 1000
}];
exports.TimestampStepMap = TimestampStepMap;
var histogramBins = 30;
exports.histogramBins = histogramBins;
var enlargedHistogramBins = 100;
exports.enlargedHistogramBins = enlargedHistogramBins;
var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationYear = durationDay * 365;
var PLOT_TYPES = (0, _keymirror["default"])({
  histogram: null,
  lineChart: null
});
exports.PLOT_TYPES = PLOT_TYPES;
var FILTER_UPDATER_PROPS = (0, _keymirror["default"])({
  dataId: null,
  name: null,
  layerId: null
});
exports.FILTER_UPDATER_PROPS = FILTER_UPDATER_PROPS;
var LIMITED_FILTER_EFFECT_PROPS = (0, _keymirror["default"])((0, _defineProperty2["default"])({}, FILTER_UPDATER_PROPS.name, null));
/**
 * Max number of filter value buffers that deck.gl provides
 */

exports.LIMITED_FILTER_EFFECT_PROPS = LIMITED_FILTER_EFFECT_PROPS;
var SupportedPlotType = (_SupportedPlotType = {}, (0, _defineProperty2["default"])(_SupportedPlotType, _defaultSettings.FILTER_TYPES.timeRange, (_FILTER_TYPES$timeRan = {
  "default": 'histogram'
}, (0, _defineProperty2["default"])(_FILTER_TYPES$timeRan, _defaultSettings.ALL_FIELD_TYPES.integer, 'lineChart'), (0, _defineProperty2["default"])(_FILTER_TYPES$timeRan, _defaultSettings.ALL_FIELD_TYPES.real, 'lineChart'), _FILTER_TYPES$timeRan)), (0, _defineProperty2["default"])(_SupportedPlotType, _defaultSettings.FILTER_TYPES.range, (_FILTER_TYPES$range = {
  "default": 'histogram'
}, (0, _defineProperty2["default"])(_FILTER_TYPES$range, _defaultSettings.ALL_FIELD_TYPES.integer, 'lineChart'), (0, _defineProperty2["default"])(_FILTER_TYPES$range, _defaultSettings.ALL_FIELD_TYPES.real, 'lineChart'), _FILTER_TYPES$range)), _SupportedPlotType);
var FILTER_COMPONENTS = (_FILTER_COMPONENTS = {}, (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.select, 'SingleSelectFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.multiSelect, 'MultiSelectFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.timeRange, 'TimeRangeFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.range, 'RangeFilter'), (0, _defineProperty2["default"])(_FILTER_COMPONENTS, _defaultSettings.FILTER_TYPES.polygon, 'PolygonFilter'), _FILTER_COMPONENTS);
exports.FILTER_COMPONENTS = FILTER_COMPONENTS;
var DEFAULT_FILTER_STRUCTURE = {
  dataId: [],
  // [string]
  freeze: false,
  id: null,
  // time range filter specific
  fixedDomain: false,
  enlarged: false,
  isAnimating: false,
  animationWindow: _defaultSettings.ANIMATION_WINDOW.free,
  speed: 1,
  // field specific
  name: [],
  // string
  type: null,
  fieldIdx: [],
  // [integer]
  domain: null,
  value: null,
  // plot
  plotType: PLOT_TYPES.histogram,
  yAxis: null,
  interval: null,
  // mode
  gpu: false
};
exports.DEFAULT_FILTER_STRUCTURE = DEFAULT_FILTER_STRUCTURE;
var FILTER_ID_LENGTH = 4;
exports.FILTER_ID_LENGTH = FILTER_ID_LENGTH;
var LAYER_FILTERS = [_defaultSettings.FILTER_TYPES.polygon];
/**
 * Generates a filter with a dataset id as dataId
 * @type {typeof import('./filter-utils').getDefaultFilter}
 */

exports.LAYER_FILTERS = LAYER_FILTERS;

function getDefaultFilter(dataId) {
  return _objectSpread(_objectSpread({}, DEFAULT_FILTER_STRUCTURE), {}, {
    // store it as dataId and it could be one or many
    dataId: (0, _utils.toArray)(dataId),
    id: (0, _utils.generateHashId)(FILTER_ID_LENGTH)
  });
}
/**
 * Check if a filter is valid based on the given dataId
 * @param  filter to validate
 * @param  datasetId id to validate filter against
 * @return true if a filter is valid, false otherwise
 * @type {typeof import('./filter-utils').shouldApplyFilter}
 */


function shouldApplyFilter(filter, datasetId) {
  var dataIds = (0, _utils.toArray)(filter.dataId);
  return dataIds.includes(datasetId) && filter.value !== null;
}
/**
 * Validates and modifies polygon filter structure
 * @param dataset
 * @param filter
 * @param layers
 * @return - {filter, dataset}
 * @type {typeof import('./filter-utils').validatePolygonFilter}
 */


function validatePolygonFilter(dataset, filter, layers) {
  var failed = {
    dataset: dataset,
    filter: null
  };
  var value = filter.value,
      layerId = filter.layerId,
      type = filter.type,
      dataId = filter.dataId;

  if (!layerId || !isValidFilterValue(type, value)) {
    return failed;
  }

  var isValidDataset = dataId.includes(dataset.id);

  if (!isValidDataset) {
    return failed;
  }

  var layer = layers.find(function (l) {
    return layerId.includes(l.id);
  });

  if (!layer) {
    return failed;
  }

  return {
    filter: _objectSpread(_objectSpread({}, filter), {}, {
      freeze: true,
      fieldIdx: []
    }),
    dataset: dataset
  };
}
/**
 * Custom filter validators
 */


var filterValidators = (0, _defineProperty2["default"])({}, _defaultSettings.FILTER_TYPES.polygon, validatePolygonFilter);
/**
 * Default validate filter function
 * @param dataset
 * @param filter
 * @return - {filter, dataset}
 * @type {typeof import('./filter-utils').validateFilter}
 */

function validateFilter(dataset, filter) {
  // match filter.dataId
  var failed = {
    dataset: dataset,
    filter: null
  };
  var filterDataId = (0, _utils.toArray)(filter.dataId);
  var filterDatasetIndex = filterDataId.indexOf(dataset.id);

  if (filterDatasetIndex < 0) {
    // the current filter is not mapped against the current dataset
    return failed;
  }

  var initializeFilter = _objectSpread(_objectSpread(_objectSpread({}, getDefaultFilter(filter.dataId)), filter), {}, {
    dataId: filterDataId,
    name: (0, _utils.toArray)(filter.name)
  });

  var fieldName = initializeFilter.name[filterDatasetIndex];

  var _applyFilterFieldName = applyFilterFieldName(initializeFilter, dataset, fieldName, filterDatasetIndex, {
    mergeDomain: true
  }),
      updatedFilter = _applyFilterFieldName.filter,
      updatedDataset = _applyFilterFieldName.dataset;

  if (!updatedFilter) {
    return failed;
  }

  updatedFilter.value = adjustValueToFilterDomain(filter.value, updatedFilter);
  updatedFilter.enlarged = typeof filter.enlarged === 'boolean' ? filter.enlarged : updatedFilter.enlarged;

  if (updatedFilter.value === null) {
    // cannot adjust saved value to filter
    return failed;
  }

  return {
    filter: validateFilterYAxis(updatedFilter, updatedDataset),
    dataset: updatedDataset
  };
}
/**
 * Validate saved filter config with new data,
 * calculate domain and fieldIdx based new fields and data
 *
 * @param dataset
 * @param filter - filter to be validate
 * @param layers - layers
 * @return validated filter
 * @type {typeof import('./filter-utils').validateFilterWithData}
 */


function validateFilterWithData(dataset, filter, layers) {
  // @ts-ignore
  return filterValidators.hasOwnProperty(filter.type) ? filterValidators[filter.type](dataset, filter, layers) : validateFilter(dataset, filter);
}
/**
 * Validate YAxis
 * @param filter
 * @param dataset
 * @return {*}
 */


function validateFilterYAxis(filter, dataset) {
  // TODO: validate yAxis against other datasets
  var fields = dataset.fields;
  var _filter = filter,
      yAxis = _filter.yAxis; // TODO: validate yAxis against other datasets

  if (yAxis) {
    var matchedAxis = fields.find(function (_ref) {
      var name = _ref.name,
          type = _ref.type;
      return name === yAxis.name && type === yAxis.type;
    });
    filter = matchedAxis ? _objectSpread(_objectSpread({}, filter), {}, {
      yAxis: matchedAxis
    }, getFilterPlot(_objectSpread(_objectSpread({}, filter), {}, {
      yAxis: matchedAxis
    }), dataset)) : filter;
  }

  return filter;
}
/**
 * Get default filter prop based on field type
 *
 * @param field
 * @param fieldDomain
 * @returns default filter
 * @type {typeof import('./filter-utils').getFilterProps}
 */


function getFilterProps(field, fieldDomain) {
  var filterProps = _objectSpread(_objectSpread({}, fieldDomain), {}, {
    fieldType: field.type
  });

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        value: fieldDomain.domain,
        type: _defaultSettings.FILTER_TYPES.range,
        typeOptions: [_defaultSettings.FILTER_TYPES.range],
        gpu: true
      });

    case _defaultSettings.ALL_FIELD_TYPES["boolean"]:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        type: _defaultSettings.FILTER_TYPES.select,
        value: true,
        gpu: false
      });

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        type: _defaultSettings.FILTER_TYPES.multiSelect,
        value: [],
        gpu: false
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      return _objectSpread(_objectSpread({}, filterProps), {}, {
        type: _defaultSettings.FILTER_TYPES.timeRange,
        enlarged: true,
        fixedDomain: true,
        value: filterProps.domain,
        gpu: true
      });

    default:
      return {};
  }
}

var getPolygonFilterFunctor = function getPolygonFilterFunctor(layer, filter) {
  var getPosition = layer.getPositionAccessor();

  switch (layer.type) {
    case _types.LAYER_TYPES.point:
    case _types.LAYER_TYPES.icon:
      return function (data) {
        var pos = getPosition({
          data: data
        });
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };

    case _types.LAYER_TYPES.arc:
    case _types.LAYER_TYPES.line:
      return function (data) {
        var pos = getPosition({
          data: data
        });
        return pos.every(Number.isFinite) && [[pos[0], pos[1]], [pos[3], pos[4]]].every(function (point) {
          return isInPolygon(point, filter.value);
        });
      };

    case _types.LAYER_TYPES.hexagonId:
      if (layer.dataToFeature && layer.dataToFeature.centroids) {
        return function (data, index) {
          // null or getCentroid({id})
          var centroid = layer.dataToFeature.centroids[index];
          return centroid && isInPolygon(centroid, filter.value);
        };
      }

      return function (data) {
        var id = getPosition({
          data: data
        });

        if (!(0, _h3Utils.h3IsValid)(id)) {
          return false;
        }

        var pos = (0, _h3Utils.getCentroid)({
          id: id
        });
        return pos.every(Number.isFinite) && isInPolygon(pos, filter.value);
      };

    default:
      return function () {
        return true;
      };
  }
};
/**
 * @param field dataset Field
 * @param dataId Dataset id
 * @param filter Filter object
 * @param layers list of layers to filter upon
 * @return filterFunction
 * @type {typeof import('./filter-utils').getFilterFunction}
 */


exports.getPolygonFilterFunctor = getPolygonFilterFunctor;

function getFilterFunction(field, dataId, filter, layers) {
  // field could be null in polygon filter
  var valueAccessor = field ? field.valueAccessor : function (data) {
    return null;
  };

  var defaultFunc = function defaultFunc(d) {
    return true;
  };

  switch (filter.type) {
    case _defaultSettings.FILTER_TYPES.range:
      return function (data) {
        return isInRange(valueAccessor(data), filter.value);
      };

    case _defaultSettings.FILTER_TYPES.multiSelect:
      return function (data) {
        return filter.value.includes(valueAccessor(data));
      };

    case _defaultSettings.FILTER_TYPES.select:
      return function (data) {
        return valueAccessor(data) === filter.value;
      };

    case _defaultSettings.FILTER_TYPES.timeRange:
      if (!field) {
        return defaultFunc;
      }

      var mappedValue = (0, _lodash["default"])(field, ['filterProps', 'mappedValue']);
      var accessor = Array.isArray(mappedValue) ? function (data, index) {
        return mappedValue[index];
      } : function (data) {
        return (0, _dataUtils.timeToUnixMilli)(valueAccessor(data), field.format);
      };
      return function (data, index) {
        return isInRange(accessor(data, index), filter.value);
      };

    case _defaultSettings.FILTER_TYPES.polygon:
      if (!layers || !layers.length) {
        return defaultFunc;
      } // @ts-ignore


      var layerFilterFunctions = filter.layerId.map(function (id) {
        return layers.find(function (l) {
          return l.id === id;
        });
      }).filter(function (l) {
        return l && l.config.dataId === dataId;
      }).map(function (layer) {
        return getPolygonFilterFunctor(layer, filter);
      });
      return function (data, index) {
        return layerFilterFunctions.every(function (filterFunc) {
          return filterFunc(data, index);
        });
      };

    default:
      return defaultFunc;
  }
}

function updateFilterDataId(dataId) {
  return getDefaultFilter(dataId);
}
/**
 * @type {typeof import('./filter-utils').filterDataByFilterTypes}
 */


function filterDataByFilterTypes(_ref2, allData) {
  var dynamicDomainFilters = _ref2.dynamicDomainFilters,
      cpuFilters = _ref2.cpuFilters,
      filterFuncs = _ref2.filterFuncs;

  var result = _objectSpread(_objectSpread({}, dynamicDomainFilters ? {
    filteredIndexForDomain: []
  } : {}), cpuFilters ? {
    filteredIndex: []
  } : {});

  var _loop = function _loop(i) {
    var d = allData[i];
    var matchForDomain = dynamicDomainFilters && dynamicDomainFilters.every(function (filter) {
      return filterFuncs[filter.id](d, i);
    });

    if (matchForDomain) {
      // @ts-ignore
      result.filteredIndexForDomain.push(i);
    }

    var matchForRender = cpuFilters && cpuFilters.every(function (filter) {
      return filterFuncs[filter.id](d, i);
    });

    if (matchForRender) {
      // @ts-ignore
      result.filteredIndex.push(i);
    }
  };

  for (var i = 0; i < allData.length; i++) {
    _loop(i);
  }

  return result;
}
/**
 * Get a record of filters based on domain type and gpu / cpu
 * @type {typeof import('./filter-utils').getFilterRecord}
 */


function getFilterRecord(dataId, filters) {
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  /**
   * @type {FilterRecord}
   */
  var filterRecord = {
    dynamicDomain: [],
    fixedDomain: [],
    cpu: [],
    gpu: []
  };
  filters.forEach(function (f) {
    if (isValidFilterValue(f.type, f.value) && (0, _utils.toArray)(f.dataId).includes(dataId)) {
      (f.fixedDomain || opt.ignoreDomain ? filterRecord.fixedDomain : filterRecord.dynamicDomain).push(f);
      (f.gpu && !opt.cpuOnly ? filterRecord.gpu : filterRecord.cpu).push(f);
    }
  });
  return filterRecord;
}
/**
 * Compare filter records to get what has changed
 * @type {typeof import('./filter-utils').diffFilters}
 */


function diffFilters(filterRecord) {
  var oldFilterRecord = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var filterChanged = {};
  Object.entries(filterRecord).forEach(function (_ref3) {
    var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
        record = _ref4[0],
        items = _ref4[1];

    items.forEach(function (filter) {
      var oldFilter = (oldFilterRecord[record] || []).find(function (f) {
        return f.id === filter.id;
      });

      if (!oldFilter) {
        // added
        filterChanged = (0, _utils.set)([record, filter.id], 'added', filterChanged);
      } else {
        // check  what has changed
        ['name', 'value', 'dataId'].forEach(function (prop) {
          if (filter[prop] !== oldFilter[prop]) {
            filterChanged = (0, _utils.set)([record, filter.id], "".concat(prop, "_changed"), filterChanged);
          }
        });
      }
    });
    (oldFilterRecord[record] || []).forEach(function (oldFilter) {
      // deleted
      if (!items.find(function (f) {
        return f.id === oldFilter.id;
      })) {
        filterChanged = (0, _utils.set)([record, oldFilter.id], 'deleted', filterChanged);
      }
    });

    if (!filterChanged[record]) {
      filterChanged[record] = null;
    }
  }); // @ts-ignore

  return filterChanged;
}
/**
 * Call by parsing filters from URL
 * Check if value of filter within filter domain, if not adjust it to match
 * filter domain
 *
 * @type {typeof import('./filter-utils').adjustValueToFilterDomain}
 * @returns value - adjusted value to match filter or null to remove filter
 */

/* eslint-disable complexity */


function adjustValueToFilterDomain(value, _ref5) {
  var domain = _ref5.domain,
      type = _ref5.type;

  if (!domain || !type) {
    return false;
  }

  switch (type) {
    case _defaultSettings.FILTER_TYPES.range:
    case _defaultSettings.FILTER_TYPES.timeRange:
      if (!Array.isArray(value) || value.length !== 2) {
        return domain.map(function (d) {
          return d;
        });
      }

      return value.map(function (d, i) {
        return (0, _dataUtils.notNullorUndefined)(d) && isInRange(d, domain) ? d : domain[i];
      });

    case _defaultSettings.FILTER_TYPES.multiSelect:
      if (!Array.isArray(value)) {
        return [];
      }

      var filteredValue = value.filter(function (d) {
        return domain.includes(d);
      });
      return filteredValue.length ? filteredValue : [];

    case _defaultSettings.FILTER_TYPES.select:
      return domain.includes(value) ? value : true;

    default:
      return null;
  }
}
/* eslint-enable complexity */

/**
 * Calculate numeric domain and suitable step
 *
 * @type {typeof import('./filter-utils').getNumericFieldDomain}
 */


function getNumericFieldDomain(data, valueAccessor) {
  var domain = [0, 1];
  var step = 0.1;
  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];

  if (Array.isArray(data) && data.length > 1) {
    domain = ScaleUtils.getLinearDomain(mappedValue);
    var diff = domain[1] - domain[0]; // in case equal domain, [96, 96], which will break quantize scale

    if (!diff) {
      domain[1] = domain[0] + 1;
    }

    step = getNumericStepSize(diff) || step;
    domain[0] = formatNumberByStep(domain[0], step, 'floor');
    domain[1] = formatNumberByStep(domain[1], step, 'ceil');
  } // @ts-ignore


  var _getHistogram = getHistogram(domain, mappedValue),
      histogram = _getHistogram.histogram,
      enlargedHistogram = _getHistogram.enlargedHistogram;

  return {
    domain: domain,
    step: step,
    histogram: histogram,
    enlargedHistogram: enlargedHistogram
  };
}
/**
 * Calculate step size for range and timerange filter
 *
 * @type {typeof import('./filter-utils').getNumericStepSize}
 */


function getNumericStepSize(diff) {
  diff = Math.abs(diff);

  if (diff > 100) {
    return 1;
  } else if (diff > 3) {
    return 0.01;
  } else if (diff > 1) {
    return 0.001;
  } // Try to get at least 1000 steps - and keep the step size below that of
  // the (diff > 1) case.


  var x = diff / 1000; // Find the exponent and truncate to 10 to the power of that exponent

  var exponentialForm = x.toExponential();
  var exponent = parseFloat(exponentialForm.split('e')[1]); // Getting ready for node 12
  // this is why we need decimal.js
  // Math.pow(10, -5) = 0.000009999999999999999
  // the above result shows in browser and node 10
  // node 12 behaves correctly

  return new _decimal.Decimal(10).pow(exponent).toNumber();
}
/**
 * Calculate timestamp domain and suitable step
 *
 * @type {typeof import('./filter-utils').getTimestampFieldDomain}
 */


function getTimestampFieldDomain(data, valueAccessor) {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain
  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];
  var domain = ScaleUtils.getLinearDomain(mappedValue);
  var defaultTimeFormat = getTimeWidgetTitleFormatter(domain);
  var step = 0.01;
  var diff = domain[1] - domain[0];
  var entry = TimestampStepMap.find(function (f) {
    return f.max >= diff;
  });

  if (entry) {
    step = entry.step;
  }

  var _getHistogram2 = getHistogram(domain, mappedValue),
      histogram = _getHistogram2.histogram,
      enlargedHistogram = _getHistogram2.enlargedHistogram;

  return {
    domain: domain,
    step: step,
    mappedValue: mappedValue,
    histogram: histogram,
    enlargedHistogram: enlargedHistogram,
    defaultTimeFormat: defaultTimeFormat
  };
}
/**
 *
 * @type {typeof import('./filter-utils').histogramConstruct}
 */


function histogramConstruct(domain, mappedValue, bins) {
  return (0, _d3Array.histogram)().thresholds((0, _d3Array.ticks)(domain[0], domain[1], bins)).domain(domain)(mappedValue).map(function (bin) {
    return {
      count: bin.length,
      x0: bin.x0,
      x1: bin.x1
    };
  });
}
/**
 * Calculate histogram from domain and array of values
 *
 * @type {typeof import('./filter-utils').getHistogram}
 */


function getHistogram(domain, mappedValue) {
  var histogram = histogramConstruct(domain, mappedValue, histogramBins);
  var enlargedHistogram = histogramConstruct(domain, mappedValue, enlargedHistogramBins);
  return {
    histogram: histogram,
    enlargedHistogram: enlargedHistogram
  };
}
/**
 * round number based on step
 *
 * @param {Number} val
 * @param {Number} step
 * @param {string} bound
 * @returns {Number} rounded number
 */


function formatNumberByStep(val, step, bound) {
  if (bound === 'floor') {
    return Math.floor(val * (1 / step)) / (1 / step);
  }

  return Math.ceil(val * (1 / step)) / (1 / step);
}
/**
 *
 * @type {typeof import('./filter-utils').isInRange}
 */


function isInRange(val, domain) {
  if (!Array.isArray(domain)) {
    return false;
  }

  return val >= domain[0] && val <= domain[1];
}
/**
 * Determines whether a point is within the provided polygon
 *
 * @param point as input search [lat, lng]
 * @param polygon Points must be within these (Multi)Polygon(s)
 * @return {boolean}
 */


function isInPolygon(point, polygon) {
  return (0, _booleanWithin["default"])((0, _helpers.point)(point), polygon);
}

function isValidTimeDomain(domain) {
  return Array.isArray(domain) && domain.every(Number.isFinite);
}

function getTimeWidgetTitleFormatter(domain) {
  if (!isValidTimeDomain(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0]; // Local aware formats
  // https://momentjs.com/docs/#/parsing/string-format

  return diff > durationYear ? 'L' : diff > durationDay ? 'L LT' : 'L LTS';
}

function getTimeWidgetHintFormatter(domain) {
  if (!isValidTimeDomain(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationWeek ? 'L' : diff > durationDay ? 'L LT' : diff > durationHour ? 'LT' : 'LTS';
}
/**
 * Sanity check on filters to prepare for save
 * @type {typeof import('./filter-utils').isValidFilterValue}
 */

/* eslint-disable complexity */


function isValidFilterValue(type, value) {
  if (!type) {
    return false;
  }

  switch (type) {
    case _defaultSettings.FILTER_TYPES.select:
      return value === true || value === false;

    case _defaultSettings.FILTER_TYPES.range:
    case _defaultSettings.FILTER_TYPES.timeRange:
      return Array.isArray(value) && value.every(function (v) {
        return v !== null && !isNaN(v);
      });

    case _defaultSettings.FILTER_TYPES.multiSelect:
      return Array.isArray(value) && Boolean(value.length);

    case _defaultSettings.FILTER_TYPES.input:
      return Boolean(value.length);

    case _defaultSettings.FILTER_TYPES.polygon:
      var coordinates = (0, _lodash["default"])(value, ['geometry', 'coordinates']);
      return Boolean(value && value.id && coordinates);

    default:
      return true;
  }
}
/**
 *
 * @type {typeof import('./filter-utils').getFilterPlot}
 */


function getFilterPlot(filter, dataset) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  var _filter$mappedValue = filter.mappedValue,
      mappedValue = _filter$mappedValue === void 0 ? [] : _filter$mappedValue;
  var yAxis = filter.yAxis;
  var fieldIdx = dataset.getColumnFieldIdx(yAxis.name);

  if (fieldIdx < 0) {
    _console.console.warn("yAxis ".concat(yAxis.name, " does not exist in dataset"));

    return {
      lineChart: {},
      yAxis: yAxis
    };
  } // return lineChart


  var series = dataset.allData.map(function (d, i) {
    return {
      x: mappedValue[i],
      y: d[fieldIdx]
    };
  }).filter(function (_ref6) {
    var x = _ref6.x,
        y = _ref6.y;
    return Number.isFinite(x) && Number.isFinite(y);
  }).sort(function (a, b) {
    return (0, _d3Array.ascending)(a.x, b.x);
  });
  var yDomain = (0, _d3Array.extent)(series, function (d) {
    return d.y;
  });
  var xDomain = [series[0].x, series[series.length - 1].x];
  return {
    lineChart: {
      series: series,
      yDomain: yDomain,
      xDomain: xDomain
    },
    yAxis: yAxis
  };
}

function getDefaultFilterPlotType(filter) {
  var filterPlotTypes = SupportedPlotType[filter.type];

  if (!filterPlotTypes) {
    return null;
  }

  if (!filter.yAxis) {
    return filterPlotTypes["default"];
  }

  return filterPlotTypes[filter.yAxis.type] || null;
}
/**
 *
 * @param datasetIds list of dataset ids to be filtered
 * @param datasets all datasets
 * @param filters all filters to be applied to datasets
 * @return datasets - new updated datasets
 * @type {typeof import('./filter-utils').applyFiltersToDatasets}
 */


function applyFiltersToDatasets(datasetIds, datasets, filters, layers) {
  var dataIds = (0, _utils.toArray)(datasetIds);
  return dataIds.reduce(function (acc, dataId) {
    var layersToFilter = (layers || []).filter(function (l) {
      return l.config.dataId === dataId;
    });
    var appliedFilters = filters.filter(function (d) {
      return shouldApplyFilter(d, dataId);
    });
    var table = datasets[dataId];
    return _objectSpread(_objectSpread({}, acc), {}, (0, _defineProperty2["default"])({}, dataId, table.filterTable(appliedFilters, layersToFilter, {})));
  }, datasets);
}
/**
 * Applies a new field name value to fielter and update both filter and dataset
 * @param filter - to be applied the new field name on
 * @param dataset - dataset the field belongs to
 * @param fieldName - field.name
 * @param filterDatasetIndex - field.name
 * @param option
 * @return - {filter, datasets}
 * @type {typeof import('./filter-utils').applyFilterFieldName}
 */


function applyFilterFieldName(filter, dataset, fieldName) {
  var filterDatasetIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var option = arguments.length > 4 ? arguments[4] : undefined;
  // using filterDatasetIndex we can filter only the specified dataset
  var mergeDomain = option && option.hasOwnProperty('mergeDomain') ? option.mergeDomain : false;
  var fieldIndex = dataset.getColumnFieldIdx(fieldName); // if no field with same name is found, move to the next datasets

  if (fieldIndex === -1) {
    // throw new Error(`fieldIndex not found. Dataset must contain a property with name: ${fieldName}`);
    return {
      filter: null,
      dataset: dataset
    };
  } // TODO: validate field type


  var filterProps = dataset.getColumnFilterProps(fieldName);

  var newFilter = _objectSpread(_objectSpread({}, mergeDomain ? mergeFilterDomainStep(filter, filterProps) : _objectSpread(_objectSpread({}, filter), filterProps)), {}, {
    name: Object.assign((0, _toConsumableArray2["default"])((0, _utils.toArray)(filter.name)), (0, _defineProperty2["default"])({}, filterDatasetIndex, fieldName)),
    fieldIdx: Object.assign((0, _toConsumableArray2["default"])((0, _utils.toArray)(filter.fieldIdx)), (0, _defineProperty2["default"])({}, filterDatasetIndex, fieldIndex)),
    // TODO, since we allow to add multiple fields to a filter we can no longer freeze the filter
    freeze: true
  });

  return {
    filter: newFilter,
    dataset: dataset
  };
}
/**
 * Merge one filter with other filter prop domain
 * @type {typeof import('./filter-utils').mergeFilterDomainStep}
 */

/* eslint-disable complexity */


function mergeFilterDomainStep(filter, filterProps) {
  if (!filter) {
    return null;
  }

  if (!filterProps) {
    return filter;
  }

  if (filter.fieldType && filter.fieldType !== filterProps.fieldType || !filterProps.domain) {
    return filter;
  }

  var combinedDomain = !filter.domain ? filterProps.domain : [].concat((0, _toConsumableArray2["default"])(filter.domain || []), (0, _toConsumableArray2["default"])(filterProps.domain || [])).sort(function (a, b) {
    return a - b;
  });

  var newFilter = _objectSpread(_objectSpread(_objectSpread({}, filter), filterProps), {}, {
    domain: [combinedDomain[0], combinedDomain[combinedDomain.length - 1]]
  });

  switch (filterProps.fieldType) {
    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      return _objectSpread(_objectSpread({}, newFilter), {}, {
        domain: (0, _dataUtils.unique)(combinedDomain).sort()
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      // @ts-ignore
      var step = filter.step < filterProps.step ? filter.step : filterProps.step;
      return _objectSpread(_objectSpread({}, newFilter), {}, {
        step: step
      });

    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
    default:
      return newFilter;
  }
}
/* eslint-enable complexity */

/**
 * Generates polygon filter
 * @type {typeof import('./filter-utils').featureToFilterValue}
 */


var featureToFilterValue = function featureToFilterValue(feature, filterId) {
  var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return _objectSpread(_objectSpread({}, feature), {}, {
    id: feature.id,
    properties: _objectSpread(_objectSpread(_objectSpread({}, feature.properties), properties), {}, {
      filterId: filterId
    })
  });
};
/**
 * @type {typeof import('./filter-utils').getFilterIdInFeature}
 */


exports.featureToFilterValue = featureToFilterValue;

var getFilterIdInFeature = function getFilterIdInFeature(f) {
  return (0, _lodash["default"])(f, ['properties', 'filterId']);
};
/**
 * Generates polygon filter
 * @type {typeof import('./filter-utils').generatePolygonFilter}
 */


exports.getFilterIdInFeature = getFilterIdInFeature;

function generatePolygonFilter(layers, feature) {
  var dataId = layers.map(function (l) {
    return l.config.dataId;
  }).filter(function (d) {
    return d;
  });
  var layerId = layers.map(function (l) {
    return l.id;
  });
  var name = layers.map(function (l) {
    return l.config.label;
  }); // @ts-ignore

  var filter = getDefaultFilter(dataId);
  return _objectSpread(_objectSpread({}, filter), {}, {
    fixedDomain: true,
    type: _defaultSettings.FILTER_TYPES.polygon,
    name: name,
    layerId: layerId,
    value: featureToFilterValue(feature, filter.id, {
      isVisible: true
    })
  });
}
/**
 * Run filter entirely on CPU
 * @type {typeof import('./filter-utils').filterDatasetCPU}
 */


function filterDatasetCPU(state, dataId) {
  var datasetFilters = state.filters.filter(function (f) {
    return f.dataId.includes(dataId);
  });
  var dataset = state.datasets[dataId];

  if (!dataset) {
    return state;
  }

  var cpuFilteredDataset = dataset.filterTableCPU(datasetFilters, state.layers);
  return (0, _utils.set)(['datasets', dataId], cpuFilteredDataset, state);
}
/**
 * Validate parsed filters with datasets and add filterProps to field
 * @type {typeof import('./filter-utils').validateFiltersUpdateDatasets}
 */


function validateFiltersUpdateDatasets(state) {
  var filtersToValidate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var validated = [];
  var failed = [];
  var datasets = state.datasets;
  var updatedDatasets = datasets; // merge filters

  filtersToValidate.forEach(function (filter) {
    // we can only look for datasets define in the filter dataId
    var datasetIds = (0, _utils.toArray)(filter.dataId); // we can merge a filter only if all datasets in filter.dataId are loaded

    if (datasetIds.every(function (d) {
      return datasets[d];
    })) {
      // all datasetIds in filter must be present the state datasets
      var _datasetIds$reduce = datasetIds.reduce(function (acc, datasetId) {
        var dataset = updatedDatasets[datasetId];
        var layers = state.layers.filter(function (l) {
          return l.config.dataId === dataset.id;
        });

        var _validateFilterWithDa = validateFilterWithData(acc.augmentedDatasets[datasetId] || dataset, filter, layers),
            updatedFilter = _validateFilterWithDa.filter,
            updatedDataset = _validateFilterWithDa.dataset;

        if (updatedFilter) {
          return _objectSpread(_objectSpread({}, acc), {}, {
            // merge filter props
            filter: acc.filter ? _objectSpread(_objectSpread({}, acc.filter), mergeFilterDomainStep(acc, updatedFilter)) : updatedFilter,
            applyToDatasets: [].concat((0, _toConsumableArray2["default"])(acc.applyToDatasets), [datasetId]),
            augmentedDatasets: _objectSpread(_objectSpread({}, acc.augmentedDatasets), {}, (0, _defineProperty2["default"])({}, datasetId, updatedDataset))
          });
        }

        return acc;
      }, {
        filter: null,
        applyToDatasets: [],
        augmentedDatasets: {}
      }),
          validatedFilter = _datasetIds$reduce.filter,
          applyToDatasets = _datasetIds$reduce.applyToDatasets,
          augmentedDatasets = _datasetIds$reduce.augmentedDatasets;

      if (validatedFilter && (0, _lodash2["default"])(datasetIds, applyToDatasets)) {
        validated.push(validatedFilter);
        updatedDatasets = _objectSpread(_objectSpread({}, updatedDatasets), augmentedDatasets);
      }
    } else {
      failed.push(filter);
    }
  });
  return {
    validated: validated,
    failed: failed,
    updatedDatasets: updatedDatasets
  };
}
/**
 * Retrieve interval bins for time filter
 * @type {typeof import('./filter-utils').getIntervalBins}
 */


function getIntervalBins(filter) {
  var _filter$plotType;

  var bins = filter.bins;
  var interval = (_filter$plotType = filter.plotType) === null || _filter$plotType === void 0 ? void 0 : _filter$plotType.interval;

  if (!interval || !bins || Object.keys(bins).length === 0) {
    return null;
  }

  var values = Object.values(bins);
  return values[0] ? values[0][interval] : null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImhpc3RvZ3JhbUJpbnMiLCJlbmxhcmdlZEhpc3RvZ3JhbUJpbnMiLCJkdXJhdGlvblNlY29uZCIsImR1cmF0aW9uTWludXRlIiwiZHVyYXRpb25Ib3VyIiwiZHVyYXRpb25EYXkiLCJkdXJhdGlvbldlZWsiLCJkdXJhdGlvblllYXIiLCJQTE9UX1RZUEVTIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwiRklMVEVSX1VQREFURVJfUFJPUFMiLCJkYXRhSWQiLCJuYW1lIiwibGF5ZXJJZCIsIkxJTUlURURfRklMVEVSX0VGRkVDVF9QUk9QUyIsIlN1cHBvcnRlZFBsb3RUeXBlIiwiRklMVEVSX1RZUEVTIiwidGltZVJhbmdlIiwiQUxMX0ZJRUxEX1RZUEVTIiwiaW50ZWdlciIsInJlYWwiLCJyYW5nZSIsIkZJTFRFUl9DT01QT05FTlRTIiwic2VsZWN0IiwibXVsdGlTZWxlY3QiLCJwb2x5Z29uIiwiREVGQVVMVF9GSUxURVJfU1RSVUNUVVJFIiwiZnJlZXplIiwiaWQiLCJmaXhlZERvbWFpbiIsImVubGFyZ2VkIiwiaXNBbmltYXRpbmciLCJhbmltYXRpb25XaW5kb3ciLCJBTklNQVRJT05fV0lORE9XIiwiZnJlZSIsInNwZWVkIiwidHlwZSIsImZpZWxkSWR4IiwiZG9tYWluIiwidmFsdWUiLCJwbG90VHlwZSIsInlBeGlzIiwiaW50ZXJ2YWwiLCJncHUiLCJGSUxURVJfSURfTEVOR1RIIiwiTEFZRVJfRklMVEVSUyIsImdldERlZmF1bHRGaWx0ZXIiLCJzaG91bGRBcHBseUZpbHRlciIsImZpbHRlciIsImRhdGFzZXRJZCIsImRhdGFJZHMiLCJpbmNsdWRlcyIsInZhbGlkYXRlUG9seWdvbkZpbHRlciIsImRhdGFzZXQiLCJsYXllcnMiLCJmYWlsZWQiLCJpc1ZhbGlkRmlsdGVyVmFsdWUiLCJpc1ZhbGlkRGF0YXNldCIsImxheWVyIiwiZmluZCIsImwiLCJmaWx0ZXJWYWxpZGF0b3JzIiwidmFsaWRhdGVGaWx0ZXIiLCJmaWx0ZXJEYXRhSWQiLCJmaWx0ZXJEYXRhc2V0SW5kZXgiLCJpbmRleE9mIiwiaW5pdGlhbGl6ZUZpbHRlciIsImZpZWxkTmFtZSIsImFwcGx5RmlsdGVyRmllbGROYW1lIiwibWVyZ2VEb21haW4iLCJ1cGRhdGVkRmlsdGVyIiwidXBkYXRlZERhdGFzZXQiLCJhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluIiwidmFsaWRhdGVGaWx0ZXJZQXhpcyIsInZhbGlkYXRlRmlsdGVyV2l0aERhdGEiLCJoYXNPd25Qcm9wZXJ0eSIsImZpZWxkcyIsIm1hdGNoZWRBeGlzIiwiZ2V0RmlsdGVyUGxvdCIsImdldEZpbHRlclByb3BzIiwiZmllbGQiLCJmaWVsZERvbWFpbiIsImZpbHRlclByb3BzIiwiZmllbGRUeXBlIiwidHlwZU9wdGlvbnMiLCJzdHJpbmciLCJkYXRlIiwidGltZXN0YW1wIiwiZ2V0UG9seWdvbkZpbHRlckZ1bmN0b3IiLCJnZXRQb3NpdGlvbiIsImdldFBvc2l0aW9uQWNjZXNzb3IiLCJMQVlFUl9UWVBFUyIsInBvaW50IiwiaWNvbiIsImRhdGEiLCJwb3MiLCJldmVyeSIsImlzRmluaXRlIiwiaXNJblBvbHlnb24iLCJhcmMiLCJsaW5lIiwiaGV4YWdvbklkIiwiZGF0YVRvRmVhdHVyZSIsImNlbnRyb2lkcyIsImluZGV4IiwiY2VudHJvaWQiLCJnZXRGaWx0ZXJGdW5jdGlvbiIsInZhbHVlQWNjZXNzb3IiLCJkZWZhdWx0RnVuYyIsImQiLCJpc0luUmFuZ2UiLCJtYXBwZWRWYWx1ZSIsImFjY2Vzc29yIiwiQXJyYXkiLCJpc0FycmF5IiwiZm9ybWF0IiwibGVuZ3RoIiwibGF5ZXJGaWx0ZXJGdW5jdGlvbnMiLCJtYXAiLCJjb25maWciLCJmaWx0ZXJGdW5jIiwidXBkYXRlRmlsdGVyRGF0YUlkIiwiZmlsdGVyRGF0YUJ5RmlsdGVyVHlwZXMiLCJhbGxEYXRhIiwiZHluYW1pY0RvbWFpbkZpbHRlcnMiLCJjcHVGaWx0ZXJzIiwiZmlsdGVyRnVuY3MiLCJyZXN1bHQiLCJmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIiwiZmlsdGVyZWRJbmRleCIsImkiLCJtYXRjaEZvckRvbWFpbiIsInB1c2giLCJtYXRjaEZvclJlbmRlciIsImdldEZpbHRlclJlY29yZCIsImZpbHRlcnMiLCJvcHQiLCJmaWx0ZXJSZWNvcmQiLCJkeW5hbWljRG9tYWluIiwiY3B1IiwiZm9yRWFjaCIsImYiLCJpZ25vcmVEb21haW4iLCJjcHVPbmx5IiwiZGlmZkZpbHRlcnMiLCJvbGRGaWx0ZXJSZWNvcmQiLCJmaWx0ZXJDaGFuZ2VkIiwiT2JqZWN0IiwiZW50cmllcyIsInJlY29yZCIsIml0ZW1zIiwib2xkRmlsdGVyIiwicHJvcCIsImZpbHRlcmVkVmFsdWUiLCJnZXROdW1lcmljRmllbGREb21haW4iLCJTY2FsZVV0aWxzIiwiZ2V0TGluZWFyRG9tYWluIiwiZGlmZiIsImdldE51bWVyaWNTdGVwU2l6ZSIsImZvcm1hdE51bWJlckJ5U3RlcCIsImdldEhpc3RvZ3JhbSIsImVubGFyZ2VkSGlzdG9ncmFtIiwiTWF0aCIsImFicyIsIngiLCJleHBvbmVudGlhbEZvcm0iLCJ0b0V4cG9uZW50aWFsIiwiZXhwb25lbnQiLCJwYXJzZUZsb2F0Iiwic3BsaXQiLCJEZWNpbWFsIiwicG93IiwidG9OdW1iZXIiLCJnZXRUaW1lc3RhbXBGaWVsZERvbWFpbiIsImRlZmF1bHRUaW1lRm9ybWF0IiwiZ2V0VGltZVdpZGdldFRpdGxlRm9ybWF0dGVyIiwiZW50cnkiLCJoaXN0b2dyYW1Db25zdHJ1Y3QiLCJiaW5zIiwidGhyZXNob2xkcyIsImJpbiIsImNvdW50IiwieDAiLCJ4MSIsInZhbCIsImJvdW5kIiwiZmxvb3IiLCJjZWlsIiwiaXNWYWxpZFRpbWVEb21haW4iLCJnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlciIsInYiLCJpc05hTiIsIkJvb2xlYW4iLCJpbnB1dCIsImNvb3JkaW5hdGVzIiwiZ2V0Q29sdW1uRmllbGRJZHgiLCJDb25zb2xlIiwid2FybiIsInNlcmllcyIsInkiLCJzb3J0IiwiYSIsImIiLCJ5RG9tYWluIiwieERvbWFpbiIsImdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSIsImZpbHRlclBsb3RUeXBlcyIsImFwcGx5RmlsdGVyc1RvRGF0YXNldHMiLCJkYXRhc2V0SWRzIiwiZGF0YXNldHMiLCJyZWR1Y2UiLCJhY2MiLCJsYXllcnNUb0ZpbHRlciIsImFwcGxpZWRGaWx0ZXJzIiwidGFibGUiLCJmaWx0ZXJUYWJsZSIsIm9wdGlvbiIsImZpZWxkSW5kZXgiLCJnZXRDb2x1bW5GaWx0ZXJQcm9wcyIsIm5ld0ZpbHRlciIsIm1lcmdlRmlsdGVyRG9tYWluU3RlcCIsImFzc2lnbiIsImNvbWJpbmVkRG9tYWluIiwiZmVhdHVyZVRvRmlsdGVyVmFsdWUiLCJmZWF0dXJlIiwiZmlsdGVySWQiLCJwcm9wZXJ0aWVzIiwiZ2V0RmlsdGVySWRJbkZlYXR1cmUiLCJnZW5lcmF0ZVBvbHlnb25GaWx0ZXIiLCJsYWJlbCIsImlzVmlzaWJsZSIsImZpbHRlckRhdGFzZXRDUFUiLCJzdGF0ZSIsImRhdGFzZXRGaWx0ZXJzIiwiY3B1RmlsdGVyZWREYXRhc2V0IiwiZmlsdGVyVGFibGVDUFUiLCJ2YWxpZGF0ZUZpbHRlcnNVcGRhdGVEYXRhc2V0cyIsImZpbHRlcnNUb1ZhbGlkYXRlIiwidmFsaWRhdGVkIiwidXBkYXRlZERhdGFzZXRzIiwiYXVnbWVudGVkRGF0YXNldHMiLCJhcHBseVRvRGF0YXNldHMiLCJ2YWxpZGF0ZWRGaWx0ZXIiLCJnZXRJbnRlcnZhbEJpbnMiLCJrZXlzIiwidmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7QUFF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LElBQUFBLE1BQU0sRUFBTkEsTUFBWjtBQUFvQndMLElBQUFBLGVBQWUsRUFBZkE7QUFBcEIsR0FBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNJLGVBQVQsQ0FBeUJuTSxNQUF6QixFQUFpQztBQUFBOztBQUFBLE1BQy9Ca0ksSUFEK0IsR0FDdkJsSSxNQUR1QixDQUMvQmtJLElBRCtCO0FBRXRDLE1BQU14SSxRQUFRLHVCQUFHTSxNQUFNLENBQUNSLFFBQVYscURBQUcsaUJBQWlCRSxRQUFsQzs7QUFDQSxNQUFJLENBQUNBLFFBQUQsSUFBYSxDQUFDd0ksSUFBZCxJQUFzQi9CLE1BQU0sQ0FBQ2lHLElBQVAsQ0FBWWxFLElBQVosRUFBa0I5RCxNQUFsQixLQUE2QixDQUF2RCxFQUEwRDtBQUN4RCxXQUFPLElBQVA7QUFDRDs7QUFDRCxNQUFNaUksTUFBTSxHQUFHbEcsTUFBTSxDQUFDa0csTUFBUCxDQUFjbkUsSUFBZCxDQUFmO0FBQ0EsU0FBT21FLE1BQU0sQ0FBQyxDQUFELENBQU4sR0FBWUEsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVM00sUUFBVixDQUFaLEdBQWtDLElBQXpDO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMjEgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2FzY2VuZGluZywgZXh0ZW50LCBoaXN0b2dyYW0gYXMgZDNIaXN0b2dyYW0sIHRpY2tzfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ2tleW1pcnJvcic7XG5pbXBvcnQge2NvbnNvbGUgYXMgQ29uc29sZX0gZnJvbSAnZ2xvYmFsL2NvbnNvbGUnO1xuaW1wb3J0IGdldCBmcm9tICdsb2Rhc2guZ2V0JztcbmltcG9ydCBpc0VxdWFsIGZyb20gJ2xvZGFzaC5pc2VxdWFsJztcblxuaW1wb3J0IGJvb2xlYW5XaXRoaW4gZnJvbSAnQHR1cmYvYm9vbGVhbi13aXRoaW4nO1xuaW1wb3J0IHtwb2ludCBhcyB0dXJmUG9pbnR9IGZyb20gJ0B0dXJmL2hlbHBlcnMnO1xuaW1wb3J0IHtEZWNpbWFsfSBmcm9tICdkZWNpbWFsLmpzJztcbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTLCBGSUxURVJfVFlQRVMsIEFOSU1BVElPTl9XSU5ET1d9IGZyb20gJ2NvbnN0YW50cy9kZWZhdWx0LXNldHRpbmdzJztcbmltcG9ydCB7bm90TnVsbG9yVW5kZWZpbmVkLCB1bmlxdWUsIHRpbWVUb1VuaXhNaWxsaX0gZnJvbSAnLi9kYXRhLXV0aWxzJztcbmltcG9ydCAqIGFzIFNjYWxlVXRpbHMgZnJvbSAnLi9kYXRhLXNjYWxlLXV0aWxzJztcbmltcG9ydCB7TEFZRVJfVFlQRVN9IGZyb20gJ2xheWVycy90eXBlcyc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkLCBzZXQsIHRvQXJyYXl9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHtnZXRDZW50cm9pZCwgaDNJc1ZhbGlkfSBmcm9tICdsYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy11dGlscyc7XG5cbi8vIFRZUEVcbi8qKiBAdHlwZWRlZiB7aW1wb3J0KCcuL3RhYmxlLXV0aWxzL2tlcGxlci10YWJsZScpLkZpbHRlclJlY29yZH0gRmlsdGVyUmVjb3JkICovXG4vKiogQHR5cGVkZWYge2ltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5GaWx0ZXJSZXN1bHR9IEZpbHRlclJlc3VsdCAqL1xuXG5leHBvcnQgY29uc3QgVGltZXN0YW1wU3RlcE1hcCA9IFtcbiAge21heDogMSwgc3RlcDogMC4wNX0sXG4gIHttYXg6IDEwLCBzdGVwOiAwLjF9LFxuICB7bWF4OiAxMDAsIHN0ZXA6IDF9LFxuICB7bWF4OiA1MDAsIHN0ZXA6IDV9LFxuICB7bWF4OiAxMDAwLCBzdGVwOiAxMH0sXG4gIHttYXg6IDUwMDAsIHN0ZXA6IDUwfSxcbiAge21heDogTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLCBzdGVwOiAxMDAwfVxuXTtcblxuZXhwb3J0IGNvbnN0IGhpc3RvZ3JhbUJpbnMgPSAzMDtcbmV4cG9ydCBjb25zdCBlbmxhcmdlZEhpc3RvZ3JhbUJpbnMgPSAxMDA7XG5cbmNvbnN0IGR1cmF0aW9uU2Vjb25kID0gMTAwMDtcbmNvbnN0IGR1cmF0aW9uTWludXRlID0gZHVyYXRpb25TZWNvbmQgKiA2MDtcbmNvbnN0IGR1cmF0aW9uSG91ciA9IGR1cmF0aW9uTWludXRlICogNjA7XG5jb25zdCBkdXJhdGlvbkRheSA9IGR1cmF0aW9uSG91ciAqIDI0O1xuY29uc3QgZHVyYXRpb25XZWVrID0gZHVyYXRpb25EYXkgKiA3O1xuY29uc3QgZHVyYXRpb25ZZWFyID0gZHVyYXRpb25EYXkgKiAzNjU7XG5cbmV4cG9ydCBjb25zdCBQTE9UX1RZUEVTID0ga2V5TWlycm9yKHtcbiAgaGlzdG9ncmFtOiBudWxsLFxuICBsaW5lQ2hhcnQ6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgRklMVEVSX1VQREFURVJfUFJPUFMgPSBrZXlNaXJyb3Ioe1xuICBkYXRhSWQ6IG51bGwsXG4gIG5hbWU6IG51bGwsXG4gIGxheWVySWQ6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgTElNSVRFRF9GSUxURVJfRUZGRUNUX1BST1BTID0ga2V5TWlycm9yKHtcbiAgW0ZJTFRFUl9VUERBVEVSX1BST1BTLm5hbWVdOiBudWxsXG59KTtcbi8qKlxuICogTWF4IG51bWJlciBvZiBmaWx0ZXIgdmFsdWUgYnVmZmVycyB0aGF0IGRlY2suZ2wgcHJvdmlkZXNcbiAqL1xuXG5jb25zdCBTdXBwb3J0ZWRQbG90VHlwZSA9IHtcbiAgW0ZJTFRFUl9UWVBFUy50aW1lUmFuZ2VdOiB7XG4gICAgZGVmYXVsdDogJ2hpc3RvZ3JhbScsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyXTogJ2xpbmVDaGFydCcsXG4gICAgW0FMTF9GSUVMRF9UWVBFUy5yZWFsXTogJ2xpbmVDaGFydCdcbiAgfSxcbiAgW0ZJTFRFUl9UWVBFUy5yYW5nZV06IHtcbiAgICBkZWZhdWx0OiAnaGlzdG9ncmFtJyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiAnbGluZUNoYXJ0JyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiAnbGluZUNoYXJ0J1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX0NPTVBPTkVOVFMgPSB7XG4gIFtGSUxURVJfVFlQRVMuc2VsZWN0XTogJ1NpbmdsZVNlbGVjdEZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMubXVsdGlTZWxlY3RdOiAnTXVsdGlTZWxlY3RGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnRpbWVSYW5nZV06ICdUaW1lUmFuZ2VGaWx0ZXInLFxuICBbRklMVEVSX1RZUEVTLnJhbmdlXTogJ1JhbmdlRmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy5wb2x5Z29uXTogJ1BvbHlnb25GaWx0ZXInXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9GSUxURVJfU1RSVUNUVVJFID0ge1xuICBkYXRhSWQ6IFtdLCAvLyBbc3RyaW5nXVxuICBmcmVlemU6IGZhbHNlLFxuICBpZDogbnVsbCxcblxuICAvLyB0aW1lIHJhbmdlIGZpbHRlciBzcGVjaWZpY1xuICBmaXhlZERvbWFpbjogZmFsc2UsXG4gIGVubGFyZ2VkOiBmYWxzZSxcbiAgaXNBbmltYXRpbmc6IGZhbHNlLFxuICBhbmltYXRpb25XaW5kb3c6IEFOSU1BVElPTl9XSU5ET1cuZnJlZSxcbiAgc3BlZWQ6IDEsXG5cbiAgLy8gZmllbGQgc3BlY2lmaWNcbiAgbmFtZTogW10sIC8vIHN0cmluZ1xuICB0eXBlOiBudWxsLFxuICBmaWVsZElkeDogW10sIC8vIFtpbnRlZ2VyXVxuICBkb21haW46IG51bGwsXG4gIHZhbHVlOiBudWxsLFxuXG4gIC8vIHBsb3RcbiAgcGxvdFR5cGU6IFBMT1RfVFlQRVMuaGlzdG9ncmFtLFxuICB5QXhpczogbnVsbCxcbiAgaW50ZXJ2YWw6IG51bGwsXG5cbiAgLy8gbW9kZVxuICBncHU6IGZhbHNlXG59O1xuXG5leHBvcnQgY29uc3QgRklMVEVSX0lEX0xFTkdUSCA9IDQ7XG5cbmV4cG9ydCBjb25zdCBMQVlFUl9GSUxURVJTID0gW0ZJTFRFUl9UWVBFUy5wb2x5Z29uXTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSBmaWx0ZXIgd2l0aCBhIGRhdGFzZXQgaWQgYXMgZGF0YUlkXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXREZWZhdWx0RmlsdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZpbHRlcihkYXRhSWQpIHtcbiAgcmV0dXJuIHtcbiAgICAuLi5ERUZBVUxUX0ZJTFRFUl9TVFJVQ1RVUkUsXG4gICAgLy8gc3RvcmUgaXQgYXMgZGF0YUlkIGFuZCBpdCBjb3VsZCBiZSBvbmUgb3IgbWFueVxuICAgIGRhdGFJZDogdG9BcnJheShkYXRhSWQpLFxuICAgIGlkOiBnZW5lcmF0ZUhhc2hJZChGSUxURVJfSURfTEVOR1RIKVxuICB9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIGEgZmlsdGVyIGlzIHZhbGlkIGJhc2VkIG9uIHRoZSBnaXZlbiBkYXRhSWRcbiAqIEBwYXJhbSAgZmlsdGVyIHRvIHZhbGlkYXRlXG4gKiBAcGFyYW0gIGRhdGFzZXRJZCBpZCB0byB2YWxpZGF0ZSBmaWx0ZXIgYWdhaW5zdFxuICogQHJldHVybiB0cnVlIGlmIGEgZmlsdGVyIGlzIHZhbGlkLCBmYWxzZSBvdGhlcndpc2VcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLnNob3VsZEFwcGx5RmlsdGVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkQXBwbHlGaWx0ZXIoZmlsdGVyLCBkYXRhc2V0SWQpIHtcbiAgY29uc3QgZGF0YUlkcyA9IHRvQXJyYXkoZmlsdGVyLmRhdGFJZCk7XG4gIHJldHVybiBkYXRhSWRzLmluY2x1ZGVzKGRhdGFzZXRJZCkgJiYgZmlsdGVyLnZhbHVlICE9PSBudWxsO1xufVxuXG4vKipcbiAqIFZhbGlkYXRlcyBhbmQgbW9kaWZpZXMgcG9seWdvbiBmaWx0ZXIgc3RydWN0dXJlXG4gKiBAcGFyYW0gZGF0YXNldFxuICogQHBhcmFtIGZpbHRlclxuICogQHBhcmFtIGxheWVyc1xuICogQHJldHVybiAtIHtmaWx0ZXIsIGRhdGFzZXR9XG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS52YWxpZGF0ZVBvbHlnb25GaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBvbHlnb25GaWx0ZXIoZGF0YXNldCwgZmlsdGVyLCBsYXllcnMpIHtcbiAgY29uc3QgZmFpbGVkID0ge2RhdGFzZXQsIGZpbHRlcjogbnVsbH07XG4gIGNvbnN0IHt2YWx1ZSwgbGF5ZXJJZCwgdHlwZSwgZGF0YUlkfSA9IGZpbHRlcjtcblxuICBpZiAoIWxheWVySWQgfHwgIWlzVmFsaWRGaWx0ZXJWYWx1ZSh0eXBlLCB2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFpbGVkO1xuICB9XG5cbiAgY29uc3QgaXNWYWxpZERhdGFzZXQgPSBkYXRhSWQuaW5jbHVkZXMoZGF0YXNldC5pZCk7XG5cbiAgaWYgKCFpc1ZhbGlkRGF0YXNldCkge1xuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICBjb25zdCBsYXllciA9IGxheWVycy5maW5kKGwgPT4gbGF5ZXJJZC5pbmNsdWRlcyhsLmlkKSk7XG5cbiAgaWYgKCFsYXllcikge1xuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpbHRlcjoge1xuICAgICAgLi4uZmlsdGVyLFxuICAgICAgZnJlZXplOiB0cnVlLFxuICAgICAgZmllbGRJZHg6IFtdXG4gICAgfSxcbiAgICBkYXRhc2V0XG4gIH07XG59XG5cbi8qKlxuICogQ3VzdG9tIGZpbHRlciB2YWxpZGF0b3JzXG4gKi9cbmNvbnN0IGZpbHRlclZhbGlkYXRvcnMgPSB7XG4gIFtGSUxURVJfVFlQRVMucG9seWdvbl06IHZhbGlkYXRlUG9seWdvbkZpbHRlclxufTtcblxuLyoqXG4gKiBEZWZhdWx0IHZhbGlkYXRlIGZpbHRlciBmdW5jdGlvblxuICogQHBhcmFtIGRhdGFzZXRcbiAqIEBwYXJhbSBmaWx0ZXJcbiAqIEByZXR1cm4gLSB7ZmlsdGVyLCBkYXRhc2V0fVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykudmFsaWRhdGVGaWx0ZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUZpbHRlcihkYXRhc2V0LCBmaWx0ZXIpIHtcbiAgLy8gbWF0Y2ggZmlsdGVyLmRhdGFJZFxuICBjb25zdCBmYWlsZWQgPSB7ZGF0YXNldCwgZmlsdGVyOiBudWxsfTtcbiAgY29uc3QgZmlsdGVyRGF0YUlkID0gdG9BcnJheShmaWx0ZXIuZGF0YUlkKTtcblxuICBjb25zdCBmaWx0ZXJEYXRhc2V0SW5kZXggPSBmaWx0ZXJEYXRhSWQuaW5kZXhPZihkYXRhc2V0LmlkKTtcbiAgaWYgKGZpbHRlckRhdGFzZXRJbmRleCA8IDApIHtcbiAgICAvLyB0aGUgY3VycmVudCBmaWx0ZXIgaXMgbm90IG1hcHBlZCBhZ2FpbnN0IHRoZSBjdXJyZW50IGRhdGFzZXRcbiAgICByZXR1cm4gZmFpbGVkO1xuICB9XG5cbiAgY29uc3QgaW5pdGlhbGl6ZUZpbHRlciA9IHtcbiAgICAuLi5nZXREZWZhdWx0RmlsdGVyKGZpbHRlci5kYXRhSWQpLFxuICAgIC4uLmZpbHRlcixcbiAgICBkYXRhSWQ6IGZpbHRlckRhdGFJZCxcbiAgICBuYW1lOiB0b0FycmF5KGZpbHRlci5uYW1lKVxuICB9O1xuXG4gIGNvbnN0IGZpZWxkTmFtZSA9IGluaXRpYWxpemVGaWx0ZXIubmFtZVtmaWx0ZXJEYXRhc2V0SW5kZXhdO1xuICBjb25zdCB7ZmlsdGVyOiB1cGRhdGVkRmlsdGVyLCBkYXRhc2V0OiB1cGRhdGVkRGF0YXNldH0gPSBhcHBseUZpbHRlckZpZWxkTmFtZShcbiAgICBpbml0aWFsaXplRmlsdGVyLFxuICAgIGRhdGFzZXQsXG4gICAgZmllbGROYW1lLFxuICAgIGZpbHRlckRhdGFzZXRJbmRleCxcbiAgICB7bWVyZ2VEb21haW46IHRydWV9XG4gICk7XG5cbiAgaWYgKCF1cGRhdGVkRmlsdGVyKSB7XG4gICAgcmV0dXJuIGZhaWxlZDtcbiAgfVxuXG4gIHVwZGF0ZWRGaWx0ZXIudmFsdWUgPSBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKGZpbHRlci52YWx1ZSwgdXBkYXRlZEZpbHRlcik7XG4gIHVwZGF0ZWRGaWx0ZXIuZW5sYXJnZWQgPVxuICAgIHR5cGVvZiBmaWx0ZXIuZW5sYXJnZWQgPT09ICdib29sZWFuJyA/IGZpbHRlci5lbmxhcmdlZCA6IHVwZGF0ZWRGaWx0ZXIuZW5sYXJnZWQ7XG5cbiAgaWYgKHVwZGF0ZWRGaWx0ZXIudmFsdWUgPT09IG51bGwpIHtcbiAgICAvLyBjYW5ub3QgYWRqdXN0IHNhdmVkIHZhbHVlIHRvIGZpbHRlclxuICAgIHJldHVybiBmYWlsZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGZpbHRlcjogdmFsaWRhdGVGaWx0ZXJZQXhpcyh1cGRhdGVkRmlsdGVyLCB1cGRhdGVkRGF0YXNldCksXG4gICAgZGF0YXNldDogdXBkYXRlZERhdGFzZXRcbiAgfTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBzYXZlZCBmaWx0ZXIgY29uZmlnIHdpdGggbmV3IGRhdGEsXG4gKiBjYWxjdWxhdGUgZG9tYWluIGFuZCBmaWVsZElkeCBiYXNlZCBuZXcgZmllbGRzIGFuZCBkYXRhXG4gKlxuICogQHBhcmFtIGRhdGFzZXRcbiAqIEBwYXJhbSBmaWx0ZXIgLSBmaWx0ZXIgdG8gYmUgdmFsaWRhdGVcbiAqIEBwYXJhbSBsYXllcnMgLSBsYXllcnNcbiAqIEByZXR1cm4gdmFsaWRhdGVkIGZpbHRlclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykudmFsaWRhdGVGaWx0ZXJXaXRoRGF0YX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRmlsdGVyV2l0aERhdGEoZGF0YXNldCwgZmlsdGVyLCBsYXllcnMpIHtcbiAgLy8gQHRzLWlnbm9yZVxuICByZXR1cm4gZmlsdGVyVmFsaWRhdG9ycy5oYXNPd25Qcm9wZXJ0eShmaWx0ZXIudHlwZSlcbiAgICA/IGZpbHRlclZhbGlkYXRvcnNbZmlsdGVyLnR5cGVdKGRhdGFzZXQsIGZpbHRlciwgbGF5ZXJzKVxuICAgIDogdmFsaWRhdGVGaWx0ZXIoZGF0YXNldCwgZmlsdGVyKTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBZQXhpc1xuICogQHBhcmFtIGZpbHRlclxuICogQHBhcmFtIGRhdGFzZXRcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRmlsdGVyWUF4aXMoZmlsdGVyLCBkYXRhc2V0KSB7XG4gIC8vIFRPRE86IHZhbGlkYXRlIHlBeGlzIGFnYWluc3Qgb3RoZXIgZGF0YXNldHNcblxuICBjb25zdCB7ZmllbGRzfSA9IGRhdGFzZXQ7XG4gIGNvbnN0IHt5QXhpc30gPSBmaWx0ZXI7XG4gIC8vIFRPRE86IHZhbGlkYXRlIHlBeGlzIGFnYWluc3Qgb3RoZXIgZGF0YXNldHNcbiAgaWYgKHlBeGlzKSB7XG4gICAgY29uc3QgbWF0Y2hlZEF4aXMgPSBmaWVsZHMuZmluZCgoe25hbWUsIHR5cGV9KSA9PiBuYW1lID09PSB5QXhpcy5uYW1lICYmIHR5cGUgPT09IHlBeGlzLnR5cGUpO1xuXG4gICAgZmlsdGVyID0gbWF0Y2hlZEF4aXNcbiAgICAgID8ge1xuICAgICAgICAgIC4uLmZpbHRlcixcbiAgICAgICAgICB5QXhpczogbWF0Y2hlZEF4aXMsXG4gICAgICAgICAgLi4uZ2V0RmlsdGVyUGxvdCh7Li4uZmlsdGVyLCB5QXhpczogbWF0Y2hlZEF4aXN9LCBkYXRhc2V0KVxuICAgICAgICB9XG4gICAgICA6IGZpbHRlcjtcbiAgfVxuXG4gIHJldHVybiBmaWx0ZXI7XG59XG5cbi8qKlxuICogR2V0IGRlZmF1bHQgZmlsdGVyIHByb3AgYmFzZWQgb24gZmllbGQgdHlwZVxuICpcbiAqIEBwYXJhbSBmaWVsZFxuICogQHBhcmFtIGZpZWxkRG9tYWluXG4gKiBAcmV0dXJucyBkZWZhdWx0IGZpbHRlclxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0RmlsdGVyUHJvcHN9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJQcm9wcyhmaWVsZCwgZmllbGREb21haW4pIHtcbiAgY29uc3QgZmlsdGVyUHJvcHMgPSB7XG4gICAgLi4uZmllbGREb21haW4sXG4gICAgZmllbGRUeXBlOiBmaWVsZC50eXBlXG4gIH07XG5cbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyUHJvcHMsXG4gICAgICAgIHZhbHVlOiBmaWVsZERvbWFpbi5kb21haW4sXG4gICAgICAgIHR5cGU6IEZJTFRFUl9UWVBFUy5yYW5nZSxcbiAgICAgICAgdHlwZU9wdGlvbnM6IFtGSUxURVJfVFlQRVMucmFuZ2VdLFxuICAgICAgICBncHU6IHRydWVcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5ib29sZWFuOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyUHJvcHMsXG4gICAgICAgIHR5cGU6IEZJTFRFUl9UWVBFUy5zZWxlY3QsXG4gICAgICAgIHZhbHVlOiB0cnVlLFxuICAgICAgICBncHU6IGZhbHNlXG4gICAgICB9O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuc3RyaW5nOlxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmRhdGU6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICAgICAgdHlwZTogRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0LFxuICAgICAgICB2YWx1ZTogW10sXG4gICAgICAgIGdwdTogZmFsc2VcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJQcm9wcyxcbiAgICAgICAgdHlwZTogRklMVEVSX1RZUEVTLnRpbWVSYW5nZSxcbiAgICAgICAgZW5sYXJnZWQ6IHRydWUsXG4gICAgICAgIGZpeGVkRG9tYWluOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZmlsdGVyUHJvcHMuZG9tYWluLFxuICAgICAgICBncHU6IHRydWVcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHt9O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRQb2x5Z29uRmlsdGVyRnVuY3RvciA9IChsYXllciwgZmlsdGVyKSA9PiB7XG4gIGNvbnN0IGdldFBvc2l0aW9uID0gbGF5ZXIuZ2V0UG9zaXRpb25BY2Nlc3NvcigpO1xuXG4gIHN3aXRjaCAobGF5ZXIudHlwZSkge1xuICAgIGNhc2UgTEFZRVJfVFlQRVMucG9pbnQ6XG4gICAgY2FzZSBMQVlFUl9UWVBFUy5pY29uOlxuICAgICAgcmV0dXJuIGRhdGEgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YX0pO1xuICAgICAgICByZXR1cm4gcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkgJiYgaXNJblBvbHlnb24ocG9zLCBmaWx0ZXIudmFsdWUpO1xuICAgICAgfTtcbiAgICBjYXNlIExBWUVSX1RZUEVTLmFyYzpcbiAgICBjYXNlIExBWUVSX1RZUEVTLmxpbmU6XG4gICAgICByZXR1cm4gZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGdldFBvc2l0aW9uKHtkYXRhfSk7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkgJiZcbiAgICAgICAgICBbXG4gICAgICAgICAgICBbcG9zWzBdLCBwb3NbMV1dLFxuICAgICAgICAgICAgW3Bvc1szXSwgcG9zWzRdXVxuICAgICAgICAgIF0uZXZlcnkocG9pbnQgPT4gaXNJblBvbHlnb24ocG9pbnQsIGZpbHRlci52YWx1ZSkpXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgIGNhc2UgTEFZRVJfVFlQRVMuaGV4YWdvbklkOlxuICAgICAgaWYgKGxheWVyLmRhdGFUb0ZlYXR1cmUgJiYgbGF5ZXIuZGF0YVRvRmVhdHVyZS5jZW50cm9pZHMpIHtcbiAgICAgICAgcmV0dXJuIChkYXRhLCBpbmRleCkgPT4ge1xuICAgICAgICAgIC8vIG51bGwgb3IgZ2V0Q2VudHJvaWQoe2lkfSlcbiAgICAgICAgICBjb25zdCBjZW50cm9pZCA9IGxheWVyLmRhdGFUb0ZlYXR1cmUuY2VudHJvaWRzW2luZGV4XTtcbiAgICAgICAgICByZXR1cm4gY2VudHJvaWQgJiYgaXNJblBvbHlnb24oY2VudHJvaWQsIGZpbHRlci52YWx1ZSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YSA9PiB7XG4gICAgICAgIGNvbnN0IGlkID0gZ2V0UG9zaXRpb24oe2RhdGF9KTtcbiAgICAgICAgaWYgKCFoM0lzVmFsaWQoaWQpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBvcyA9IGdldENlbnRyb2lkKHtpZH0pO1xuICAgICAgICByZXR1cm4gcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkgJiYgaXNJblBvbHlnb24ocG9zLCBmaWx0ZXIudmFsdWUpO1xuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuICgpID0+IHRydWU7XG4gIH1cbn07XG5cbi8qKlxuICogQHBhcmFtIGZpZWxkIGRhdGFzZXQgRmllbGRcbiAqIEBwYXJhbSBkYXRhSWQgRGF0YXNldCBpZFxuICogQHBhcmFtIGZpbHRlciBGaWx0ZXIgb2JqZWN0XG4gKiBAcGFyYW0gbGF5ZXJzIGxpc3Qgb2YgbGF5ZXJzIHRvIGZpbHRlciB1cG9uXG4gKiBAcmV0dXJuIGZpbHRlckZ1bmN0aW9uXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRGaWx0ZXJGdW5jdGlvbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlckZ1bmN0aW9uKGZpZWxkLCBkYXRhSWQsIGZpbHRlciwgbGF5ZXJzKSB7XG4gIC8vIGZpZWxkIGNvdWxkIGJlIG51bGwgaW4gcG9seWdvbiBmaWx0ZXJcbiAgY29uc3QgdmFsdWVBY2Nlc3NvciA9IGZpZWxkID8gZmllbGQudmFsdWVBY2Nlc3NvciA6IGRhdGEgPT4gbnVsbDtcbiAgY29uc3QgZGVmYXVsdEZ1bmMgPSBkID0+IHRydWU7XG5cbiAgc3dpdGNoIChmaWx0ZXIudHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgICAgcmV0dXJuIGRhdGEgPT4gaXNJblJhbmdlKHZhbHVlQWNjZXNzb3IoZGF0YSksIGZpbHRlci52YWx1ZSk7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3Q6XG4gICAgICByZXR1cm4gZGF0YSA9PiBmaWx0ZXIudmFsdWUuaW5jbHVkZXModmFsdWVBY2Nlc3NvcihkYXRhKSk7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIGRhdGEgPT4gdmFsdWVBY2Nlc3NvcihkYXRhKSA9PT0gZmlsdGVyLnZhbHVlO1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRGdW5jO1xuICAgICAgfVxuICAgICAgY29uc3QgbWFwcGVkVmFsdWUgPSBnZXQoZmllbGQsIFsnZmlsdGVyUHJvcHMnLCAnbWFwcGVkVmFsdWUnXSk7XG4gICAgICBjb25zdCBhY2Nlc3NvciA9IEFycmF5LmlzQXJyYXkobWFwcGVkVmFsdWUpXG4gICAgICAgID8gKGRhdGEsIGluZGV4KSA9PiBtYXBwZWRWYWx1ZVtpbmRleF1cbiAgICAgICAgOiBkYXRhID0+IHRpbWVUb1VuaXhNaWxsaSh2YWx1ZUFjY2Vzc29yKGRhdGEpLCBmaWVsZC5mb3JtYXQpO1xuICAgICAgcmV0dXJuIChkYXRhLCBpbmRleCkgPT4gaXNJblJhbmdlKGFjY2Vzc29yKGRhdGEsIGluZGV4KSwgZmlsdGVyLnZhbHVlKTtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5wb2x5Z29uOlxuICAgICAgaWYgKCFsYXllcnMgfHwgIWxheWVycy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRGdW5jO1xuICAgICAgfVxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgbGF5ZXJGaWx0ZXJGdW5jdGlvbnMgPSBmaWx0ZXIubGF5ZXJJZFxuICAgICAgICAubWFwKGlkID0+IGxheWVycy5maW5kKGwgPT4gbC5pZCA9PT0gaWQpKVxuICAgICAgICAuZmlsdGVyKGwgPT4gbCAmJiBsLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFJZClcbiAgICAgICAgLm1hcChsYXllciA9PiBnZXRQb2x5Z29uRmlsdGVyRnVuY3RvcihsYXllciwgZmlsdGVyKSk7XG5cbiAgICAgIHJldHVybiAoZGF0YSwgaW5kZXgpID0+IGxheWVyRmlsdGVyRnVuY3Rpb25zLmV2ZXJ5KGZpbHRlckZ1bmMgPT4gZmlsdGVyRnVuYyhkYXRhLCBpbmRleCkpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZGVmYXVsdEZ1bmM7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUZpbHRlckRhdGFJZChkYXRhSWQpIHtcbiAgcmV0dXJuIGdldERlZmF1bHRGaWx0ZXIoZGF0YUlkKTtcbn1cblxuLyoqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5maWx0ZXJEYXRhQnlGaWx0ZXJUeXBlc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckRhdGFCeUZpbHRlclR5cGVzKHtkeW5hbWljRG9tYWluRmlsdGVycywgY3B1RmlsdGVycywgZmlsdGVyRnVuY3N9LCBhbGxEYXRhKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAuLi4oZHluYW1pY0RvbWFpbkZpbHRlcnMgPyB7ZmlsdGVyZWRJbmRleEZvckRvbWFpbjogW119IDoge30pLFxuICAgIC4uLihjcHVGaWx0ZXJzID8ge2ZpbHRlcmVkSW5kZXg6IFtdfSA6IHt9KVxuICB9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGQgPSBhbGxEYXRhW2ldO1xuXG4gICAgY29uc3QgbWF0Y2hGb3JEb21haW4gPVxuICAgICAgZHluYW1pY0RvbWFpbkZpbHRlcnMgJiYgZHluYW1pY0RvbWFpbkZpbHRlcnMuZXZlcnkoZmlsdGVyID0+IGZpbHRlckZ1bmNzW2ZpbHRlci5pZF0oZCwgaSkpO1xuXG4gICAgaWYgKG1hdGNoRm9yRG9tYWluKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXN1bHQuZmlsdGVyZWRJbmRleEZvckRvbWFpbi5wdXNoKGkpO1xuICAgIH1cblxuICAgIGNvbnN0IG1hdGNoRm9yUmVuZGVyID0gY3B1RmlsdGVycyAmJiBjcHVGaWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PiBmaWx0ZXJGdW5jc1tmaWx0ZXIuaWRdKGQsIGkpKTtcblxuICAgIGlmIChtYXRjaEZvclJlbmRlcikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcmVzdWx0LmZpbHRlcmVkSW5kZXgucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldCBhIHJlY29yZCBvZiBmaWx0ZXJzIGJhc2VkIG9uIGRvbWFpbiB0eXBlIGFuZCBncHUgLyBjcHVcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldEZpbHRlclJlY29yZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclJlY29yZChkYXRhSWQsIGZpbHRlcnMsIG9wdCA9IHt9KSB7XG4gIC8qKlxuICAgKiBAdHlwZSB7RmlsdGVyUmVjb3JkfVxuICAgKi9cbiAgY29uc3QgZmlsdGVyUmVjb3JkID0ge1xuICAgIGR5bmFtaWNEb21haW46IFtdLFxuICAgIGZpeGVkRG9tYWluOiBbXSxcbiAgICBjcHU6IFtdLFxuICAgIGdwdTogW11cbiAgfTtcblxuICBmaWx0ZXJzLmZvckVhY2goZiA9PiB7XG4gICAgaWYgKGlzVmFsaWRGaWx0ZXJWYWx1ZShmLnR5cGUsIGYudmFsdWUpICYmIHRvQXJyYXkoZi5kYXRhSWQpLmluY2x1ZGVzKGRhdGFJZCkpIHtcbiAgICAgIChmLmZpeGVkRG9tYWluIHx8IG9wdC5pZ25vcmVEb21haW5cbiAgICAgICAgPyBmaWx0ZXJSZWNvcmQuZml4ZWREb21haW5cbiAgICAgICAgOiBmaWx0ZXJSZWNvcmQuZHluYW1pY0RvbWFpblxuICAgICAgKS5wdXNoKGYpO1xuXG4gICAgICAoZi5ncHUgJiYgIW9wdC5jcHVPbmx5ID8gZmlsdGVyUmVjb3JkLmdwdSA6IGZpbHRlclJlY29yZC5jcHUpLnB1c2goZik7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZmlsdGVyUmVjb3JkO1xufVxuXG4vKipcbiAqIENvbXBhcmUgZmlsdGVyIHJlY29yZHMgdG8gZ2V0IHdoYXQgaGFzIGNoYW5nZWRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmRpZmZGaWx0ZXJzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlmZkZpbHRlcnMoZmlsdGVyUmVjb3JkLCBvbGRGaWx0ZXJSZWNvcmQgPSB7fSkge1xuICBsZXQgZmlsdGVyQ2hhbmdlZCA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKGZpbHRlclJlY29yZCkuZm9yRWFjaCgoW3JlY29yZCwgaXRlbXNdKSA9PiB7XG4gICAgaXRlbXMuZm9yRWFjaChmaWx0ZXIgPT4ge1xuICAgICAgY29uc3Qgb2xkRmlsdGVyID0gKG9sZEZpbHRlclJlY29yZFtyZWNvcmRdIHx8IFtdKS5maW5kKGYgPT4gZi5pZCA9PT0gZmlsdGVyLmlkKTtcblxuICAgICAgaWYgKCFvbGRGaWx0ZXIpIHtcbiAgICAgICAgLy8gYWRkZWRcbiAgICAgICAgZmlsdGVyQ2hhbmdlZCA9IHNldChbcmVjb3JkLCBmaWx0ZXIuaWRdLCAnYWRkZWQnLCBmaWx0ZXJDaGFuZ2VkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGNoZWNrICB3aGF0IGhhcyBjaGFuZ2VkXG4gICAgICAgIFsnbmFtZScsICd2YWx1ZScsICdkYXRhSWQnXS5mb3JFYWNoKHByb3AgPT4ge1xuICAgICAgICAgIGlmIChmaWx0ZXJbcHJvcF0gIT09IG9sZEZpbHRlcltwcm9wXSkge1xuICAgICAgICAgICAgZmlsdGVyQ2hhbmdlZCA9IHNldChbcmVjb3JkLCBmaWx0ZXIuaWRdLCBgJHtwcm9wfV9jaGFuZ2VkYCwgZmlsdGVyQ2hhbmdlZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIChvbGRGaWx0ZXJSZWNvcmRbcmVjb3JkXSB8fCBbXSkuZm9yRWFjaChvbGRGaWx0ZXIgPT4ge1xuICAgICAgLy8gZGVsZXRlZFxuICAgICAgaWYgKCFpdGVtcy5maW5kKGYgPT4gZi5pZCA9PT0gb2xkRmlsdGVyLmlkKSkge1xuICAgICAgICBmaWx0ZXJDaGFuZ2VkID0gc2V0KFtyZWNvcmQsIG9sZEZpbHRlci5pZF0sICdkZWxldGVkJywgZmlsdGVyQ2hhbmdlZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoIWZpbHRlckNoYW5nZWRbcmVjb3JkXSkge1xuICAgICAgZmlsdGVyQ2hhbmdlZFtyZWNvcmRdID0gbnVsbDtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIEB0cy1pZ25vcmVcbiAgcmV0dXJuIGZpbHRlckNoYW5nZWQ7XG59XG4vKipcbiAqIENhbGwgYnkgcGFyc2luZyBmaWx0ZXJzIGZyb20gVVJMXG4gKiBDaGVjayBpZiB2YWx1ZSBvZiBmaWx0ZXIgd2l0aGluIGZpbHRlciBkb21haW4sIGlmIG5vdCBhZGp1c3QgaXQgdG8gbWF0Y2hcbiAqIGZpbHRlciBkb21haW5cbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5hZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWlufVxuICogQHJldHVybnMgdmFsdWUgLSBhZGp1c3RlZCB2YWx1ZSB0byBtYXRjaCBmaWx0ZXIgb3IgbnVsbCB0byByZW1vdmUgZmlsdGVyXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluKHZhbHVlLCB7ZG9tYWluLCB0eXBlfSkge1xuICBpZiAoIWRvbWFpbiB8fCAhdHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdmFsdWUubGVuZ3RoICE9PSAyKSB7XG4gICAgICAgIHJldHVybiBkb21haW4ubWFwKGQgPT4gZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB2YWx1ZS5tYXAoKGQsIGkpID0+IChub3ROdWxsb3JVbmRlZmluZWQoZCkgJiYgaXNJblJhbmdlKGQsIGRvbWFpbikgPyBkIDogZG9tYWluW2ldKSk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDpcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgfVxuICAgICAgY29uc3QgZmlsdGVyZWRWYWx1ZSA9IHZhbHVlLmZpbHRlcihkID0+IGRvbWFpbi5pbmNsdWRlcyhkKSk7XG4gICAgICByZXR1cm4gZmlsdGVyZWRWYWx1ZS5sZW5ndGggPyBmaWx0ZXJlZFZhbHVlIDogW107XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gZG9tYWluLmluY2x1ZGVzKHZhbHVlKSA/IHZhbHVlIDogdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogQ2FsY3VsYXRlIG51bWVyaWMgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0TnVtZXJpY0ZpZWxkRG9tYWlufVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVtZXJpY0ZpZWxkRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpIHtcbiAgbGV0IGRvbWFpbiA9IFswLCAxXTtcbiAgbGV0IHN0ZXAgPSAwLjE7XG5cbiAgY29uc3QgbWFwcGVkVmFsdWUgPSBBcnJheS5pc0FycmF5KGRhdGEpID8gZGF0YS5tYXAodmFsdWVBY2Nlc3NvcikgOiBbXTtcblxuICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSAmJiBkYXRhLmxlbmd0aCA+IDEpIHtcbiAgICBkb21haW4gPSBTY2FsZVV0aWxzLmdldExpbmVhckRvbWFpbihtYXBwZWRWYWx1ZSk7XG4gICAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcblxuICAgIC8vIGluIGNhc2UgZXF1YWwgZG9tYWluLCBbOTYsIDk2XSwgd2hpY2ggd2lsbCBicmVhayBxdWFudGl6ZSBzY2FsZVxuICAgIGlmICghZGlmZikge1xuICAgICAgZG9tYWluWzFdID0gZG9tYWluWzBdICsgMTtcbiAgICB9XG5cbiAgICBzdGVwID0gZ2V0TnVtZXJpY1N0ZXBTaXplKGRpZmYpIHx8IHN0ZXA7XG4gICAgZG9tYWluWzBdID0gZm9ybWF0TnVtYmVyQnlTdGVwKGRvbWFpblswXSwgc3RlcCwgJ2Zsb29yJyk7XG4gICAgZG9tYWluWzFdID0gZm9ybWF0TnVtYmVyQnlTdGVwKGRvbWFpblsxXSwgc3RlcCwgJ2NlaWwnKTtcbiAgfVxuXG4gIC8vIEB0cy1pZ25vcmVcbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgc3RlcCBzaXplIGZvciByYW5nZSBhbmQgdGltZXJhbmdlIGZpbHRlclxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldE51bWVyaWNTdGVwU2l6ZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWVyaWNTdGVwU2l6ZShkaWZmKSB7XG4gIGRpZmYgPSBNYXRoLmFicyhkaWZmKTtcblxuICBpZiAoZGlmZiA+IDEwMCkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPiAzKSB7XG4gICAgcmV0dXJuIDAuMDE7XG4gIH0gZWxzZSBpZiAoZGlmZiA+IDEpIHtcbiAgICByZXR1cm4gMC4wMDE7XG4gIH1cbiAgLy8gVHJ5IHRvIGdldCBhdCBsZWFzdCAxMDAwIHN0ZXBzIC0gYW5kIGtlZXAgdGhlIHN0ZXAgc2l6ZSBiZWxvdyB0aGF0IG9mXG4gIC8vIHRoZSAoZGlmZiA+IDEpIGNhc2UuXG4gIGNvbnN0IHggPSBkaWZmIC8gMTAwMDtcbiAgLy8gRmluZCB0aGUgZXhwb25lbnQgYW5kIHRydW5jYXRlIHRvIDEwIHRvIHRoZSBwb3dlciBvZiB0aGF0IGV4cG9uZW50XG5cbiAgY29uc3QgZXhwb25lbnRpYWxGb3JtID0geC50b0V4cG9uZW50aWFsKCk7XG4gIGNvbnN0IGV4cG9uZW50ID0gcGFyc2VGbG9hdChleHBvbmVudGlhbEZvcm0uc3BsaXQoJ2UnKVsxXSk7XG5cbiAgLy8gR2V0dGluZyByZWFkeSBmb3Igbm9kZSAxMlxuICAvLyB0aGlzIGlzIHdoeSB3ZSBuZWVkIGRlY2ltYWwuanNcbiAgLy8gTWF0aC5wb3coMTAsIC01KSA9IDAuMDAwMDA5OTk5OTk5OTk5OTk5OTk5XG4gIC8vIHRoZSBhYm92ZSByZXN1bHQgc2hvd3MgaW4gYnJvd3NlciBhbmQgbm9kZSAxMFxuICAvLyBub2RlIDEyIGJlaGF2ZXMgY29ycmVjdGx5XG4gIHJldHVybiBuZXcgRGVjaW1hbCgxMCkucG93KGV4cG9uZW50KS50b051bWJlcigpO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aW1lc3RhbXAgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0VGltZXN0YW1wRmllbGREb21haW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lc3RhbXBGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIC8vIHRvIGF2b2lkIGNvbnZlcnRpbmcgc3RyaW5nIGZvcm1hdCB0aW1lIHRvIGVwb2NoXG4gIC8vIGV2ZXJ5IHRpbWUgd2UgY29tcGFyZSB3ZSBzdG9yZSBhIHZhbHVlIG1hcHBlZCB0byBpbnQgaW4gZmlsdGVyIGRvbWFpblxuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG4gIGNvbnN0IGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0TGluZWFyRG9tYWluKG1hcHBlZFZhbHVlKTtcbiAgY29uc3QgZGVmYXVsdFRpbWVGb3JtYXQgPSBnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIoZG9tYWluKTtcblxuICBsZXQgc3RlcCA9IDAuMDE7XG5cbiAgY29uc3QgZGlmZiA9IGRvbWFpblsxXSAtIGRvbWFpblswXTtcbiAgY29uc3QgZW50cnkgPSBUaW1lc3RhbXBTdGVwTWFwLmZpbmQoZiA9PiBmLm1heCA+PSBkaWZmKTtcbiAgaWYgKGVudHJ5KSB7XG4gICAgc3RlcCA9IGVudHJ5LnN0ZXA7XG4gIH1cblxuICBjb25zdCB7aGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX0gPSBnZXRIaXN0b2dyYW0oZG9tYWluLCBtYXBwZWRWYWx1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBkb21haW4sXG4gICAgc3RlcCxcbiAgICBtYXBwZWRWYWx1ZSxcbiAgICBoaXN0b2dyYW0sXG4gICAgZW5sYXJnZWRIaXN0b2dyYW0sXG4gICAgZGVmYXVsdFRpbWVGb3JtYXRcbiAgfTtcbn1cblxuLyoqXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuaGlzdG9ncmFtQ29uc3RydWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIGJpbnMpIHtcbiAgcmV0dXJuIGQzSGlzdG9ncmFtKClcbiAgICAudGhyZXNob2xkcyh0aWNrcyhkb21haW5bMF0sIGRvbWFpblsxXSwgYmlucykpXG4gICAgLmRvbWFpbihkb21haW4pKG1hcHBlZFZhbHVlKVxuICAgIC5tYXAoYmluID0+ICh7XG4gICAgICBjb3VudDogYmluLmxlbmd0aCxcbiAgICAgIHgwOiBiaW4ueDAsXG4gICAgICB4MTogYmluLngxXG4gICAgfSkpO1xufVxuLyoqXG4gKiBDYWxjdWxhdGUgaGlzdG9ncmFtIGZyb20gZG9tYWluIGFuZCBhcnJheSBvZiB2YWx1ZXNcbiAqXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5nZXRIaXN0b2dyYW19XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRIaXN0b2dyYW0oZG9tYWluLCBtYXBwZWRWYWx1ZSkge1xuICBjb25zdCBoaXN0b2dyYW0gPSBoaXN0b2dyYW1Db25zdHJ1Y3QoZG9tYWluLCBtYXBwZWRWYWx1ZSwgaGlzdG9ncmFtQmlucyk7XG4gIGNvbnN0IGVubGFyZ2VkSGlzdG9ncmFtID0gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIGVubGFyZ2VkSGlzdG9ncmFtQmlucyk7XG5cbiAgcmV0dXJuIHtoaXN0b2dyYW0sIGVubGFyZ2VkSGlzdG9ncmFtfTtcbn1cblxuLyoqXG4gKiByb3VuZCBudW1iZXIgYmFzZWQgb24gc3RlcFxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB2YWxcbiAqIEBwYXJhbSB7TnVtYmVyfSBzdGVwXG4gKiBAcGFyYW0ge3N0cmluZ30gYm91bmRcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IHJvdW5kZWQgbnVtYmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXROdW1iZXJCeVN0ZXAodmFsLCBzdGVwLCBib3VuZCkge1xuICBpZiAoYm91bmQgPT09ICdmbG9vcicpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcih2YWwgKiAoMSAvIHN0ZXApKSAvICgxIC8gc3RlcCk7XG4gIH1cblxuICByZXR1cm4gTWF0aC5jZWlsKHZhbCAqICgxIC8gc3RlcCkpIC8gKDEgLyBzdGVwKTtcbn1cblxuLyoqXG4gKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuaXNJblJhbmdlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJblJhbmdlKHZhbCwgZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHZhbCA+PSBkb21haW5bMF0gJiYgdmFsIDw9IGRvbWFpblsxXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgYSBwb2ludCBpcyB3aXRoaW4gdGhlIHByb3ZpZGVkIHBvbHlnb25cbiAqXG4gKiBAcGFyYW0gcG9pbnQgYXMgaW5wdXQgc2VhcmNoIFtsYXQsIGxuZ11cbiAqIEBwYXJhbSBwb2x5Z29uIFBvaW50cyBtdXN0IGJlIHdpdGhpbiB0aGVzZSAoTXVsdGkpUG9seWdvbihzKVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5Qb2x5Z29uKHBvaW50LCBwb2x5Z29uKSB7XG4gIHJldHVybiBib29sZWFuV2l0aGluKHR1cmZQb2ludChwb2ludCksIHBvbHlnb24pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUaW1lRG9tYWluKGRvbWFpbikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShkb21haW4pICYmIGRvbWFpbi5ldmVyeShOdW1iZXIuaXNGaW5pdGUpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihkb21haW4pIHtcbiAgaWYgKCFpc1ZhbGlkVGltZURvbWFpbihkb21haW4pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuXG4gIC8vIExvY2FsIGF3YXJlIGZvcm1hdHNcbiAgLy8gaHR0cHM6Ly9tb21lbnRqcy5jb20vZG9jcy8jL3BhcnNpbmcvc3RyaW5nLWZvcm1hdFxuICByZXR1cm4gZGlmZiA+IGR1cmF0aW9uWWVhciA/ICdMJyA6IGRpZmYgPiBkdXJhdGlvbkRheSA/ICdMIExUJyA6ICdMIExUUyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlcihkb21haW4pIHtcbiAgaWYgKCFpc1ZhbGlkVGltZURvbWFpbihkb21haW4pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICByZXR1cm4gZGlmZiA+IGR1cmF0aW9uV2Vla1xuICAgID8gJ0wnXG4gICAgOiBkaWZmID4gZHVyYXRpb25EYXlcbiAgICA/ICdMIExUJ1xuICAgIDogZGlmZiA+IGR1cmF0aW9uSG91clxuICAgID8gJ0xUJ1xuICAgIDogJ0xUUyc7XG59XG5cbi8qKlxuICogU2FuaXR5IGNoZWNrIG9uIGZpbHRlcnMgdG8gcHJlcGFyZSBmb3Igc2F2ZVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuaXNWYWxpZEZpbHRlclZhbHVlfVxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZEZpbHRlclZhbHVlKHR5cGUsIHZhbHVlKSB7XG4gIGlmICghdHlwZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzd2l0Y2ggKHR5cGUpIHtcbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gdmFsdWUgPT09IHRydWUgfHwgdmFsdWUgPT09IGZhbHNlO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMucmFuZ2U6XG4gICAgY2FzZSBGSUxURVJfVFlQRVMudGltZVJhbmdlOlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmV2ZXJ5KHYgPT4gdiAhPT0gbnVsbCAmJiAhaXNOYU4odikpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3Q6XG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgQm9vbGVhbih2YWx1ZS5sZW5ndGgpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMuaW5wdXQ6XG4gICAgICByZXR1cm4gQm9vbGVhbih2YWx1ZS5sZW5ndGgpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMucG9seWdvbjpcbiAgICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gZ2V0KHZhbHVlLCBbJ2dlb21ldHJ5JywgJ2Nvb3JkaW5hdGVzJ10pO1xuICAgICAgcmV0dXJuIEJvb2xlYW4odmFsdWUgJiYgdmFsdWUuaWQgJiYgY29vcmRpbmF0ZXMpO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG59XG5cbi8qKlxuICpcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldEZpbHRlclBsb3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWx0ZXJQbG90KGZpbHRlciwgZGF0YXNldCkge1xuICBpZiAoZmlsdGVyLnBsb3RUeXBlID09PSBQTE9UX1RZUEVTLmhpc3RvZ3JhbSB8fCAhZmlsdGVyLnlBeGlzKSB7XG4gICAgLy8gaGlzdG9ncmFtIHNob3VsZCBiZSBjYWxjdWxhdGVkIHdoZW4gY3JlYXRlIGZpbHRlclxuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGNvbnN0IHttYXBwZWRWYWx1ZSA9IFtdfSA9IGZpbHRlcjtcbiAgY29uc3Qge3lBeGlzfSA9IGZpbHRlcjtcbiAgY29uc3QgZmllbGRJZHggPSBkYXRhc2V0LmdldENvbHVtbkZpZWxkSWR4KHlBeGlzLm5hbWUpO1xuICBpZiAoZmllbGRJZHggPCAwKSB7XG4gICAgQ29uc29sZS53YXJuKGB5QXhpcyAke3lBeGlzLm5hbWV9IGRvZXMgbm90IGV4aXN0IGluIGRhdGFzZXRgKTtcbiAgICByZXR1cm4ge2xpbmVDaGFydDoge30sIHlBeGlzfTtcbiAgfVxuXG4gIC8vIHJldHVybiBsaW5lQ2hhcnRcbiAgY29uc3Qgc2VyaWVzID0gZGF0YXNldC5hbGxEYXRhXG4gICAgLm1hcCgoZCwgaSkgPT4gKHtcbiAgICAgIHg6IG1hcHBlZFZhbHVlW2ldLFxuICAgICAgeTogZFtmaWVsZElkeF1cbiAgICB9KSlcbiAgICAuZmlsdGVyKCh7eCwgeX0pID0+IE51bWJlci5pc0Zpbml0ZSh4KSAmJiBOdW1iZXIuaXNGaW5pdGUoeSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGFzY2VuZGluZyhhLngsIGIueCkpO1xuXG4gIGNvbnN0IHlEb21haW4gPSBleHRlbnQoc2VyaWVzLCBkID0+IGQueSk7XG4gIGNvbnN0IHhEb21haW4gPSBbc2VyaWVzWzBdLngsIHNlcmllc1tzZXJpZXMubGVuZ3RoIC0gMV0ueF07XG5cbiAgcmV0dXJuIHtsaW5lQ2hhcnQ6IHtzZXJpZXMsIHlEb21haW4sIHhEb21haW59LCB5QXhpc307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUoZmlsdGVyKSB7XG4gIGNvbnN0IGZpbHRlclBsb3RUeXBlcyA9IFN1cHBvcnRlZFBsb3RUeXBlW2ZpbHRlci50eXBlXTtcbiAgaWYgKCFmaWx0ZXJQbG90VHlwZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghZmlsdGVyLnlBeGlzKSB7XG4gICAgcmV0dXJuIGZpbHRlclBsb3RUeXBlcy5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlclBsb3RUeXBlc1tmaWx0ZXIueUF4aXMudHlwZV0gfHwgbnVsbDtcbn1cblxuLyoqXG4gKlxuICogQHBhcmFtIGRhdGFzZXRJZHMgbGlzdCBvZiBkYXRhc2V0IGlkcyB0byBiZSBmaWx0ZXJlZFxuICogQHBhcmFtIGRhdGFzZXRzIGFsbCBkYXRhc2V0c1xuICogQHBhcmFtIGZpbHRlcnMgYWxsIGZpbHRlcnMgdG8gYmUgYXBwbGllZCB0byBkYXRhc2V0c1xuICogQHJldHVybiBkYXRhc2V0cyAtIG5ldyB1cGRhdGVkIGRhdGFzZXRzXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5hcHBseUZpbHRlcnNUb0RhdGFzZXRzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlGaWx0ZXJzVG9EYXRhc2V0cyhkYXRhc2V0SWRzLCBkYXRhc2V0cywgZmlsdGVycywgbGF5ZXJzKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0b0FycmF5KGRhdGFzZXRJZHMpO1xuICByZXR1cm4gZGF0YUlkcy5yZWR1Y2UoKGFjYywgZGF0YUlkKSA9PiB7XG4gICAgY29uc3QgbGF5ZXJzVG9GaWx0ZXIgPSAobGF5ZXJzIHx8IFtdKS5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFJZCk7XG4gICAgY29uc3QgYXBwbGllZEZpbHRlcnMgPSBmaWx0ZXJzLmZpbHRlcihkID0+IHNob3VsZEFwcGx5RmlsdGVyKGQsIGRhdGFJZCkpO1xuICAgIGNvbnN0IHRhYmxlID0gZGF0YXNldHNbZGF0YUlkXTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5hY2MsXG4gICAgICBbZGF0YUlkXTogdGFibGUuZmlsdGVyVGFibGUoYXBwbGllZEZpbHRlcnMsIGxheWVyc1RvRmlsdGVyLCB7fSlcbiAgICB9O1xuICB9LCBkYXRhc2V0cyk7XG59XG5cbi8qKlxuICogQXBwbGllcyBhIG5ldyBmaWVsZCBuYW1lIHZhbHVlIHRvIGZpZWx0ZXIgYW5kIHVwZGF0ZSBib3RoIGZpbHRlciBhbmQgZGF0YXNldFxuICogQHBhcmFtIGZpbHRlciAtIHRvIGJlIGFwcGxpZWQgdGhlIG5ldyBmaWVsZCBuYW1lIG9uXG4gKiBAcGFyYW0gZGF0YXNldCAtIGRhdGFzZXQgdGhlIGZpZWxkIGJlbG9uZ3MgdG9cbiAqIEBwYXJhbSBmaWVsZE5hbWUgLSBmaWVsZC5uYW1lXG4gKiBAcGFyYW0gZmlsdGVyRGF0YXNldEluZGV4IC0gZmllbGQubmFtZVxuICogQHBhcmFtIG9wdGlvblxuICogQHJldHVybiAtIHtmaWx0ZXIsIGRhdGFzZXRzfVxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuYXBwbHlGaWx0ZXJGaWVsZE5hbWV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUZpbHRlckZpZWxkTmFtZShmaWx0ZXIsIGRhdGFzZXQsIGZpZWxkTmFtZSwgZmlsdGVyRGF0YXNldEluZGV4ID0gMCwgb3B0aW9uKSB7XG4gIC8vIHVzaW5nIGZpbHRlckRhdGFzZXRJbmRleCB3ZSBjYW4gZmlsdGVyIG9ubHkgdGhlIHNwZWNpZmllZCBkYXRhc2V0XG4gIGNvbnN0IG1lcmdlRG9tYWluID0gb3B0aW9uICYmIG9wdGlvbi5oYXNPd25Qcm9wZXJ0eSgnbWVyZ2VEb21haW4nKSA/IG9wdGlvbi5tZXJnZURvbWFpbiA6IGZhbHNlO1xuXG4gIGNvbnN0IGZpZWxkSW5kZXggPSBkYXRhc2V0LmdldENvbHVtbkZpZWxkSWR4KGZpZWxkTmFtZSk7XG4gIC8vIGlmIG5vIGZpZWxkIHdpdGggc2FtZSBuYW1lIGlzIGZvdW5kLCBtb3ZlIHRvIHRoZSBuZXh0IGRhdGFzZXRzXG4gIGlmIChmaWVsZEluZGV4ID09PSAtMSkge1xuICAgIC8vIHRocm93IG5ldyBFcnJvcihgZmllbGRJbmRleCBub3QgZm91bmQuIERhdGFzZXQgbXVzdCBjb250YWluIGEgcHJvcGVydHkgd2l0aCBuYW1lOiAke2ZpZWxkTmFtZX1gKTtcbiAgICByZXR1cm4ge2ZpbHRlcjogbnVsbCwgZGF0YXNldH07XG4gIH1cblxuICAvLyBUT0RPOiB2YWxpZGF0ZSBmaWVsZCB0eXBlXG4gIGNvbnN0IGZpbHRlclByb3BzID0gZGF0YXNldC5nZXRDb2x1bW5GaWx0ZXJQcm9wcyhmaWVsZE5hbWUpO1xuXG4gIGNvbnN0IG5ld0ZpbHRlciA9IHtcbiAgICAuLi4obWVyZ2VEb21haW4gPyBtZXJnZUZpbHRlckRvbWFpblN0ZXAoZmlsdGVyLCBmaWx0ZXJQcm9wcykgOiB7Li4uZmlsdGVyLCAuLi5maWx0ZXJQcm9wc30pLFxuICAgIG5hbWU6IE9iamVjdC5hc3NpZ24oWy4uLnRvQXJyYXkoZmlsdGVyLm5hbWUpXSwge1tmaWx0ZXJEYXRhc2V0SW5kZXhdOiBmaWVsZE5hbWV9KSxcbiAgICBmaWVsZElkeDogT2JqZWN0LmFzc2lnbihbLi4udG9BcnJheShmaWx0ZXIuZmllbGRJZHgpXSwge1xuICAgICAgW2ZpbHRlckRhdGFzZXRJbmRleF06IGZpZWxkSW5kZXhcbiAgICB9KSxcbiAgICAvLyBUT0RPLCBzaW5jZSB3ZSBhbGxvdyB0byBhZGQgbXVsdGlwbGUgZmllbGRzIHRvIGEgZmlsdGVyIHdlIGNhbiBubyBsb25nZXIgZnJlZXplIHRoZSBmaWx0ZXJcbiAgICBmcmVlemU6IHRydWVcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGZpbHRlcjogbmV3RmlsdGVyLFxuICAgIGRhdGFzZXRcbiAgfTtcbn1cblxuLyoqXG4gKiBNZXJnZSBvbmUgZmlsdGVyIHdpdGggb3RoZXIgZmlsdGVyIHByb3AgZG9tYWluXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5tZXJnZUZpbHRlckRvbWFpblN0ZXB9XG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIGNvbXBsZXhpdHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUZpbHRlckRvbWFpblN0ZXAoZmlsdGVyLCBmaWx0ZXJQcm9wcykge1xuICBpZiAoIWZpbHRlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFmaWx0ZXJQcm9wcykge1xuICAgIHJldHVybiBmaWx0ZXI7XG4gIH1cblxuICBpZiAoKGZpbHRlci5maWVsZFR5cGUgJiYgZmlsdGVyLmZpZWxkVHlwZSAhPT0gZmlsdGVyUHJvcHMuZmllbGRUeXBlKSB8fCAhZmlsdGVyUHJvcHMuZG9tYWluKSB7XG4gICAgcmV0dXJuIGZpbHRlcjtcbiAgfVxuXG4gIGNvbnN0IGNvbWJpbmVkRG9tYWluID0gIWZpbHRlci5kb21haW5cbiAgICA/IGZpbHRlclByb3BzLmRvbWFpblxuICAgIDogWy4uLihmaWx0ZXIuZG9tYWluIHx8IFtdKSwgLi4uKGZpbHRlclByb3BzLmRvbWFpbiB8fCBbXSldLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcblxuICBjb25zdCBuZXdGaWx0ZXIgPSB7XG4gICAgLi4uZmlsdGVyLFxuICAgIC4uLmZpbHRlclByb3BzLFxuICAgIGRvbWFpbjogW2NvbWJpbmVkRG9tYWluWzBdLCBjb21iaW5lZERvbWFpbltjb21iaW5lZERvbWFpbi5sZW5ndGggLSAxXV1cbiAgfTtcblxuICBzd2l0Y2ggKGZpbHRlclByb3BzLmZpZWxkVHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnN0cmluZzpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5kYXRlOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICBkb21haW46IHVuaXF1ZShjb21iaW5lZERvbWFpbikuc29ydCgpXG4gICAgICB9O1xuXG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wOlxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3Qgc3RlcCA9IGZpbHRlci5zdGVwIDwgZmlsdGVyUHJvcHMuc3RlcCA/IGZpbHRlci5zdGVwIDogZmlsdGVyUHJvcHMuc3RlcDtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4ubmV3RmlsdGVyLFxuICAgICAgICBzdGVwXG4gICAgICB9O1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIG5ld0ZpbHRlcjtcbiAgfVxufVxuLyogZXNsaW50LWVuYWJsZSBjb21wbGV4aXR5ICovXG5cbi8qKlxuICogR2VuZXJhdGVzIHBvbHlnb24gZmlsdGVyXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5mZWF0dXJlVG9GaWx0ZXJWYWx1ZX1cbiAqL1xuZXhwb3J0IGNvbnN0IGZlYXR1cmVUb0ZpbHRlclZhbHVlID0gKGZlYXR1cmUsIGZpbHRlcklkLCBwcm9wZXJ0aWVzID0ge30pID0+ICh7XG4gIC4uLmZlYXR1cmUsXG4gIGlkOiBmZWF0dXJlLmlkLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgLi4uZmVhdHVyZS5wcm9wZXJ0aWVzLFxuICAgIC4uLnByb3BlcnRpZXMsXG4gICAgZmlsdGVySWRcbiAgfVxufSk7XG5cbi8qKlxuICogQHR5cGUge3R5cGVvZiBpbXBvcnQoJy4vZmlsdGVyLXV0aWxzJykuZ2V0RmlsdGVySWRJbkZlYXR1cmV9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRGaWx0ZXJJZEluRmVhdHVyZSA9IGYgPT4gZ2V0KGYsIFsncHJvcGVydGllcycsICdmaWx0ZXJJZCddKTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgcG9seWdvbiBmaWx0ZXJcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdlbmVyYXRlUG9seWdvbkZpbHRlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlUG9seWdvbkZpbHRlcihsYXllcnMsIGZlYXR1cmUpIHtcbiAgY29uc3QgZGF0YUlkID0gbGF5ZXJzLm1hcChsID0+IGwuY29uZmlnLmRhdGFJZCkuZmlsdGVyKGQgPT4gZCk7XG4gIGNvbnN0IGxheWVySWQgPSBsYXllcnMubWFwKGwgPT4gbC5pZCk7XG4gIGNvbnN0IG5hbWUgPSBsYXllcnMubWFwKGwgPT4gbC5jb25maWcubGFiZWwpO1xuICAvLyBAdHMtaWdub3JlXG4gIGNvbnN0IGZpbHRlciA9IGdldERlZmF1bHRGaWx0ZXIoZGF0YUlkKTtcbiAgcmV0dXJuIHtcbiAgICAuLi5maWx0ZXIsXG4gICAgZml4ZWREb21haW46IHRydWUsXG4gICAgdHlwZTogRklMVEVSX1RZUEVTLnBvbHlnb24sXG4gICAgbmFtZSxcbiAgICBsYXllcklkLFxuICAgIHZhbHVlOiBmZWF0dXJlVG9GaWx0ZXJWYWx1ZShmZWF0dXJlLCBmaWx0ZXIuaWQsIHtpc1Zpc2libGU6IHRydWV9KVxuICB9O1xufVxuXG4vKipcbiAqIFJ1biBmaWx0ZXIgZW50aXJlbHkgb24gQ1BVXG4gKiBAdHlwZSB7dHlwZW9mIGltcG9ydCgnLi9maWx0ZXItdXRpbHMnKS5maWx0ZXJEYXRhc2V0Q1BVfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRGF0YXNldENQVShzdGF0ZSwgZGF0YUlkKSB7XG4gIGNvbnN0IGRhdGFzZXRGaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZiA9PiBmLmRhdGFJZC5pbmNsdWRlcyhkYXRhSWQpKTtcbiAgY29uc3QgZGF0YXNldCA9IHN0YXRlLmRhdGFzZXRzW2RhdGFJZF07XG5cbiAgaWYgKCFkYXRhc2V0KSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgY3B1RmlsdGVyZWREYXRhc2V0ID0gZGF0YXNldC5maWx0ZXJUYWJsZUNQVShkYXRhc2V0RmlsdGVycywgc3RhdGUubGF5ZXJzKTtcblxuICByZXR1cm4gc2V0KFsnZGF0YXNldHMnLCBkYXRhSWRdLCBjcHVGaWx0ZXJlZERhdGFzZXQsIHN0YXRlKTtcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBwYXJzZWQgZmlsdGVycyB3aXRoIGRhdGFzZXRzIGFuZCBhZGQgZmlsdGVyUHJvcHMgdG8gZmllbGRcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLnZhbGlkYXRlRmlsdGVyc1VwZGF0ZURhdGFzZXRzfVxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVGaWx0ZXJzVXBkYXRlRGF0YXNldHMoc3RhdGUsIGZpbHRlcnNUb1ZhbGlkYXRlID0gW10pIHtcbiAgY29uc3QgdmFsaWRhdGVkID0gW107XG4gIGNvbnN0IGZhaWxlZCA9IFtdO1xuICBjb25zdCB7ZGF0YXNldHN9ID0gc3RhdGU7XG4gIGxldCB1cGRhdGVkRGF0YXNldHMgPSBkYXRhc2V0cztcblxuICAvLyBtZXJnZSBmaWx0ZXJzXG4gIGZpbHRlcnNUb1ZhbGlkYXRlLmZvckVhY2goZmlsdGVyID0+IHtcbiAgICAvLyB3ZSBjYW4gb25seSBsb29rIGZvciBkYXRhc2V0cyBkZWZpbmUgaW4gdGhlIGZpbHRlciBkYXRhSWRcbiAgICBjb25zdCBkYXRhc2V0SWRzID0gdG9BcnJheShmaWx0ZXIuZGF0YUlkKTtcblxuICAgIC8vIHdlIGNhbiBtZXJnZSBhIGZpbHRlciBvbmx5IGlmIGFsbCBkYXRhc2V0cyBpbiBmaWx0ZXIuZGF0YUlkIGFyZSBsb2FkZWRcbiAgICBpZiAoZGF0YXNldElkcy5ldmVyeShkID0+IGRhdGFzZXRzW2RdKSkge1xuICAgICAgLy8gYWxsIGRhdGFzZXRJZHMgaW4gZmlsdGVyIG11c3QgYmUgcHJlc2VudCB0aGUgc3RhdGUgZGF0YXNldHNcbiAgICAgIGNvbnN0IHtmaWx0ZXI6IHZhbGlkYXRlZEZpbHRlciwgYXBwbHlUb0RhdGFzZXRzLCBhdWdtZW50ZWREYXRhc2V0c30gPSBkYXRhc2V0SWRzLnJlZHVjZShcbiAgICAgICAgKGFjYywgZGF0YXNldElkKSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YXNldCA9IHVwZGF0ZWREYXRhc2V0c1tkYXRhc2V0SWRdO1xuICAgICAgICAgIGNvbnN0IGxheWVycyA9IHN0YXRlLmxheWVycy5maWx0ZXIobCA9PiBsLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFzZXQuaWQpO1xuICAgICAgICAgIGNvbnN0IHtmaWx0ZXI6IHVwZGF0ZWRGaWx0ZXIsIGRhdGFzZXQ6IHVwZGF0ZWREYXRhc2V0fSA9IHZhbGlkYXRlRmlsdGVyV2l0aERhdGEoXG4gICAgICAgICAgICBhY2MuYXVnbWVudGVkRGF0YXNldHNbZGF0YXNldElkXSB8fCBkYXRhc2V0LFxuICAgICAgICAgICAgZmlsdGVyLFxuICAgICAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICh1cGRhdGVkRmlsdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAuLi5hY2MsXG4gICAgICAgICAgICAgIC8vIG1lcmdlIGZpbHRlciBwcm9wc1xuICAgICAgICAgICAgICBmaWx0ZXI6IGFjYy5maWx0ZXJcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgLi4uYWNjLmZpbHRlcixcbiAgICAgICAgICAgICAgICAgICAgLi4ubWVyZ2VGaWx0ZXJEb21haW5TdGVwKGFjYywgdXBkYXRlZEZpbHRlcilcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVwZGF0ZWRGaWx0ZXIsXG5cbiAgICAgICAgICAgICAgYXBwbHlUb0RhdGFzZXRzOiBbLi4uYWNjLmFwcGx5VG9EYXRhc2V0cywgZGF0YXNldElkXSxcblxuICAgICAgICAgICAgICBhdWdtZW50ZWREYXRhc2V0czoge1xuICAgICAgICAgICAgICAgIC4uLmFjYy5hdWdtZW50ZWREYXRhc2V0cyxcbiAgICAgICAgICAgICAgICBbZGF0YXNldElkXTogdXBkYXRlZERhdGFzZXRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyOiBudWxsLFxuICAgICAgICAgIGFwcGx5VG9EYXRhc2V0czogW10sXG4gICAgICAgICAgYXVnbWVudGVkRGF0YXNldHM6IHt9XG4gICAgICAgIH1cbiAgICAgICk7XG5cbiAgICAgIGlmICh2YWxpZGF0ZWRGaWx0ZXIgJiYgaXNFcXVhbChkYXRhc2V0SWRzLCBhcHBseVRvRGF0YXNldHMpKSB7XG4gICAgICAgIHZhbGlkYXRlZC5wdXNoKHZhbGlkYXRlZEZpbHRlcik7XG4gICAgICAgIHVwZGF0ZWREYXRhc2V0cyA9IHtcbiAgICAgICAgICAuLi51cGRhdGVkRGF0YXNldHMsXG4gICAgICAgICAgLi4uYXVnbWVudGVkRGF0YXNldHNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZmFpbGVkLnB1c2goZmlsdGVyKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7dmFsaWRhdGVkLCBmYWlsZWQsIHVwZGF0ZWREYXRhc2V0c307XG59XG5cbi8qKlxuICogUmV0cmlldmUgaW50ZXJ2YWwgYmlucyBmb3IgdGltZSBmaWx0ZXJcbiAqIEB0eXBlIHt0eXBlb2YgaW1wb3J0KCcuL2ZpbHRlci11dGlscycpLmdldEludGVydmFsQmluc31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEludGVydmFsQmlucyhmaWx0ZXIpIHtcbiAgY29uc3Qge2JpbnN9ID0gZmlsdGVyO1xuICBjb25zdCBpbnRlcnZhbCA9IGZpbHRlci5wbG90VHlwZT8uaW50ZXJ2YWw7XG4gIGlmICghaW50ZXJ2YWwgfHwgIWJpbnMgfHwgT2JqZWN0LmtleXMoYmlucykubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgY29uc3QgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhiaW5zKTtcbiAgcmV0dXJuIHZhbHVlc1swXSA/IHZhbHVlc1swXVtpbnRlcnZhbF0gOiBudWxsO1xufVxuIl19