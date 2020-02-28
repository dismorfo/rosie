new Vue({
  el: '#app',
  data: function () {
    return {
      q: null,
      label: 'Searching term <span class="loading"><span>.</span><span>.</span><span>.</span></span>',
      documents: [],
      rows: 10,
      start: 0,
      discovery: '',
      isBusy: true,
    };
  },
  mounted: function () {
    this.rows = this.$el.getAttribute('data-rows');
    this.start = this.$el.getAttribute('data-start');
    this.discovery = this.$el.getAttribute('data-discovery');
    this.q = this.getParameterByName('q');
    if (this.q) {
      this.fetchDocuments();
    }
    else {
      this.label = 'Please provide search term.';
    }
  },
  computed: {
    hasDocuments: function() {
      return this.documents.length > 0;
    }
  },
  methods: {
    getParameterByName: function (name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    fetchDocuments: function () {
      const vm = this;
        fetch(`${this.discovery}?q=${this.q}`, {
          method: 'GET'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          if (parseInt(data.hits.found, 10) > 0) {
            data.hits.hit.map(document => {
              vm.documents.push(document.fields);
            });
          } else {
            vm.label = `Sorry, no results for "<em class="q">${vm.q}</em>"`;
          }
        })
        .finally(() => {
          this.isBusy = false;
        })
        .catch((error) => {
          console.log('Looks like there was a problem: \n', error);
        });
    }
  }
});
