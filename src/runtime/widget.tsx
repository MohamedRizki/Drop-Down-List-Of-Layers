import { React, AllWidgetProps, jsx } from 'jimu-core';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';
import { useState, useEffect } from 'react';
import FeatureLayer from 'esri/layers/FeatureLayer';
import MapImageLayer from 'esri/layers/MapImageLayer';

const Widget: React.FC<AllWidgetProps<{}>> = (props) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [layers, setLayers] = useState<(FeatureLayer | MapImageLayer)[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string>('');
  // Handler called when the map view becomes active
  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };
  // When the map view is ready extract and filter layers
  useEffect(() => {
    if (jimuMapView?.view?.map) {
      const allLayers = jimuMapView.view.map.allLayers.toArray();
      const validLayers = allLayers.filter(layer => layer.type === 'feature' || layer.type === 'map-image');
      // Disable visibility 
      validLayers.forEach(layer => {
        layer.visible = false;
      });
      console.log('Layers found in map:', validLayers.map(l => l.title || l.id));
      setLayers(validLayers);
    } else {
      setLayers([]);
    }
  }, [jimuMapView]);

  // Handler when the user selects a new layer from the dropdown
  const onLayerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const layerId = event.target.value;
    setSelectedLayerId(layerId);
    const layer = layers.find(l => l.id === layerId);
    if (!layer) {
      console.error(`Layer with id "${layerId}" not found.`);
      return;
    }

    // Hide all layers except the selected one
    layers.forEach(l => {
      l.visible = l.id === layer.id;
    });

    // Ensure the selected layer is visible
    if (!layer.visible) {
      layer.visible = true;
    }

    // Make parent group layers visible
    if (layer.parent) {
      let parentLayer = layer.parent;
      while (parentLayer && parentLayer.type === 'group') {
        if (!parentLayer.visible) {
          parentLayer.visible = true;
        }
        parentLayer = parentLayer.parent;
      }
    }

    // Get the map view and zoom to the selected layer extent
    const view = jimuMapView?.view;
    if (!view) {
      console.warn('Map view is not ready');
      return;
    }

    const zoomToExtent = () => {
      if (layer.fullExtent) {
        view.goTo(layer.fullExtent).catch((err) => {
          console.error('Error during goTo:', err);
        });
      } else {
        console.warn('Layer has no fullExtent:', layer.title);
      }
    };

    // If the layer is already loaded, zoom directly -- Otherwise, load it and then zoom
    if (layer.loaded) {
      zoomToExtent();
    } else {
      layer.load().then(zoomToExtent).catch((err) => {
        console.error('Failed to load layer for zoom:', err);
      });
    }
  };

  return (
    <div className="drop-down-layer-widget jimu-widget">
      {/* Display the map view component if a map widget is selected */}
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent
          useMapWidgetId={props.useMapWidgetIds[0]}
          onActiveViewChange={activeViewChangeHandler}
        />
      )}

      {/* Dropdown for selecting layers */}
      {layers.length > 0 ? (
        <select onChange={onLayerChange} value={selectedLayerId} style={{ width: '100%' }}>
          <option value="" disabled>-- Veuillez sélectionner une couche --</option>
          {layers.map(layer => (
            <option key={layer.id} value={layer.id}>
              {layer.title || layer.id}
            </option>
          ))}
        </select>
      ) : (
        <p style={{ fontStyle: 'italic' }}>Aucune couche disponible dans cette carte.</p>
      )}
    </div>
  );
};

export default Widget;
