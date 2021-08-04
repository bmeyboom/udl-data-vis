"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = require("./constants");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Feature =
/*#__PURE__*/
function () {
  _createClass(Feature, null, [{
    key: "fromFeature",
    value: function fromFeature(feature) {
      var id = feature.id,
          _feature$geometry = feature.geometry,
          coordinates = _feature$geometry.coordinates,
          type = _feature$geometry.type,
          _feature$properties = feature.properties,
          renderType = _feature$properties.renderType,
          otherProps = _objectWithoutProperties(_feature$properties, ["renderType"]);

      switch (type) {
        case _constants.GEOJSON_TYPE.POINT:
          return new Feature({
            id: id,
            type: type,
            renderType: renderType,
            points: [coordinates],
            otherProps: otherProps
          });

        case _constants.GEOJSON_TYPE.LINE_STRING:
          return new Feature({
            id: id,
            type: type,
            renderType: renderType,
            points: coordinates,
            otherProps: otherProps
          });

        case _constants.GEOJSON_TYPE.POLYGON:
          var points = coordinates[0] && coordinates[0].slice(0, -1);
          return new Feature({
            id: id,
            type: type,
            renderType: renderType,
            points: points,
            isClosed: true,
            otherProps: otherProps
          });

        default:
          return null;
      }
    }
  }]);

  function Feature(props) {
    _classCallCheck(this, Feature);

    _defineProperty(this, "id", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "renderType", void 0);

    _defineProperty(this, "isClosed", false);

    _defineProperty(this, "points", void 0);

    _defineProperty(this, "otherProps", void 0);

    this.id = props.id;
    this.type = props.type;
    this.renderType = props.renderType;
    this.points = props.points || [];
    this.isClosed = props.isClosed;
    this.otherProps = props.otherProps;
  }

  _createClass(Feature, [{
    key: "addPoint",
    value: function addPoint(pt) {
      this.points.push(pt);
      return true;
    }
  }, {
    key: "insertPoint",
    value: function insertPoint(pt, index) {
      this.points.splice(index, 0, pt);
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox() {
      if (!this.points || !this.points.length) {
        return null;
      }

      var bbox = this.points.reduce(function (result, pt) {
        result.xmin = Math.min(pt[0], result.xmin);
        result.xmax = Math.min(pt[0], result.xmax);
        result.ymin = Math.min(pt[1], result.ymin);
        result.ymax = Math.min(pt[1], result.ymax);
        return result;
      }, {
        xmin: Infinity,
        xmax: -Infinity,
        ymin: Infinity,
        ymax: -Infinity
      });
      return bbox;
    }
  }, {
    key: "removePoint",
    value: function removePoint(index) {
      var points = this.points;

      if (index >= 0 && index < points.length) {
        points.splice(index, 1);

        if (points.length < 3) {
          this.isClosed = false;
        }

        return true;
      }

      return false;
    }
  }, {
    key: "replacePoint",
    value: function replacePoint(index, pt) {
      var points = this.points;

      if (index >= 0 && index < points.length) {
        points[index] = pt;
        return true;
      }

      return false;
    }
  }, {
    key: "closePath",
    value: function closePath() {
      var points = this.points;

      if (points.length >= 3 && !this.isClosed) {
        this.isClosed = true;
        return true;
      }

      return false;
    }
  }, {
    key: "toFeature",
    value: function toFeature() {
      var id = this.id,
          points = this.points,
          isClosed = this.isClosed,
          renderType = this.renderType,
          otherProps = this.otherProps;
      var feature = null;

      if (points.length < 2) {
        feature = {
          type: 'Feature',
          geometry: {
            type: _constants.GEOJSON_TYPE.POINT,
            coordinates: points[0]
          },
          properties: _objectSpread({
            renderType: renderType
          }, otherProps),
          id: id
        };
      } else if (points.length < 3 || !isClosed) {
        feature = {
          type: 'Feature',
          geometry: {
            type: _constants.GEOJSON_TYPE.LINE_STRING,
            coordinates: points
          },
          properties: _objectSpread({
            renderType: renderType,
            bbox: this.getBoundingBox()
          }, otherProps),
          id: id
        };
      } else {
        feature = {
          type: 'Feature',
          geometry: {
            type: _constants.GEOJSON_TYPE.POLYGON,
            coordinates: [_toConsumableArray(points).concat([points[0]])]
          },
          properties: _objectSpread({
            renderType: renderType,
            isClosed: isClosed,
            bbox: this.getBoundingBox()
          }, otherProps),
          id: id
        };
      }

      return feature;
    }
  }]);

  return Feature;
}();

exports.default = Feature;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mZWF0dXJlLmpzIl0sIm5hbWVzIjpbIkZlYXR1cmUiLCJmZWF0dXJlIiwiaWQiLCJnZW9tZXRyeSIsImNvb3JkaW5hdGVzIiwidHlwZSIsInByb3BlcnRpZXMiLCJyZW5kZXJUeXBlIiwib3RoZXJQcm9wcyIsIkdFT0pTT05fVFlQRSIsIlBPSU5UIiwicG9pbnRzIiwiTElORV9TVFJJTkciLCJQT0xZR09OIiwic2xpY2UiLCJpc0Nsb3NlZCIsInByb3BzIiwicHQiLCJwdXNoIiwiaW5kZXgiLCJzcGxpY2UiLCJsZW5ndGgiLCJiYm94IiwicmVkdWNlIiwicmVzdWx0IiwieG1pbiIsIk1hdGgiLCJtaW4iLCJ4bWF4IiwieW1pbiIsInltYXgiLCJJbmZpbml0eSIsImdldEJvdW5kaW5nQm94Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVdxQkEsTzs7Ozs7Z0NBQ0FDLE8sRUFBa0I7QUFBQSxVQUVqQ0MsRUFGaUMsR0FLL0JELE9BTCtCLENBRWpDQyxFQUZpQztBQUFBLDhCQUsvQkQsT0FMK0IsQ0FHakNFLFFBSGlDO0FBQUEsVUFHckJDLFdBSHFCLHFCQUdyQkEsV0FIcUI7QUFBQSxVQUdSQyxJQUhRLHFCQUdSQSxJQUhRO0FBQUEsZ0NBSy9CSixPQUwrQixDQUlqQ0ssVUFKaUM7QUFBQSxVQUluQkMsVUFKbUIsdUJBSW5CQSxVQUptQjtBQUFBLFVBSUpDLFVBSkk7O0FBT25DLGNBQVFILElBQVI7QUFDRSxhQUFLSSx3QkFBYUMsS0FBbEI7QUFDRSxpQkFBTyxJQUFJVixPQUFKLENBQVk7QUFDakJFLFlBQUFBLEVBQUUsRUFBRkEsRUFEaUI7QUFFakJHLFlBQUFBLElBQUksRUFBSkEsSUFGaUI7QUFHakJFLFlBQUFBLFVBQVUsRUFBVkEsVUFIaUI7QUFJakJJLFlBQUFBLE1BQU0sRUFBRSxDQUFDUCxXQUFELENBSlM7QUFLakJJLFlBQUFBLFVBQVUsRUFBVkE7QUFMaUIsV0FBWixDQUFQOztBQVFG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V0FBVyxFQUFFLG9CQUFLTyxNQUFMLFVBQWFBLE1BQU0sQ0FBQyxDQUFELENBQW5CO0FBRkwsV0FGRjtBQU1STCxVQUFBQSxVQUFVO0FBQ1JDLFlBQUFBLFVBQVUsRUFBVkEsVUFEUTtBQUVSUSxZQUFBQSxRQUFRLEVBQVJBLFFBRlE7QUFHUk8sWUFBQUEsSUFBSSxFQUFFLEtBQUtVLGNBQUw7QUFIRSxhQUlMeEIsVUFKSyxDQU5GO0FBWVJOLFVBQUFBLEVBQUUsRUFBRkE7QUFaUSxTQUFWO0FBY0Q7O0FBRUQsYUFBT0QsT0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcbmltcG9ydCB0eXBlIHsgR2VvbWV0cnksIFBvc2l0aW9uLCBGZWF0dXJlIGFzIEdlb0pzb24gfSBmcm9tICdAbmVidWxhLmdsL2VkaXQtbW9kZXMnO1xuaW1wb3J0IHR5cGUgeyBJZCwgUmVuZGVyVHlwZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgR0VPSlNPTl9UWVBFIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG50eXBlIEZlYXR1cmVQcm9wcyA9IHtcbiAgaWQ6IElkLFxuICB0eXBlOiBzdHJpbmcsXG4gIHJlbmRlclR5cGU/OiA/UmVuZGVyVHlwZSxcbiAgcG9pbnRzPzogP2FueSxcbiAgaXNDbG9zZWQ/OiA/Ym9vbGVhbixcbiAgb3RoZXJQcm9wcz86ID9hbnlcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZlYXR1cmUge1xuICBzdGF0aWMgZnJvbUZlYXR1cmUoZmVhdHVyZTogR2VvSnNvbikge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkLFxuICAgICAgZ2VvbWV0cnk6IHsgY29vcmRpbmF0ZXMsIHR5cGUgfSxcbiAgICAgIHByb3BlcnRpZXM6IHsgcmVuZGVyVHlwZSwgLi4ub3RoZXJQcm9wcyB9XG4gICAgfSA9IGZlYXR1cmU7XG5cbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgR0VPSlNPTl9UWVBFLlBPSU5UOlxuICAgICAgICByZXR1cm4gbmV3IEZlYXR1cmUoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgcmVuZGVyVHlwZSxcbiAgICAgICAgICBwb2ludHM6IFtjb29yZGluYXRlc10sXG4gICAgICAgICAgb3RoZXJQcm9wc1xuICAgICAgICB9KTtcblxuICAgICAgY2FzZSBHRU9KU09OX1RZUEUuTElORV9TVFJJTkc6XG4gICAgICAgIHJldHVybiBuZXcgRmVhdHVyZSh7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICByZW5kZXJUeXBlLFxuICAgICAgICAgIHBvaW50czogY29vcmRpbmF0ZXMsXG4gICAgICAgICAgb3RoZXJQcm9wc1xuICAgICAgICB9KTtcblxuICAgICAgY2FzZSBHRU9KU09OX1RZUEUuUE9MWUdPTjpcbiAgICAgICAgY29uc3QgcG9pbnRzID0gY29vcmRpbmF0ZXNbMF0gJiYgY29vcmRpbmF0ZXNbMF0uc2xpY2UoMCwgLTEpO1xuICAgICAgICByZXR1cm4gbmV3IEZlYXR1cmUoe1xuICAgICAgICAgIGlkLFxuICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgcmVuZGVyVHlwZSxcbiAgICAgICAgICBwb2ludHMsXG4gICAgICAgICAgaXNDbG9zZWQ6IHRydWUsXG4gICAgICAgICAgb3RoZXJQcm9wc1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IEZlYXR1cmVQcm9wcykge1xuICAgIHRoaXMuaWQgPSBwcm9wcy5pZDtcbiAgICB0aGlzLnR5cGUgPSBwcm9wcy50eXBlO1xuICAgIHRoaXMucmVuZGVyVHlwZSA9IHByb3BzLnJlbmRlclR5cGU7XG4gICAgdGhpcy5wb2ludHMgPSBwcm9wcy5wb2ludHMgfHwgW107XG4gICAgdGhpcy5pc0Nsb3NlZCA9IHByb3BzLmlzQ2xvc2VkO1xuICAgIHRoaXMub3RoZXJQcm9wcyA9IHByb3BzLm90aGVyUHJvcHM7XG4gIH1cblxuICBpZDogSWQ7XG4gIHR5cGU6IEdlb21ldHJ5O1xuICByZW5kZXJUeXBlOiA/c3RyaW5nO1xuICBpc0Nsb3NlZDogP2Jvb2xlYW4gPSBmYWxzZTtcbiAgcG9pbnRzOiBQb3NpdGlvbltdO1xuICBvdGhlclByb3BzOiA/YW55O1xuXG4gIGFkZFBvaW50KHB0OiBudW1iZXJbXSkge1xuICAgIHRoaXMucG9pbnRzLnB1c2gocHQpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaW5zZXJ0UG9pbnQocHQ6IG51bWJlcltdLCBpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5wb2ludHMuc3BsaWNlKGluZGV4LCAwLCBwdCk7XG4gIH1cblxuICBnZXRCb3VuZGluZ0JveCgpIHtcbiAgICBpZiAoIXRoaXMucG9pbnRzIHx8ICF0aGlzLnBvaW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBiYm94ID0gdGhpcy5wb2ludHMucmVkdWNlKFxuICAgICAgKHJlc3VsdCwgcHQpID0+IHtcbiAgICAgICAgcmVzdWx0LnhtaW4gPSBNYXRoLm1pbihwdFswXSwgcmVzdWx0LnhtaW4pO1xuICAgICAgICByZXN1bHQueG1heCA9IE1hdGgubWluKHB0WzBdLCByZXN1bHQueG1heCk7XG4gICAgICAgIHJlc3VsdC55bWluID0gTWF0aC5taW4ocHRbMV0sIHJlc3VsdC55bWluKTtcbiAgICAgICAgcmVzdWx0LnltYXggPSBNYXRoLm1pbihwdFsxXSwgcmVzdWx0LnltYXgpO1xuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9LFxuICAgICAgeyB4bWluOiBJbmZpbml0eSwgeG1heDogLUluZmluaXR5LCB5bWluOiBJbmZpbml0eSwgeW1heDogLUluZmluaXR5IH1cbiAgICApO1xuXG4gICAgcmV0dXJuIGJib3g7XG4gIH1cblxuICByZW1vdmVQb2ludChpbmRleDogbnVtYmVyKSB7XG4gICAgY29uc3QgeyBwb2ludHMgfSA9IHRoaXM7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCBwb2ludHMubGVuZ3RoKSB7XG4gICAgICBwb2ludHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGlmIChwb2ludHMubGVuZ3RoIDwgMykge1xuICAgICAgICB0aGlzLmlzQ2xvc2VkID0gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmVwbGFjZVBvaW50KGluZGV4OiBudW1iZXIsIHB0OiBBcnJheTxudW1iZXI+KSB7XG4gICAgY29uc3QgeyBwb2ludHMgfSA9IHRoaXM7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCBwb2ludHMubGVuZ3RoKSB7XG4gICAgICBwb2ludHNbaW5kZXhdID0gcHQ7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY2xvc2VQYXRoKCkge1xuICAgIGNvbnN0IHsgcG9pbnRzIH0gPSB0aGlzO1xuICAgIGlmIChwb2ludHMubGVuZ3RoID49IDMgJiYgIXRoaXMuaXNDbG9zZWQpIHtcbiAgICAgIHRoaXMuaXNDbG9zZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRvRmVhdHVyZSgpOiBHZW9Kc29uIHtcbiAgICBjb25zdCB7IGlkLCBwb2ludHMsIGlzQ2xvc2VkLCByZW5kZXJUeXBlLCBvdGhlclByb3BzIH0gPSB0aGlzO1xuXG4gICAgbGV0IGZlYXR1cmUgPSBudWxsO1xuICAgIGlmIChwb2ludHMubGVuZ3RoIDwgMikge1xuICAgICAgZmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0lOVCxcbiAgICAgICAgICBjb29yZGluYXRlczogcG9pbnRzWzBdXG4gICAgICAgIH0sXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICByZW5kZXJUeXBlLFxuICAgICAgICAgIC4uLm90aGVyUHJvcHNcbiAgICAgICAgfSxcbiAgICAgICAgaWRcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmIChwb2ludHMubGVuZ3RoIDwgMyB8fCAhaXNDbG9zZWQpIHtcbiAgICAgIGZlYXR1cmUgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiBHRU9KU09OX1RZUEUuTElORV9TVFJJTkcsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHBvaW50c1xuICAgICAgICB9LFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgcmVuZGVyVHlwZSxcbiAgICAgICAgICBiYm94OiB0aGlzLmdldEJvdW5kaW5nQm94KCksXG4gICAgICAgICAgLi4ub3RoZXJQcm9wc1xuICAgICAgICB9LFxuICAgICAgICBpZFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmVhdHVyZSA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6IEdFT0pTT05fVFlQRS5QT0xZR09OLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBbWy4uLnBvaW50cywgcG9pbnRzWzBdXV1cbiAgICAgICAgfSxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHJlbmRlclR5cGUsXG4gICAgICAgICAgaXNDbG9zZWQsXG4gICAgICAgICAgYmJveDogdGhpcy5nZXRCb3VuZGluZ0JveCgpLFxuICAgICAgICAgIC4uLm90aGVyUHJvcHNcbiAgICAgICAgfSxcbiAgICAgICAgaWRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZlYXR1cmU7XG4gIH1cbn1cbiJdfQ==