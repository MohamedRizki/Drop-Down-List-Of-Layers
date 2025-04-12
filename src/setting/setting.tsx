import { React, Immutable } from 'jimu-core';
import { AllDataSourceTypes, type IMUseDataSource } from 'jimu-core';
import { DataSourceSelector } from 'jimu-ui/advanced/data-source-selector';
import { MapWidgetSelector, SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { IMConfig } from '../config';

export default function Setting(props: AllWidgetSettingProps<IMConfig>) {
  const onDataSourceChange = (useDataSources: IMUseDataSource[]) => {
    props.onSettingChange({
      id: props.id,
      useDataSources
    });
  };

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({  
      id: props.id,
      useMapWidgetIds
    });
  };

  return (
    <div className="widget-setting p-3">
      <SettingSection title="Carte cible">
        <SettingRow>
          <MapWidgetSelector
            useMapWidgetIds={props.useMapWidgetIds}
            onSelect={onMapWidgetSelected}
          />
        </SettingRow>
      </SettingSection>
    </div>
  );
}
