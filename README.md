# Display Web Map Layers

This widget lets you display the list of layers from a Web Map using a simple **dropdown menu**. It’s designed to make it easy for users to select and display one layer at a time on the map.

## How to use this widget

To use it, clone the (https://github.com/MohamedRizki/Drop-Down-List-Of-Layers), then copy the widget folder (inside `widgets`) into your local Experience Builder installation under `client/your-extensions/widgets`.
s
In Experience Builder, just drag the widget into your app and select the map widget you want it to connect to using the settings panel.

## How it works

### `setting.tsx`

- The widget includes a `MapWidgetSelector` so you can pick the target map it should connect to.

### `widget.tsx`

- Once the map view is ready, the widget automatically grabs all the layers from the Web Map — specifically those of type `FeatureLayer` or `MapImageLayer`.
- By default, all layers are hidden.
- The widget then shows a dropdown list with all detected layers.
- When a user selects a layer:
  - That layer becomes visible.
  - All other layers are hidden.
  - If it belongs to a group, the parent layers are made visible too.
  - If the layer has an extent (`fullExtent`), the map will automatically zoom to it.

## Sample logic

```ts
// Get valid layers from the map (feature or map-image)
const allLayers = jimuMapView.view.map.allLayers.toArray();
const validLayers = allLayers.filter(layer => layer.type === 'feature' || layer.type === 'map-image');

// Hide all layers initially
validLayers.forEach(layer => {
  layer.visible = false;
});

// When a layer is selected from the dropdown
layers.forEach(l => {
  l.visible = l.id === selectedLayerId;
});

// Zoom to the selected layer if it has an extent
if (layer.fullExtent) {
  view.goTo(layer.fullExtent);
}