import { AppEvents } from '@grafana/data';
import { SceneGridLayout, SceneQueryRunner, VizPanel } from '@grafana/scenes';
import appEvents from 'app/core/app_events';

import { DashboardGridItem } from './DashboardGridItem';
import { DashboardScene } from './DashboardScene';
import { DashboardRepeatsProcessedEvent } from './types';

describe('DashboardSceneUrlSync', () => {
  describe('Given a standard scene', () => {
    it('Should set inspectPanelKey when url has inspect key', () => {
      const scene = buildTestScene();
      scene.urlSync?.updateFromUrl({ inspect: '2' });
      expect(scene.state.inspectPanelKey).toBe('2');
    });

    it('Should handle inspect key that is not found', () => {
      const scene = buildTestScene();
      scene.urlSync?.updateFromUrl({ inspect: '12321' });
      expect(scene.state.inspectPanelKey).toBe(undefined);
    });

    it('Should set viewPanelKey when url has viewPanel', () => {
      const scene = buildTestScene();
      scene.urlSync?.updateFromUrl({ viewPanel: '2' });
      expect(scene.state.viewPanelScene!.getUrlKey()).toBe('panel-2');
    });

    it('Should set UNSAFE_fitPanels when url has autofitpanels', () => {
      const scene = buildTestScene();
      scene.urlSync?.updateFromUrl({ autofitpanels: '' });
      expect((scene.state.body as SceneGridLayout).state.UNSAFE_fitPanels).toBe(true);
    });

    it('Should get the autofitpanels from the scene state', () => {
      const scene = buildTestScene();

      expect(scene.urlSync?.getUrlState().autofitpanels).toBeUndefined();
      (scene.state.body as SceneGridLayout).setState({ UNSAFE_fitPanels: true });
      expect(scene.urlSync?.getUrlState().autofitpanels).toBe('true');
    });
  });

  describe('Given a viewPanelKey with clone that is not found', () => {
    const scene = buildTestScene();

    let errorNotice = 0;
    appEvents.on(AppEvents.alertError, (evt) => errorNotice++);

    scene.urlSync?.updateFromUrl({ viewPanel: 'panel-1-clone-1' });

    expect(scene.state.viewPanelScene).toBeUndefined();
    // Verify no error notice was shown
    expect(errorNotice).toBe(0);

    // fake adding clone panel
    const layout = scene.state.body as SceneGridLayout;
    layout.setState({
      children: [
        new DashboardGridItem({
          key: 'griditem-1',
          x: 0,
          body: new VizPanel({
            title: 'Clone Panel A',
            key: 'panel-1-clone-1',
            pluginId: 'table',
          }),
        }),
      ],
    });

    // Verify it subscribes to DashboardRepeatsProcessedEvent
    scene.publishEvent(new DashboardRepeatsProcessedEvent({ source: scene }));
    expect(scene.state.viewPanelScene?.getUrlKey()).toBe('panel-1-clone-1');
  });
});

function buildTestScene() {
  const scene = new DashboardScene({
    title: 'hello',
    uid: 'dash-1',
    body: new SceneGridLayout({
      children: [
        new DashboardGridItem({
          key: 'griditem-1',
          x: 0,
          body: new VizPanel({
            title: 'Panel A',
            key: 'panel-1',
            pluginId: 'table',
            $data: new SceneQueryRunner({ key: 'data-query-runner', queries: [{ refId: 'A' }] }),
          }),
        }),
        new DashboardGridItem({
          body: new VizPanel({
            title: 'Panel B',
            key: 'panel-2',
            pluginId: 'table',
          }),
        }),
      ],
    }),
  });

  return scene;
}
