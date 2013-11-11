$(window).load(function() {
  var Calculator = Calculator || {};
  var Calculation = Calculation || {};
  window.Calculator = Calculator;  // expose to console for development
  window.Calculation = Calculation;  // expose to console for development

  Calculator.FieldsView = Backbone.View.extend({

    tagName: 'fieldset',
    className: 'fields',

    events:{
      'keyup': 'initialize',
      'keypress': 'escapeChar'
    },
    // replacing these inline keypress + keyup:
    // return escapChar(this,event,allowDec,3);
    // return escapChar(this,event,false);

    // template: _.template($('#fields_template').html()),

    escapeChar: function() {
      console.log(this);
    },

    initialize: function() {
      console.log("Initialize");
      this.on("change", function() {
        console.log('fieldset changed');
      });
    }

  });
  Calculator.InputView = Backbone.View.extend({
    tagName: 'input',
    className: 'number',

    events:{
      'keyup': 'initialize',
      'keypress': 'escapeChar'
    },
    // replacing these inline keypress + keyup:
    // return escapChar(this,event,allowDec,3);
    // return escapChar(this,event,false);

    // template: _.template($('#fields_template').html()),

    escapeChar: function() {
      console.log(this);
    },

    initialize: function() {
      console.log("Initialize");
    }

  });
  Calculator.ButtonView = Backbone.View.extend({

    tagName: 'input',
    id: 'calculate',

    events:{
      'click': 'fireCalculation'
    },

    fireCalculation: function() {
      console.log('fire calculation');
      return;
    }

  });
  Calculator.ResultView = Backbone.View.extend({
    tagName: 'fieldset',
    className: 'results',

  });


  var Calculation = Backbone.Model.extend({
    validate: function (attributes) {
      if (isNaN(attributes['zipcode'])) return "ZIP code must be a 5-digit number.";
    },

    defaults: {
      'total_length': '',
      'room_height': '',
      'door_count': '',
      'window_count': ''
    },

    initialize: function() {
      console.log('model initialized' + "\n" + this.attributes);
      this.on("invalid", function(model, error) {
        console.log(error);
      });
    },

    calculatePaint: function() {
      return this;
    }
  });

  var fields = new Calculator.FieldsView();
  window.fields = fields;
  var btn = new Calculator.ButtonView();
  window.btn = btn;
  var results = new Calculation();
  window.results = results;


}); // window.load
