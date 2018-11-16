
var templateResult = `
    <li v-if="document.label" class="result">
      <h4 class="title"><a v-bind:href="document.url" v-html="document.label"></a></h4>
      <div class="content" v-html="document.ts_bio"></div>
    </li>
    `;

var emptyResult = `
  <li v-if="!documents.length" class="result-empty">
    <h4>Sorry, no results found for searched term <em class="q" v-html="q"></em>. Try a different term.</h4>
  </li>`;

Vue.component('document-item', { props: ['document'], template: templateResult });

Vue.component('empty-result', { props: ['q', 'documents'], template: emptyResult });

new Vue({
  el: '#app',
  data: function () {
    return {
      q: null,
      documents: [],
      rows: 10,
      start: 0,
      host: '127.0.0.1',
      port: '8983',
      protocol: 'http',
      path: 'solr/rosie'
    };
  },
  mounted: function () {
    this.rows = this.$el.getAttribute('data-rows');
    this.start = this.$el.getAttribute('data-start');
    this.host = this.$el.getAttribute('data-host');
    this.port = this.$el.getAttribute('data-port');
    this.protocol = this.$el.getAttribute('data-protocol');
    this.path = this.$el.getAttribute('data-path');
    this.fetchDocuments();
  },
  methods: {
    fetchDocuments: function () {
      var vm = this;
      client = new createClient({
        host: vm.host,
        port: vm.port,
        protocol: vm.protocol,
        path: vm.path,
      });
      vm.q = client.getParameterByName('q');
      var query = client.createQuery() 
                        .q(vm.q)
                        .start(vm.start)
                        .rows(vm.rows);
      try {
        client.search(query, function (response) {
          var documents = response.data.response.docs;
          if (documents.length > 0) {
            documents.map(function (document) {
              vm.documents.push(document);
            });
          }          
        });
      }
      catch (error) {
        console.error(error);
      }
    }
  }
});
