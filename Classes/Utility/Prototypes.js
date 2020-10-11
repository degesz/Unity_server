Object.defineProperty(Number.prototype, 'formatNumber', {
    value: function() {
        return new Intl.NumberFormat('en-US', {style: 'decimal'}).format(this);
    }
});