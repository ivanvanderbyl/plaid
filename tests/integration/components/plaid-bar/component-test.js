import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';

moduleForComponent('plaid-bar', 'Integration | Component | plaid bar', {
  integration: true
});

test('it renders a vertical bar chart', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  this.render(hbs`
    {{#with (area 110 1000) as |plotArea|}}
      {{#plaid-plot
          xScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.width))
          yScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array plotArea.height 0))
          plotArea=plotArea as |plot|}}

        {{#with (pair-by 'mpg' 'vehicles' fuelEconomy) as |values|}}

          {{plot.bar values orientation='vertical'}}

        {{/with}}
      {{/plaid-plot}}
    {{/with}}`);

  return wait()
    .then(() => {
      let bars = this.$('.bar');

      assert.ok(bars, 'bars');
      assert.equal(bars.length, this.get('fuelEconomy.length'), 'number of bars');

      for (let i = 0; i < bars.length; ++i) {
        let bar = bars[i];
        let barVehicles = this.get(`fuelEconomy.${i}.vehicles`);

        assert.equal(bar.getAttribute('y'), 1000 - barVehicles, `bar ${i} y`);
        assert.equal(bar.getAttribute('height'), barVehicles, `bar ${i} height`);

        assert.equal(bar.getAttribute('x'), i * 10, `bar ${i} x`);
        assert.equal(bar.getAttribute('width'), 10, `bar ${i} width`);
      }
    });
});

test('it renders correctly on resize', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  this.setProperties({
    width: 55,
    height: 500
  });

  this.render(hbs`
    {{#with (area width height) as |plotArea|}}
      {{#plaid-plot
          xScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.width))
          yScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array plotArea.height 0))
          plotArea=plotArea as |plot|}}

        {{#with (pair-by 'mpg' 'vehicles' fuelEconomy) as |values|}}

          {{plot.bar values orientation='vertical'}}

        {{/with}}
      {{/plaid-plot}}
    {{/with}}`);

  return wait()
    .then(() => {
      let bars = this.$('.bar');

      assert.ok(bars, 'bars');
      assert.equal(bars.length, this.get('fuelEconomy.length'), 'number of bars');

      this.setProperties({
        width: 110,
        height: 1000
      });

      return wait();
    })
    .then(() => {
      let bars = this.$('.bar');

      assert.ok(bars, 'bars');
      assert.equal(bars.length, this.get('fuelEconomy.length'), 'number of bars');

      for (let i = 0; i < bars.length; ++i) {
        let bar = bars[i];
        let barVehicles = this.get(`fuelEconomy.${i}.vehicles`);

        assert.equal(bar.getAttribute('y'), 1000 - barVehicles, `bar ${i} y`);
        assert.equal(bar.getAttribute('height'), barVehicles, `bar ${i} height`);

        assert.equal(bar.getAttribute('x'), i * 10, `bar ${i} x`);
        assert.equal(bar.getAttribute('width'), 10, `bar ${i} width`);
      }
    });
});

test('it renders a horizontal bar chart', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  this.render(hbs`
    {{#with (area 1000 110) as |plotArea|}}
      {{#plaid-plot
          xScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array 0 plotArea.width))
          yScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.height))
          plotArea=plotArea as |plot|}}

        {{#with (pair-by 'vehicles' 'mpg' fuelEconomy) as |values|}}

          {{plot.bar values orientation='horizontal'}}

        {{/with}}
      {{/plaid-plot}}
    {{/with}}`);

  return wait()
    .then(() => {
      let bars = this.$('.bar');

      assert.ok(bars, 'bars');
      assert.equal(bars.length, this.get('fuelEconomy.length'), 'number of bars');

      for (let i = 0; i < bars.length; ++i) {
        let bar = bars[i];
        let barVehicles = this.get(`fuelEconomy.${i}.vehicles`);

        assert.equal(bar.getAttribute('y'), i * 10, `bar ${i} y`);
        assert.equal(bar.getAttribute('height'), 10, `bar ${i} height`);

        assert.equal(bar.getAttribute('x'), 0, `bar ${i} x`);
        assert.equal(bar.getAttribute('width'), barVehicles, `bar ${i} width`);
      }
    });
});

test('it defaults to vertical orientation', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  this.render(hbs`
    {{#with (area 110 1000) as |plotArea|}}
      {{#plaid-plot
          xScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.width))
          yScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array plotArea.height 0))
          plotArea=plotArea as |plot|}}

        {{#with (pair-by 'mpg' 'vehicles' fuelEconomy) as |values|}}

          {{plot.bar values}}

        {{/with}}
      {{/plaid-plot}}
    {{/with}}`);

  return wait()
    .then(() => {
      let bars = this.$('.bar');

      assert.ok(bars, 'bars');
      assert.equal(bars.length, this.get('fuelEconomy.length'), 'number of bars');

      for (let i = 0; i < bars.length; ++i) {
        let bar = bars[i];
        let barVehicles = this.get(`fuelEconomy.${i}.vehicles`);

        assert.equal(bar.getAttribute('y'), 1000 - barVehicles, `bar ${i} y`);
        assert.equal(bar.getAttribute('height'), barVehicles, `bar ${i} height`);

        assert.equal(bar.getAttribute('x'), i * 10, `bar ${i} x`);
        assert.equal(bar.getAttribute('width'), 10, `bar ${i} width`);
      }
    });
});

test('it errors if orientation is not "vertical" or "horizontal"', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  assert.throws(() => {
    this.render(hbs`
      {{#with (area 1000 110) as |plotArea|}}
        {{#plaid-plot
            xScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array 0 plotArea.width))
            yScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.height))
            plotArea=plotArea as |plot|}}

          {{#with (pair-by 'vehicles' 'mpg' fuelEconomy) as |values|}}

            {{plot.bar values orientation='bad-orientation'}}

          {{/with}}
        {{/plaid-plot}}
      {{/with}}`);
  }, 'bar chart orientation must be in {vertical,horizontal}, was "bad-orientation"');
});

test('it errors if orientation is "vertical" and the xScale is not a band-scale', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  assert.throws(() => {
    this.render(hbs`
      {{#with (area 1000 110) as |plotArea|}}
        {{#plaid-plot
            xScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array 0 plotArea.width))
            yScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.height))
            plotArea=plotArea as |plot|}}

          {{#with (pair-by 'vehicles' 'mpg' fuelEconomy) as |values|}}

            {{plot.bar values orientation='vertical'}}

          {{/with}}
        {{/plaid-plot}}
      {{/with}}`);
  }, 'xScale must be a band-scale for vertical bar charts');
});

test('it errors if orientation is "horizontal" and the yScale is not a band-scale', function(assert) {
  this.set('fuelEconomy', [
    { mpg: 12, vehicles: 580 },
    { mpg: 15, vehicles: 420 },
    { mpg: 18, vehicles: 1000 },
    { mpg: 21, vehicles: 805 },
    { mpg: 24, vehicles: 640 },
    { mpg: 27, vehicles: 400 },
    { mpg: 30, vehicles: 380 },
    { mpg: 33, vehicles: 240 },
    { mpg: 36, vehicles: 210 },
    { mpg: 39, vehicles: 180 },
    { mpg: 42, vehicles: 205 }
  ]);

  assert.throws(() => {
    this.render(hbs`
      {{#with (area 110 1000) as |plotArea|}}
        {{#plaid-plot
            xScale=(band-scale (map-by 'mpg' fuelEconomy) (array 0 plotArea.width))
            yScale=(linear-scale (extent (map-by 'vehicles' fuelEconomy) toZero=true) (array plotArea.height 0))
            plotArea=plotArea as |plot|}}

          {{#with (pair-by 'mpg' 'vehicles' fuelEconomy) as |values|}}

            {{plot.bar values orientation='horizontal'}}

          {{/with}}
        {{/plaid-plot}}
      {{/with}}`);
  }, 'yScale must be a band-scale for horizontal bar charts');
});
