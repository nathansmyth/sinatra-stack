// An example Backbone application contributed by
// [JÃ©rÃ´me Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.html)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Category Model
  // ----------

  // **Category** model has CategoryId, CategoryName, and Models collection.
  window.Category = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function() {
      return {
        CategoryId: "0",
        CategoryName: "Home Improvement"
      };
    }

  });

  // Categories collection
  window.CategoryList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Category,

    // Save all of the category items under the `"categories"` namespace.
    // localStorage: new Store("homeimprovement"),
    url: '/api/categories'

    // 
  });

  // Create our global collection of **Categories**.
  window.Categories = new CategoryList;

  // Category Item View
  // --------------

  // The DOM element for a category item...
  window.CategoryView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#item-template').html()),
    // The DOM events specific to an item.
    events: {
      "dblclick div.category-text"    : "edit",
      "click span.category-destroy"   : "clear",
      "keypress .category-input"      : "updateOnEnter"
    },

    // The TodoView listens for changes to its model, re-rendering.
    initialize: function() {
      this.model.bind('change', this.render, this);
      this.model.bind('destroy', this.remove, this);
    },

    // Re-render the contents of the category item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      this.setText();
      return this;
    },

    // To avoid XSS (not that it would be harmful in this particular app),
    // we use `jQuery.text` to set the contents of the category item.
    setText: function() {
      var text = this.model.get('text');
      this.$('.category-text').text(text);
      this.input = this.$('.category-input');
      this.input.bind('blur', _.bind(this.close, this)).val(text);
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      $(this.el).addClass("editing");
      this.input.focus();
    },

    // Close the `"editing"` mode, saving changes to the category.
    close: function() {
      this.model.save({text: this.input.val()});
      $(this.el).removeClass("editing");
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },

    // Remove this view from the DOM.
    remove: function() {
      $(this.el).remove();
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }
  });


  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  window.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#homeimprovement"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-category":  "createOnEnter",
      "click .category-clear a": "clearCompleted"
    },

    // At initialization we bind to the relevant events on the `Categories`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting categories that might be saved in *localStorage*.
    initialize: function() {
      this.input    = this.$("#new-category");

      Categories.bind('add',   this.addOne, this);
      Categories.bind('reset', this.addAll, this);
      Categories.bind('all',   this.render, this);

      Categories.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      this.$('#category-stats').html(this.statsTemplate({
        total:      Categories.length
      }));
    },

    // Add a single category item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(category) {
      var view = new CategoryView({model: category});
      this.$("#category-list").append(view.render().el);
    },

    // Add all items in the **Categories** collection at once.
    addAll: function() {
      Categories.each(this.addOne);
    },

    // If you hit return in the main input field, and there is text to save,
    // create new **Category** model persisting it to *localStorage*.
    createOnEnter: function(e) {
      var text = this.input.val();
      if (!text || e.keyCode != 13) return;
      Categories.create({CategoryName: text});
      this.input.val('');
    },

    // Clear all done category items, destroying their models.
    clearCompleted: function() {
      _.each(Categories.done(), function(category){ category.destroy(); });
      return false;
    },

  });

  // Finally, we kick things off by creating the **App**.
  window.App = new AppView;

});