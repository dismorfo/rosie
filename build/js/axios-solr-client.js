/**
 * Load dependencies
 */
// var querystring = require('querystring')

/**
 * The purpose of those helpers is to centralize and standardize the work on detecting current running Solr Version
 */

const Solr3_2 = 302;
const Solr4_0 = 400;
const Solr5_0 = 500;
const Solr5_1 = 501;

/**
 *
 * @param value
 * @param defaultIfNull - Will set the value to the default if it is Null or Undefined
 * @returns {*[]}
 */
function toArray(value, defaultIfNull) {
  defaultIfNull = defaultIfNull || '';
  function defaultValue(value) {
    return (value === null || value === undefined) ? defaultIfNull : value;
  }
  return (Array.isArray(value)) ? value : [defaultValue(value)];
}

/**
 * ISOify `Date` objects (possibly in collections)
 *
 * @param {Array|Object} obj
 *
 * @return {Array|Object}
 * @api private
 */

function dateISOify(obj){
  if( obj instanceof Array ){
     for(var i = 0; i < obj.length; i++){
        obj[i] = dateISOify(obj[i]);
     }
  }else if(obj instanceof Object && !(obj instanceof Date) ){
     for(var key in obj){
        if( obj[key] instanceof Date ) obj[key] = toISOString(obj[key]);
     }
  }else{
     if( obj instanceof Date ) obj = toISOString(obj);
  }
  return obj;
};

/**
* ISOify a single `Date` object
* Sidesteps `Invalid Date` objects by returning `null` instead
*
* @param {Date}
*
* @return {null|String}
* @api private
*/
function toISOString(date) {
  return (date && !isNaN(date.getTime())) ? date.toISOString() : null;
};

/**
* Serialize an object to a string. Optionally override the default separator ('&') and assignment ('=') characters.
*
* @param {Object} obj - object to serialiaze
* @param {String} [sep] - separator character
* @param {String} [eq] - assignment character
* @param {String} [name] -
*
* @return {String}
* @api private
*/

function stringify(obj, sep, eq, name) {
 sep = sep || '&';
 eq = eq || '=';
 obj = (obj === null) ? undefined : obj;

 switch (typeof obj) {
   case 'object':
     return Object.keys(obj).map(function(k) {
       if (Array.isArray(obj[k])) {
         return obj[k].map(function(v) {
           return stringifyPrimitive(k) +
                  eq +
                  stringifyPrimitive(v);
         }).join(sep);
       } else {
         return stringifyPrimitive(k) +
                eq +
                stringifyPrimitive(obj[k]);
       }
     }).join(sep);

   default:
     if (!name) return '';
     return stringifyPrimitive(name) + eq +
            stringifyPrimitive(obj);
 }
};

/**
* Stringify a primitive
*
* @param {String|Boolean|Number} v - primitive value
*
* @return {String}
* @api private
*/
function stringifyPrimitive(v) {
 switch (typeof v) {
   case 'string':
     return v;

   case 'boolean':
     return v ? 'true' : 'false';

   case 'number':
     return isFinite(v) ? v : '';

   default:
     return '';
 }
};

/**
 * Escape special characters that are part of the query syntax of Lucene
 *
 * @param {String} s - string to escape
 *
 * @return {String}
 * @api public
 */

function escapeSpecialChars(s){
 return s.replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\])/g, function(match) {
   return '\\' + match;
 })
 .replace(/&&/g, '\\&\\&')
 .replace(/\|\|/g, '\\|\\|');
}


/**
 * Create a new `Query`
 * @constructor
 *
 * @return {Query}
 * @api private
 */

function Query(options){
   this.solrVersion = (options && options.solrVersion) || undefined;
   this.parameters = [];
}

/**
 * Set a new parameter
 * Since all possibilities provided by Solr are not available in the `Query` object, `set()` is there to fit this gap.
 *
 * @param {String} parameter - string, special characters have to be correctly encoded or the request will fail.
 *
 * @return {Query} - allow chaining
 * @api public
 */
Query.prototype.set = function(parameter){
   var self = this;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the query parser to use with this request.
 *
 * @param {String} type - name of the query parser e.g: 'dismax'
 *
 * @return {Query}
 * @api public
 */

Query.prototype.defType = function(type){
   var self = this;
   var parameter = 'defType=' + type;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Request Handler used to process the request based on its `name`.
 * Works only if no Request Handler has been configured with `/select` as its name in solrconfig.xml.
 *
 * @param {String} name - name of the Request Handler
 *
 * @return {Query}
 * @api public
 */

Query.prototype.requestHandler =
Query.prototype.qt = function(name){
  var self = this;
  var parameter = 'qt=' + name;
  this.parameters.push(parameter);
  return self;
}

/**
 *  Set the main query
 *
 * @param {String|Object} q -
 *
 * @return  {Query}
 * @api public
 */

Query.prototype.q = function(q){
   var self = this;
   var parameter ='q=';
   if ( typeof(q) === 'string' ){
      parameter += encodeURIComponent(q);
   }else{
      parameter += stringify(q, '%20AND%20',':');
   }
   this.parameters.push(parameter);
   return self;
}

/**
 *  Set the default query operator
 *
 * @param {String} op -
 *
 * @return  {Query}
 * @api public
 */

Query.prototype.qop = function(op){
    var self = this;
    var parameter ='q.op=';
    parameter += op;
    this.parameters.push(parameter);
    return self;
};

/**
 * Set the default query field.
 *
 * @param {String} df - the default field where solr should search.
 *
 * @return  {Query}
 * @api public
 */
Query.prototype.df = function (df) {
    var self = this;
    var parameter = 'df=';
    parameter += df;
    this.parameters.push(parameter);
    return self;
};

/**
 * Set the offset where the set of returned documents should begin.
 *
 * @param {Number} start - the offset where the set of returned documents should begin.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.start = function(start){
   var self = this;
   var parameter = 'start=' + start ;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the maximum number of documents returned
 *
 * @param {Number} rows - number of documents
 *
 * @return {Query}
 * @api public
 */
Query.prototype.rows = function(rows){
   var self = this;
   var parameter = 'rows=' + rows ;
   this.parameters.push(parameter);
   return self;
}

/**
 * Request to use cursorMarks for deep-paging as explained in http://heliosearch.org/solr/paging-and-deep-paging/
 * Note that usage of a cursor requires a sort containing a uniqueKey field tie breaker
 *
 * @param {String} mark - The mark to use, defaults to "*" to request a new cursor in the first request
 *
 * @return {Query}
 * @api public
 */
Query.prototype.cursorMark = function(mark){
   var self = this;
   mark = mark || "*";
   var parameter = 'cursorMark=' + encodeURIComponent(mark);
   this.parameters.push(parameter);
   return self;
}

/**
 * Sort a result in descending or ascending order based on one or more fields.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.sort = function(options){
   var self = this;
   var parameter = 'sort=';
   parameter += stringify(options, ',' , '%20');
   this.parameters.push(parameter);
   return self;
}

/**
 * Filter the set of documents found before to return the result with the given range determined by `field`, `start` and `end`.
 *
 * @param {Array|Object} options -
 * @param {String} options.field - the name of the field where the range is applied
 * @param {String|Number|Date} options.start - the offset where the range starts
 * @param {String|Number|Date} options.end - the offset where the range ends
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.q({ '*' : '*' }).rangeFilter({ field : 'id', start : 100, end : 200})
 * // also works
 * query.q({ '*' : '*' }).rangeFilter([{ field : 'id', start : 100, end : 200},{ field : 'date', start : new Date(), end : new Date() - 3600}]);
 */

Query.prototype.rangeFilter = function(options){
   var self = this;
   options = dateISOify(options);
   var parameter = 'fq=';
   if(Array.isArray(options)){
     parameter += "(";
      var filters = options.map(function(option){
         var key = option.field;
         var filter = {};
         filter[key] = '[' + encodeURIComponent(option.start) + '%20TO%20' + encodeURIComponent(option.end) + ']';
         return stringify(filter, '',':');
      });
      parameter += filters.join('%20AND%20');
      parameter += ")";
   }else{
      var key = options.field;
      var filter = {};
      filter[key] = '[' + encodeURIComponent(options.start) + '%20TO%20' + encodeURIComponent(options.end) + ']';
      parameter += stringify(filter, '',':');
   }
   this.parameters.push(parameter);
   return self;
}

/**
 * Filter the set of documents found before to return the result with the given `field` and `value`.
 *
 * @param {String} field - name of field
 * @param {String|Number|Date} value - value of the field that must match
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.q({ '*' : '*' }).matchFilter('id', 100)
 */

Query.prototype.matchFilter = function(field,value){
   var self = this;
   value = dateISOify(value);
   var parameter = 'fq=';
   parameter += field + ':' + encodeURIComponent(value);
   this.parameters.push(parameter);
   return self;
}

/**
 * Specify a set of fields to return.
 *
 * @param {String|Array} field - field name
 *
 * @return {Query}
 * @api public
 */

Query.prototype.fl =
Query.prototype.restrict = function(fields){
   var self = this;
   var parameter = 'fl=';
   if(typeof(fields) === 'string'){
      parameter += encodeURIComponent(fields);
   }else{
      parameter += encodeURIComponent(fields.join(','));
   }
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the time allowed for a search to finish.
 * Partial results may be returned (if there are any).
 *
 * @param {String|Number} time - time is in milliseconds. Values <= 0 mean no time restriction.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.timeout = function(time){
   var self = this;
   var parameter = 'timeAllowed=' + time;
   this.parameters.push(parameter);
   return self;
}

/**
 * Group documents with the given `field`
 *
 * @param {String} field - field name
 *
 * @return {Query}
 * @api public
 */

Query.prototype.groupBy = function(field){
   var self = this;
   this.group({
      'field': field
   });
   return self;
}

/**
 * Group documents using field collapsing or result grouping feature.
 * Field Collapsing collapses a group of results with the same field value down to a single (or fixed number) of entries.
 * Result Grouping groups documents with a common field value into groups, returning the top documents per group, and the top groups based on what documents are in the groups.
 *
 * @param {Object} options
 * @param {Boolean} [options.on=true] - if false, turn off result grouping, otherwise turn on.
 * @param {String|Array} options.field - Group based on the unique values of a field.
 * @param {Number} [options.limit=1] - The number of results (documents) to return for each group. Solr's default value is 1.
 * @param {Number} options.offset - The offset into the document list of each group.
 * @param {String} [options.sort="score desc"] - How to sort documents within a single group. Defaults to the same value as the sort parameter.
 * @param {String} options.format - if simple, the grouped documents are presented in a single flat list. The start and rows parameters refer to numbers of documents instead of numbers of groups.
 * @param {Boolean} options.main - If true, the result of the last field grouping command is used as the main result list in the response, using group.format=simple.
 * @param {Boolean} [options.ngroups=false] - If true, includes the number of groups that have matched the query. Default is false.
 * @param {Boolean} options.truncate - If true, facet counts are based on the most relevant document of each group matching the query. Same applies for StatsComponent. Default is false.
 * @param {Number}  [options.cache=0] - If > 0 enables grouping cache. Grouping is executed actual two searches. This option caches the second search. A value of 0 disables grouping caching. Default is 0.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.group = function(options){
   var self = this;
   if(options.on === false){
      this.parameters.push('group=false');
   }else{
      this.parameters.push('group=true');
   }
   if( options.field ){
      options.field = toArray(options.field);
      options.field.forEach(function(field){
        self.parameters.push('group.field=' + field);
      });
   }
   if( options.limit !== undefined){
      this.parameters.push('group.limit=' + options.limit);
   }
   if( options.offset !== undefined){
      this.parameters.push('group.offset=' + options.offset);
   }
   if( options.sort ){
      this.parameters.push('group.sort=' + encodeURIComponent(options.sort));
   }
   if( options.format ){
      this.parameters.push('group.format=' + encodeURIComponent(options.format));
   }
   if( options.main !== undefined){
      this.parameters.push('group.main=' + options.main);
   }
   if( options.ngroups !== undefined){
      this.parameters.push('group.ngroups=' + options.ngroups);
   }
   if( options.truncate !== undefined){
      this.parameters.push('group.truncate=' + options.truncate);
   }
   if( options.cache !== undefined){
      this.parameters.push('group.cache.percent=' + options.cache);
   }
   return self;
}

/**
 * Create a facet
 *
 * @param {Object} options - set of options to create a facet
 * @param {Boolean} [options.on=true] - Turn on or off facet
 * @param {String} [options.query] - This parameter allows you to specify an arbitrary query in the Lucene default syntax to generate a facet count. By default, faceting returns a count of the unique terms for a "field", while facet.query allows you to determine counts for arbitrary terms or expressions.
 * @param {String|Array} options.field - This parameter allows you to specify a field which should be treated as a facet. It will iterate over each Term in the field and generate a facet count using that Term as the constraint. Multiple fields can be defined providing an array instead of a string.
 * @param {String} [options.prefix] - Limits the terms on which to facet to those starting with the given string prefix.
 * @param {String} [options.sort] - This param determines the ordering of the facet field constraints.count
 * @param {Number} [options.limit=100] - This parameter indicates the maximum number of constraint counts that should be returned for the facet fields. A negative value means unlimited.The solr's default value is 100.
 * @param {Number} [options.offset=0] - This param indicates an offset into the list of constraints to allow paging.The solr's default value is 0.
 * @param {Number} [options.mincount=0] - This parameter indicates the minimum counts for facet fields should be included in the response. The solr's default value is 0.
 * @param {Boolean} [options.missing=false] - Set to `true` this param indicates that in addition to the Term based constraints of a facet field, a count of all matching results which have no value for the field should be computed. The solr's default value is false.
 * @param {String} [options.method="fc"] - This parameter indicates what type of algorithm/method to use when faceting a field.The solr's default value is fc (except for BoolField).
 * @param {String|Array} options.pivot - This parameter allows you to specify a field which should be treated as a facet pivot. It will iterate over each Term in the field. Multiple fields can be defined providing an array instead of a string.
 * @param {String} [options.pivot.mincount=0] - This parameter indicates the minimum counts for facet pivot fields to be included in the response. The solr's default value is 0.
 *
 * @return {Query}
 * @api public
 */
Query.prototype.facet = function(options){
   var self = this;
   if(options.on === false){
      this.parameters.push('facet=false');
   }else{
      this.parameters.push('facet=true');
   }
   if(options.query){
      this.parameters.push('facet.query=' + encodeURIComponent(options.query))
   }
   if(options.field){
     options.field = toArray(options.field);
     options.field.forEach(function(field) {
       self.parameters.push('facet.field=' + field);
     });
   }
   if(options.prefix){
      this.parameters.push('facet.prefix=' + encodeURIComponent(options.prefix))
   }
   if(options.sort){
      this.parameters.push('facet.sort=' + encodeURIComponent(options.sort))
   }
   if(options.limit !== undefined){
      this.parameters.push('facet.limit=' + options.limit);
   }
   if(options.offset !== undefined){
      this.parameters.push('facet.offset=' + options.offset);
   }
   if(options.mincount !== undefined){
      this.parameters.push('facet.mincount=' + options.mincount);
   }
   if(options.missing !== undefined){
      this.parameters.push('facet.missing=' + options.missing);
   }
   if(options.method){
      this.parameters.push('facet.method=' + options.method);
   }

   // Only supported with version 4.0 and above
   // if(this.solrVersion && (version(this.solrVersion) >= Solr4_0)) {
     if(options.pivot){
       options.field = toArray(options.pivot.fields);
       options.field.forEach(function(field) {
         self.parameters.push('facet.pivot=' + field);
       });

       if(options.pivot.mincount) {
         this.parameters.push('facet.pivot.mincount=' + options.pivot.mincount);
       }
     }
   // }

   return self;
}

/**
 * Create a MoreLikeThis. MoreLikeThis constructs a lucene query based on terms within a document.
 *
 * @param {Object} options - set of options to create a morelikethis
 * @param {Boolean} [options.on=true] - Turn on or off morelikethis
 * @param {String|Array} [options.fl] - The fields to use for similarity. NOTE: if possible, these should have a stored TermVector
 * @param {Number} [options.count] - The number of similar documents to return for each result.
 * @param {Number} [options.mintf] - Minimum Term Frequency - the frequency below which terms will be ignored in the source doc.
 * @param {Number} [options.mindf] - Minimum Document Frequency - the frequency at which words will be ignored which do not occur in at least this many docs.
 * @param {Number} [options.minwl] - minimum word length below which words will be ignored.
 * @param {Number} [options.maxwl] - maximum word length above which words will be ignored.
 * @param {Number} [options.maxqt] - maximum number of query terms that will be included in any generated query.
 * @param {Number} [options.maxntp] - maximum number of tokens to parse in each example doc field that is not stored with TermVector support.
 * @param {Boolean} [options.boost] - set if the query will be boosted by the interesting term relevance.
 * @param {String|Object} [options.qf] - Query fields and their boosts using the same format as that used in DisMaxQParserPlugin. These fields must also be specified in mlt.fl.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.mlt = function(options){
  var self = this;
  if(options.on === false){
    this.parameters.push('mlt=false');
  }else{
    this.parameters.push('mlt=true');
  }
  if(options.fl){
    if(options.fl instanceof Array) options.fl = options.fl.join(',');
    this.parameters.push('mlt.fl=' + encodeURIComponent(options.fl))
  }
  if(options.count !== undefined){
    this.parameters.push('mlt.count=' + options.count)
  }
  if(options.mintf !== undefined){
    this.parameters.push('mlt.mintf=' + options.mintf)
  }
  if(options.mindf !== undefined){
    this.parameters.push('mlt.mindf=' + options.mindf);
  }
  if(options.minwl !== undefined){
    this.parameters.push('mlt.minwl=' + options.minwl)
  }
  if(options.maxwl !== undefined ){
    this.parameters.push('mlt.maxwl=' + options.maxwl)
  }
  if(options.maxqt !== undefined){
    this.parameters.push('mlt.maxqt=' + options.maxqt)
  }
  if(options.maxntp !== undefined){
    this.parameters.push('mlt.maxntp=' + options.maxntp);
  }
  if(options.boost !== undefined){
    this.parameters.push('mlt.boost=' + options.boost);
  }
  if(options.qf){
    if( typeof options.qf === 'object'){
      var parameter = stringify(options.qf, '%20' , '^');;
    }else{
      var parameter = encodeURIComponent(options.qf);
    }
    this.parameters.push('mlt.qf=' + parameter);
  }
  return self;
}

/*!
 * DisMax parameters
 * do not forget to use `.dismax()` when using these parameters
 */

/**
 * Use the DisMax query parser
 *
 * @return {Query}
 * @api public
 */

Query.prototype.dismax = function(){
   var self = this;
   this.defType('dismax');
   return self;
}

/*!
 * EDisMax parameters
 * do not forget to use `.edismax()` when using these parameters
 */

/**
 * Use the EDisMax query parser
 *
 * @return {Query}
 * @api public
 */

Query.prototype.edismax = function(){
   var self = this;
   this.defType('edismax');
   return self;
}

/**
 * Add the parameter debugQuery.
 * Additional debugging informations will be available in the response.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.debugQuery = function(){
   var self = this;
   this.parameters.push('debugQuery=true');
   return self;
}

//TODO
Query.prototype.ps = function(){}

/**
 * Set the "boosts" to associate with each fields
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.qf({title : 2.2, description : 0.5 });
 */

Query.prototype.qf = function(options){
   var self = this;
   var parameter = 'qf=' ;
   parameter += stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the minimum number or percent of clauses that must match.
 *
 * @param {String|Number} minimum - number or percent of clauses that must match
 *
 * @return {Query}
 * @api public
 *
 * @example
 * var query = client.createQuery();
 * query.mm(2); // or query.mm('75%');
 */

Query.prototype.mm = function(minimum){
   var self = this;
   var parameter = 'mm=' + minimum;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Phrase Fields parameter.
 * Once the list of matching documents has been identified using the "fq" and "qf" params, the "pf" param can be used to "boost" the score of documents in cases where all of the terms
 * in the "q" param appear in close proximity.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.pf = function(options){
   var self = this;
   var parameter = 'pf=' ;
   parameter += stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the phrase slop allowed in a query.
 *
 * @param {Number} slop - Amount of phrase slop allowed by the query filter. This value should represent the maximum number of words allowed between words in a field that match a phrase in the query.
 *
 * @return {Query}
 * @api public
 */

Query.prototype.ps = function(slop){
   var self = this;
   var parameter = 'ps=' + slop;
   this.parameters.push(parameter);
   return self;
};

/**
 * Set the query slop allowed in a query.
 *
 * @param {Number} slop - Amount of query slop allowed by the query filter. This value should be used to affect boosting of query strings.
 *
 * @return {Query}
 * @api public
 */
Query.prototype.qs = function(slop){
   var self = this;
   var parameter = 'qs=' + slop;
   this.parameters.push(parameter);
   return self;
};

/**
 * Set the tiebreaker in DisjunctionMaxQueries (should be something much less than 1)
 *
 * @param {Float|Number} tiebreaker -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.tie = function(tiebreaker){
   var self = this;
   var parameter = 'tie=' + tiebreaker;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Boost Query parameter.
 * A raw query string (in the SolrQuerySyntax) that will be included with the user's query to influence the score. If this is a BooleanQuery with a default boost (1.0f) then the individual clauses will be added directly to the main query. Otherwise, the query will be included as is.
 *
 * @param {Object} options -
 *
 * @return {Query}
 * @api public
 */

Query.prototype.bq = function(options){
   var self = this;
   var parameter = 'bq=' ;
   parameter += stringify(options, '%20' , '^');
   this.parameters.push(parameter);
   return self;
}


/**
 * Set the Functions (with optional boosts) that will be included in the user's query to influence the score.
 * @param {String} functions - e.g.: `recip(rord(myfield),1,2,3)^1.5`
 *
 * @return {Query}
 * @api public
 */

Query.prototype.bf = function(functions){
   var self = this;
   var parameter = 'bf=' + functions;
   this.parameters.push(parameter);
   return self;
}

/**
 * Set the Functions (with optional boosts) that will be included in the user's query to influence the score.
 * @param {String} functions - e.g.: `recip(rord(myfield),1,2,3)^1.5`
 *
 * @return {Query}
 * @api public
 */

Query.prototype.boost = function(functions){
   var self = this;
   var parameter = 'boost=' + encodeURIComponent(functions);
   this.parameters.push(parameter);
   return self;
}

/**
 * Build a querystring with the array of `this.parameters`.
 *
 * @return {String}
 * @api private
 */
Query.prototype.build = function(){
   return this.parameters.join('&');
}

/**
 * Set the Query Highlighting parameter.
 *
 * @param {Object} options - set of options for Highlighting
 * @param {Boolean} [options.on=true] - Turn on or off Highlighting
 * @param {String|Array} [options.q] - This parameters specifies and overriding query for highlighting. Multiple values specified in an array will be chained together with AND.
 * @param {String} [options.qparser] - This parameter specifies the qparser for the hl.q query.
 * @param {String|Array} [options.fl] - 'Field list.' Fields to be highlighted. Multiple fields can be entered by providing an array.
 * @param {Number} [options.snippets] - This parameter defines the maximum number of snippets to generate per field. Any number of snippets from 0 to this number can be generated per field
 * @param {Number} [options.fragsize] - This parameter defines the size, in characters, of the fragments to consider for highlighting.
 * @param {Boolean} [options.mergeContiguous] - This parameter instructs Solr to collapse continguous fragments into a single fragment.
 * @param {Number} [options.maxAnalyzedChars] - This param specifies the number of characters into a document that Solr should look for suitable snippets.
 * @param {Number} [options.maxMultiValuedToExamine] - This param specifies the max number of entries in a multi-valued field to examine before stopping
 * @param {Number} [options.maxMultiValuedToMatch] - This param specifies the maximum number of matches in a multi-valued field that are found before stopping.
 * @param {String} [options.alternateField] - Specifies a field to be used as a backup default summary if Solr cannot generate a snippet.
 * @param {Number} [options.maxAlternateFieldLength] - Specifies the maximum number of characters of the field to return. A number <=0 means the field length is unlimited.
 * @param {String} [options.formatter] - Selects a formatter for the highlighted output. At the time of writing, the only legal value is 'simple'.
 * @param {String} [options.simplePre] - This parameter defines the string to place before the data to be highlighted.
 * @param {String} [options.simplePost] - This parameter defines the string to place after the data to be highlighted.
 * @param {String} [options.fragmenter] - Specifies a text snippet generator for highlighted text. Default is 'gap' but 'regex' is another option.
 * @param {Boolean} [options.highlightMultiTerm] - Turn on or off MultiTermHighlighting. If True, Solr will use Highlight phrase terms that appear in multiple fields.
 * @param {Boolean} [options.requireFieldMatch] - If set to True, this parameter will force Solr to highlight terms only if they appear in the specified field. If false, terms are highlighted in all requested fields regardless of which field matches the query.
 * @param {Boolean} [options.usePhraseHighlighter] - If set to True, Solr will use the Lucene SpanScorer class to highlight phrase terms only when they appear within the query phrase in the document.
 * @param {Number} [options.regexSlop] - When using the regex fragmenter, this number specifies the factor by which the fragmenter can stray from the ideal fragment size.
 * @param {String} [options.regexPattern] - This parameter specifies the regulat expression for fragmenting.
 * @param {Number} [options.regexMaxAnalyzedChars] - This parameters specifies the max number of characters to analyze from a field when using the regex fragmenter.
 * @param {Boolean} [options.preserveMulti] - If True, multi-valued fields will return all values in the order they were saved in the index. If False, only values that match the highlight request will be returned.
 * @param {Boolean} [options.payloads] - If usePhraseHighlighter is True, and the indexed field has payloads but not term vectors, the index payloads will be read into the highlighter's index along with the posting. If you don't want this behavior, you may set this parameter to False and save some memory.

 *
 * @return {Query}
 * @api public
 */

Query.prototype.hl = function(options){
   var self = this;
   if(options.on === false){
      this.parameters.push('hl=false');
   }else{
      this.parameters.push('hl=true');
   }
   if(options.q !== undefined){
      if ( typeof(options.q) === 'string' ){
         this.parameters.push('hl.q=' + encodeURIComponent(options.q));
      }else{
         this.parameters.push('hl.q=' + stringify(options.q, '%20AND%20',':'));
      }
   }
   if(options.qparser !== undefined){
      this.parameters.push('hl.qparser=' + encodeURIComponent(options.qparser));
   }
   if(options.fl !== undefined){
      if ( typeof(options.fl) === 'string' ){
         this.parameters.push('hl.fl=' + encodeURIComponent(options.fl));
      }else{
         this.parameters.push('hl.fl=' + options.fl.join(','));
      }
   }
   if(options.snippets !== undefined){
      this.parameters.push('hl.snippets=' + encodeURIComponent(options.snippets));
   }
   if(options.fragsize !== undefined){
      this.parameters.push('hl.fragsize=' + encodeURIComponent(options.fragsize));
   }
   if(options.mergeContiguous !== undefined){
      this.parameters.push('hl.mergeContiguous=' + encodeURIComponent(options.mergeContiguous));
   }
   if(options.requireFieldMatch !== undefined){
      this.parameters.push('hl.requireFieldMatch=' + encodeURIComponent(options.requireFieldMatch));
   }
   if(options.maxAnalyzedChars !== undefined){
      this.parameters.push('hl.maxAnalyzedChars=' + encodeURIComponent(options.maxAnalyzedChars));
   }
   if(options.maxMultiValuedToExamine !== undefined){
      this.parameters.push('hl.maxMultiValuedToExamine=' + encodeURIComponent(options.maxMultiValuedToExamine));
   }
   if(options.maxMultiValuedToMatch !== undefined){
      this.parameters.push('hl.maxMultiValuedToMatch=' + encodeURIComponent(options.maxMultiValuedToMatch));
   }
   if(options.alternateField){
      this.parameters.push('hl.alternateField=' + encodeURIComponent(options.alternateField));
   }
   if(options.maxAlternateFieldLength !== undefined){
      this.parameters.push('hl.maxAlternateFieldLength=' + encodeURIComponent(options.maxAlternateFieldLength));
   }
   if(options.formatter){
      this.parameters.push('hl.formatter=' + encodeURIComponent(options.formatter));
   }
   if(options.simplePre){
      this.parameters.push('hl.simple.pre=' + encodeURIComponent(options.simplePre));
   }else{
      this.parameters.push('hl.simple.pre=<em>');
   }
   if(options.simplePost){
      this.parameters.push('hl.simple.post=' + encodeURIComponent(options.simplePost));
   }else{
      this.parameters.push('hl.simple.post=<%2Fem>');
   }
   if(options.fragmenter){
      this.parameters.push('hl.fragmenter=' + encodeURIComponent(options.fragmenter));
   }
   if(options.highlightMultiTerm !== undefined){
      this.parameters.push('hl.highlightMultiTerm=' + encodeURIComponent(options.highlightMultiTerm));
   }
   if(options.usePhraseHighlighter !== undefined){
      this.parameters.push('hl.usePhraseHighlighter=' + encodeURIComponent(options.usePhraseHighlighter));
   }
   if(options.regexSlop !== undefined){
      this.parameters.push('hl.regex.slop=' + encodeURIComponent(options.regexSlop));
   }
   if(options.regexPattern){
      this.parameters.push('hl.regex.pattern=' + encodeURIComponent(options.regexPattern));
   }
   if(options.regexMaxAnalyzedChars){
      this.parameters.push('hl.regex.maxAnalyzedChars=' + encodeURIComponent(options.regexMaxAnalyzedChars));
   }
   if(options.preserveMulti !== undefined){
      this.parameters.push('hl.preserveMulti=' + encodeURIComponent(options.preserveMulti));
   }
   if(options.payloads !== undefined){
      this.parameters.push('hl.payloads=' + encodeURIComponent(options.payloads));
   }

   return self;
}

/**
 * Create a terms
 *
 * @param {Object} options - set of options to create a terms
 * @param {Boolean} [options.on=true] - Turn on or off terms
 * @param {String} options.fl - The name of the field to get the terms from.
 * @param {String} [options.lower] - The term to start at. If not specified, the empty string is used, meaning start at the beginning of the field.
 * @param {Boolean} [options.lowerIncl] - The term to start at. Include the lower bound term in the result set. Default is true.
 * @param {Number} [options.mincount] - The minimum doc frequency to return in order to be included.
 * @param {Number} [options.maxcount] - The maximum doc frequency.
 * @param {String} [options.prefix] - Restrict matches to terms that start with the prefix.
 * @param {String} [options.regex] - Restrict matches to terms that match the regular expression.
 * @param {String} [options.regexFlag] - Flags to be used when evaluating the regular expression defined in the "terms.regex" parameter.(case_insensitive|comments|multiline|literal|dotall|unicode_case|canon_eq|unix_lines)
 * @param {Number} [options.limit] - The maximum number of terms to return.
 * @param {String} [options.upper] - The term to stop at. Either upper or terms.limit must be set.
 * @param {Boolean} [options.upperIncl] - Include the upper bound term in the result set. Default is false.
 * @param {Boolean} [options.raw] - If true, return the raw characters of the indexed term, regardless of if it is human readable.
 * @param {String} [options.sort] - If count, sorts the terms by the term frequency (highest count first). If index, returns the terms in index order.(count|index)
 *
 * @return {Query}
 * @api public
 */

Query.prototype.terms = function(options){
  var self = this;
  if(options.on === false){
    this.parameters.push('terms=false');
  }else{
    this.parameters.push('terms=true');
  }
  if(options.fl){
    this.parameters.push('terms.fl=' + encodeURIComponent(options.fl))
  }
  if(options.lower !== undefined){
    this.parameters.push('terms.lower=' + encodeURIComponent(options.lower));
  }
  if(options.lowerIncl !== undefined){
    this.parameters.push('terms.lower.incl=' + encodeURIComponent(options.lowerIncl));
  }
  if(options.mincount !== undefined){
    this.parameters.push('terms.mincount=' + options.mincount);
  }
  if(options.maxcount !== undefined){
    this.parameters.push('terms.maxcount=' + options.maxcount);
  }
  if(options.prefix !== undefined){
    this.parameters.push('terms.prefix=' + encodeURIComponent(options.prefix));
  }
  if(options.regex !== undefined){
    this.parameters.push('terms.regex=' + encodeURIComponent(options.regex));
  }
  if(options.regexFlag !== undefined){
    this.parameters.push('terms.regexFlag=' + encodeURIComponent(options.regexFlag));
  }
  if(options.limit !== undefined){
    this.parameters.push('terms.limit=' + options.limit);
  }
  if(options.upper !== undefined){
    this.parameters.push('terms.upper=' + encodeURIComponent(options.upper));
  }
  if(options.upperIncl !== undefined){
    this.parameters.push('terms.upper.incl=' + encodeURIComponent(options.upperIncl));
  }
  if(options.raw !== undefined){
    this.parameters.push('terms.raw=' + encodeURIComponent(options.raw));
  }
  if(options.sort !== undefined){
    this.parameters.push('terms.sort=' + encodeURIComponent(options.sort));
  }
  return self;
}

/**
 * Create an instance of `Client`
 *
 * @param {String|Object} [host='127.0.0.1'] - IP address or host address of the Solr server
 * @param {Number|String} [port='8983'] - port of the Solr server
 * @param {String} [core=''] - name of the Solr core requested
 * @param {String} [path='/solr'] - root path of all requests
 * @param {http.Agent} [agent] - HTTP Agent which is used for pooling sockets used in HTTP(s) client requests
 * @param {Boolean} [secure=false] - if true HTTPS will be used instead of HTTP
 * @param {Boolean} [bigint=false] - if true JSONbig serializer/deserializer will be used instead
 *                                    of JSON native serializer/deserializer
 * @param solrVersion ['3.2', '4.0', '5.0', '5.1'], check lib/utils/version.js for full reference
 * @param {Number} [ipVersion=4] - pass it to http/https lib's "family" option
 *
 * @return {Client}
 * @api public
 */

function createClient(host, port, core, path, agent, secure, bigint, solrVersion, ipVersion){
  var options = (typeof host === 'object') ? host : {
      host : host,
      port : port,
      core : core,
      path : path,
      agent : agent,
      secure : secure,
      bigint : bigint,
      solrVersion: solrVersion,
      ipVersion: ipVersion == 6 ? 6 : 4
   };
  return new Client(options);
}

/**
 * Solr client
 * @constructor
 *
 * @param {Object} options - set of options used to request the Solr server
 * @param {String} options.host - IP address or host address of the Solr server
 * @param {Number|String} options.port - port of the Solr server
 * @param {String} options.core - name of the Solr core requested
 * @param {String} options.path - root path of all requests
 * @param {http.Agent} [options.agent] - HTTP Agent which is used for pooling sockets used in HTTP(s) client requests
 * @param {Boolean} [options.secure=false] - if true HTTPS will be used instead of HTTP
 * @param {Boolean} [options.bigint=false] - if true JSONbig serializer/deserializer will be used instead
 *                                    of JSON native serializer/deserializer
 * @param {Number} [ipVersion=4] - pass it to http/https lib's "family" option
 *
 * @return {Client}
 * @api private
 */

function Client(options){
  this.options = {
     host : options.host || '127.0.0.1',
     port : options.port || '8983',
     core : options.core || '',
     protocol : options.protocol || 'http',
     path : options.path || '/solr',
     agent : options.agent,
     secure : options.secure || false,
     solrVersion: options.solrVersion || Solr5_1,
     ipVersion: options.ipVersion == 6 ? 6 : 4
  };

  // Default paths of all request handlers
  // this.UPDATE_JSON_HANDLER = (version(this.options.solrVersion) >= Solr4_0) ? 'update' : 'update/json';
  this.UPDATE_JSON_HANDLER = 'update';
  this.UPDATE_HANDLER = 'update';
  this.SELECT_HANDLER = 'select';
  this.COLLECTIONS_HANDLER = 'admin/collections';
  this.ADMIN_PING_HANDLER = 'admin/ping';
  this.REAL_TIME_GET_HANDLER = 'get';
  this.SPELL_HANDLER = 'spell';
  this.TERMS_HANDLER = 'terms';
}

/**
 * Search documents matching the `query`
 *
 * @param {Query|Object|String} query
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.search = function(query,callback){
   return this.get(this.SELECT_HANDLER, query, callback);
}

/**
 * Create an instance of `Query`
 *
 * @return {Query}
 * @api public
 */

Client.prototype.query = function(){
  return new Query(this.options);
}

/**
 * Create an instance of `Query`
 * NOTE: This method will be deprecated in the v0.6 release. Please use `Client.query()` instead.
 *
 * @return {Query}
 * @api public
 */

Client.prototype.createQuery = function(){
  return new Query(this.options);
}

/**
 * Ping the Solr server
 *
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.ping = function(callback){
  return this.get(this.ADMIN_PING_HANDLER, callback);
}

Client.prototype.url = function(options) {
  return options.protocol + '://' + options.host + ':' + options.port + options.fullPath;
}

/**
 * Send an arbitrary HTTP GET request to Solr on the specified `handler` (as Solr like to call it i.e path)
 *
 * @param {String} handler
 * @param {Query|Object|String} [query]
 * @param {Function} callback(err,obj) - a function executed when the Solr server responds or an error occurs
 * @param {Error} callback().err
 * @param {Object} callback().obj - JSON response sent by the Solr server deserialized
 *
 * @return {http.ClientRequest}
 * @api public
 */

Client.prototype.get = function(handler, query, callback) {
  var parameters = '';
  if (typeof query === 'function') {
     callback = query;
  }
  else if ((query instanceof Query)) {
     parameters += query.build();
  }
  else if (typeof query === 'object') {
     parameters += stringify(query);
  }
  else if (typeof query === 'string') {
     parameters += query;
  }

  var pathArray = [this.options.path,this.options.core,handler + '?' + parameters + '&wt=json'];

  var fullPath = pathArray.filter(function(element){
                return element;
             }).join('/');

  var params = {
    host: this.options.host,
    port: this.options.port,
    fullPath: fullPath,
    protocol: this.options.protocol
  }

  console.log(this.url(params))

  axios.get(this.url(params))
    .then(callback)
    .catch((error) => {
      console.log('Error! Could not reach the API.')
      console.log(error)
    });
}

Client.prototype.getParameterByName = function (name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}