import Ember from 'ember';
import GroupElement from '../../mixins/group-element';
import { max, min } from 'd3-array';

const {
  assert,
  Component,
  getProperties,
  run: { scheduleOnce },
  typeOf
} = Ember;

const PlaidBarComponent = Component.extend(GroupElement, {
  layout: null,

  /**
   * Represents the bar orientation. May be "vertical" or "horizontal"
   *
   * @public
   * @type {String}
   */
  orientation: 'vertical',

  /**
    xScale function

    @public
    @type {D3 Scale}
  */
  xScale: null,

  /**
    yScale function

    @public
    @type {D3 Scale}
  */
  yScale: null,

  /**
    Values to render bars from. These should be the same as those used
    for the domains of the scaling functions.

    @public
    @type {Array}
  */
  values: [],

  fill: 'black',

  fillOpacity: 1.0,

  didReceiveAttrs() {
    this._super(...arguments);

    let orientation = this.get('orientation');

    assert(`bar chart orientation must be in {vertical,horizontal}, was "${orientation}"`,
      orientation === 'vertical' || orientation === 'horizontal');

    let checkScale = orientation === 'vertical' ? 'xScale' : 'yScale';

    assert(`${checkScale} must be a band-scale for ${orientation} bar charts`, typeOf(this.get(checkScale).bandwidth) === 'function');

    scheduleOnce('afterRender', this, this.drawBars);
  },

  drawBars() {
    let { values, xScale, yScale, fill, fillOpacity, orientation } =
      getProperties(this, 'values', 'xScale', 'yScale', 'fill', 'fillOpacity', 'orientation');

    let x, width, y, height;

    if (orientation === 'vertical') {
      let maxHeight = max(yScale.range());
      x = (d) => xScale(d[0]);
      width = xScale.bandwidth();
      y = (d) => yScale(d[1]);
      height = (d) => maxHeight - yScale(d[1]);
    } else {
      x = min(xScale.range());
      width = (d) => xScale(d[0]);
      y = (d) => yScale(d[1]);
      height = yScale.bandwidth();
    }

    // JOIN new data with old elements
    let bars = this.selection.selectAll('.bar').data(values);

    // EXIT old elements not present in new data
    bars.exit().remove();

    // ENTER new elements present in new data
    let enterBars = bars.enter().append('rect').attr('class', 'bar');

    // MERGE the existing and with the entered and UPDATE
    bars.merge(enterBars)
      .attr('class', 'bar')
      .attr('x', x)
      .attr('width', width)
      .attr('y', y)
      .attr('height', height)
      .attr('fill', fill)
      .attr('fillOpacity', fillOpacity);
  }
});

PlaidBarComponent.reopenClass({
  positionalParams: [ 'values' ]
});

export default PlaidBarComponent;
