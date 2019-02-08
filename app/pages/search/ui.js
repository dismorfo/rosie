'use strict';

let app = new Vue({
  el: '#app',
  data: function () {
    return {
      q: null,
      label: `Searching term <span class="loading"><span>.</span><span>.</span><span>.</span></span>`,
      documents: [],
      rows: 10,
      start: 0,
      host: 'solr.local',
      port: '8983',
      protocol: 'http:',
      path: '/solr/rosie'
    };
  },
  mounted: function () {
    this.rows = this.$el.getAttribute('data-rows');
    this.start = this.$el.getAttribute('data-start');
    this.host = this.$el.getAttribute('data-host');
    this.port = this.$el.getAttribute('data-port');
    this.protocol = this.$el.getAttribute('data-protocol');
    this.path = this.$el.getAttribute('data-path');
    this.q = this.getParameterByName('q');
    if (this.q) {
      this.fetchDocuments();
    }
    else {
      this.label = `Please provide search term.`;
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
      const client = new createClient({
        host: vm.host,
        port: vm.port,
        protocol: vm.protocol,
        path: vm.path,
      });
      const query = client.createQuery() 
                        .q(vm.q)
                        .start(vm.start)
                        .rows(vm.rows);
      try {
        client.search(query, function (response) {
          console.log(response)
          const documents = response.data.response.docs;
          if (documents.length > 0) {
            documents.map(function (document) {
              vm.documents.push(document);
            });
          }
          else {
            vm.label = `Sorry, no results for "<em class="q">${vm.q}</em>"`;
          }
        });
      }
      catch (error) {
        console.error(error);
      }
    }
  }
});
