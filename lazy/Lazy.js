enyo.kind({
    name:"Lazy",
    events: {
        onLazyLoad: ""
    },
    create: function() {
        this.lazy = this.components;
        this.components = [];
        this.inherited(arguments);
    },
    load: function() {
        if(this.lazy) {
            this.components = this.lazy;
            this.lazy = undefined;
            this.createClientComponents(this.components);
        }
        this.render();
        this.doLazyLoad();
    },
    asyncLoad: function() {
        enyo.asyncMethod(this, this.load);
    }
});