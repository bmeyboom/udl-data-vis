import {KeplerGlFactory} from 'kepler.gl/components/side-bar/kepler-gl';

export function CustomKeplerGlFactory() {
  const KeplerGl = KeplerGlFactory(BottomWidget, null, MapContainer, ModalContainer, SidePanel, PlotContainer, NotificationPanel);

  KeplerGl.defaultProps = {
    ...KeplerGl.defaultProps
  }

  return CustomKeplerGl;
}

export default CustomKeplerGlFactory;
