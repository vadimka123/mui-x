import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent } from '@mui/internal-test-utils';
import { BarChart, BarChartProps } from '@mui/x-charts/BarChart';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';

const config: Partial<BarChartProps> = {
  dataset: [
    { x: 'A', v1: 4, v2: 2 },
    { x: 'B', v1: 1, v2: 1 },
  ],
  margin: 0,
  xAxis: [{ position: 'none' }],
  yAxis: [{ position: 'none' }],
  hideLegend: true,
  width: 400,
  height: 400,
} as const;

// Plot as follow to simplify click position
//
// | X
// | X
// | X X
// | X X X X
// ---A---B-

describe('ChartsTooltip', () => {
  const { render } = createRenderer();

  // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
  describeSkipIf(isJSDOM)('axis trigger', () => {
    it('should show right values with vertical layout on axis', () => {
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 400,
            height: 400,
          }}
        >
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      fireEvent.pointerEnter(svg); // Trigger the tooltip
      fireEvent.pointerMove(svg, {
        clientX: 198,
        clientY: 60,
      });

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'A',
        // First row
        '', // mark
        'S1', // label
        '4', // value
        // Second row
        '',
        'S2',
        '2',
      ]);

      fireEvent.pointerMove(svg, {
        clientX: 201,
        clientY: 60,
      });

      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'B',
        // First row
        '',
        'S1',
        '1',
        // Second row
        '',
        'S2',
        '1',
      ]);
    });

    it('should show right values with horizontal layout on axis', () => {
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 400,
            height: 400,
          }}
        >
          <BarChart
            {...config}
            layout="horizontal"
            series={[
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            yAxis={[{ scaleType: 'band', dataKey: 'x' }]}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;

      fireEvent.pointerEnter(svg); // Trigger the tooltip
      fireEvent.pointerMove(svg, {
        clientX: 150,
        clientY: 60,
      });

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'A',
        // First row
        '',
        'S1',
        '4',
        // Second row
        '',
        'S2',
        '2',
      ]);

      fireEvent.pointerMove(svg, {
        clientX: 150,
        clientY: 220,
      });

      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal([
        // Header
        'B',
        // First row
        '',
        'S1',
        '1',
        // Second row
        '',
        'S2',
        '1',
      ]);
    });
  });

  // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
  describeSkipIf(isJSDOM)('item trigger', () => {
    it('should show right values with vertical layout on item', () => {
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 400,
            height: 400,
          }}
        >
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            xAxis={[{ scaleType: 'band', dataKey: 'x' }]}
            slotProps={{ tooltip: { trigger: 'item' } }}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;
      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      fireEvent.pointerEnter(rectangles[0]);

      fireEvent.pointerEnter(svg); // Trigger the tooltip
      fireEvent.pointerMove(svg, {
        clientX: 150,
        clientY: 60,
      }); // Only to set the tooltip position

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S1', '4']);

      fireEvent.pointerEnter(rectangles[3]);
      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S2', '1']);
    });

    it('should show right values with horizontal layout on item', () => {
      render(
        <div
          style={{
            margin: -8, // Removes the body default margins
            width: 400,
            height: 400,
          }}
        >
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1', label: 'S1' },
              { dataKey: 'v2', id: 's2', label: 'S2' },
            ]}
            layout="horizontal"
            yAxis={[{ scaleType: 'band', dataKey: 'x' }]}
            slotProps={{ tooltip: { trigger: 'item' } }}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>('svg')!;
      const rectangles = document.querySelectorAll<HTMLElement>('rect');

      fireEvent.pointerEnter(rectangles[0]);

      fireEvent.pointerEnter(svg); // Trigger the tooltip
      fireEvent.pointerMove(svg, {
        clientX: 150,
        clientY: 60,
      }); // Only to set the tooltip position

      let cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S1', '4']);

      fireEvent.pointerEnter(rectangles[3]);
      cells = document.querySelectorAll<HTMLElement>('.MuiChartsTooltip-root td');
      expect([...cells].map((cell) => cell.textContent)).to.deep.equal(['', 'S2', '1']);
    });
  });
});
