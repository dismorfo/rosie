var templateResult = `
    <li class="result">
      <h4 class="title"><a v-bind:href="document.url" v-html="document.label"></a></h4>
      <div class="content" v-html="document.ts_bio"></div>
    </li>`;

Vue.component('document-item', { props: ['document'], template: templateResult });

new Vue({
  el: '#app',        
  data: function () {
    return {
      documents : [],
      rows: 10,
      start: 0,
      host: '127.0.0.1',
      port: '8983',
      protocol: 'http',
      path: '/solr/collection1'
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
      var client = new createClient({
        host: vm.host,
        port: vm.port,
        protocol: vm.protocol,
        path: vm.path,
      });
      var q = client.getParameterByName('q');
      var query = client.createQuery() 
                        .q(q)
                        .start(vm.start)
                        .rows(vm.rows);
      try {
        client.search(query, function (response) {
          var documents = response.data.response.docs; 
          console.log('documents')
          documents.map(function (document) {
            vm.documents.push(document);
          });
        });
      }
      catch (error) {
        console.log('catch')
        console.error(error);
      }
    }
  }
});
