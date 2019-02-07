const conf = require('../../../nightwatch.conf.js');
const { appDir, appUrl, request } = require('hephaestus');
const { join } = require('path');
const testServerUrl = appUrl();
const httpServer = require('http-server');
const devServerRoot = join(appDir(), 'build');

const devServer = httpServer.createServer({
  root: devServerRoot,
  robots: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true'
  }
});

module.exports = {
  tags: ['rosie'],
  '@disabled': false,
  'Started': function (client) {
    console.log('[notice]: Test Suite - The Real Rosie the Riveter Project');
    console.log(`[notice]: Test server URL ${testServerUrl}`);
    devServer.listen(8080);
  },   
  'Homepage' : function (client) {    
    client
      .url(testServerUrl)
      .pause(1000);
    client.expect.element('body').to.be.present;
    client.expect.element('article').to.be.present;
    client.expect.element('iframe').to.be.present;
    client.expect.element('aside').to.be.present;
    client.end();
  },
  'About page' : function (client) {
    client
      .url(`${testServerUrl}/about`)
      .pause(1000);
    client.expect.element('body').to.be.present;
    client.assert.containsText('h1#page-title', 'About The Project');
    client.assert.containsText('.main-content p:first-child', 'During the World War II');
    client.end();
  },  
  'Related Resources page' : function (client) {
    client
      .url(`${testServerUrl}/related-resources`)
      .pause(1000);
    client.expect.element('body').to.be.present;
    client.assert.containsText('h1#page-title', 'Related Resources');
    client.expect.element('.field-items ul').to.be.present;
    client.end();
  },  
  'Interviews page' : function (client) {
    client
      .url(`${testServerUrl}/interviews`)
      .pause(1000);
    client.expect.element('body').to.be.present;
    client.end();
  },
  'Interviews page has 33 interviews' : function (client) {
    client
      .url(`${testServerUrl}/interviews`)    
    client.elements('css selector', 'ul.interview-list li', function (result) {
      return this.assert.ok(result.value.length === 33);
    });
    client.end();
  },

  'Individual interview pages' : function (client) {
    const request = require('request');
    let interviews = [
      {
        label: 'Jerre Kalbas',
        url: 'interviews/jerre-kalbas'
      },
      {
        label: 'Esther Horne',
        url: 'interviews/esther-horne'
      },
      {
        label: 'Violet Johnson',
        url: 'interviews/violet-johnson'
      },
      {
        label: 'Idilia Johnston',
        url: 'interviews/idilia-johnston'
      },
      {
        label: 'The Baltimore Rosies',
        url: 'interviews/baltimore-rosies'
      },
      {
        label: 'Susan Taylor King',
        url: 'interviews/susan-taylor-king'
      },
      {
        label: 'Bonnie Gifford',
        url: 'interviews/bonnie-gifford'
      },
      {
        label: 'The Robey Girls',
        url: 'interviews/robey-girls'
      },
      {
        label: 'Lucretia Jane Tucker',
        url: 'interviews/lucretia-jane-tucker'
      },
      {
        label: 'Signe Nakashima',
        url: 'interviews/signe-nakashima'
      },
      {
        label: 'Mary Anne Kniska Diamond',
        url: 'interviews/mary-anne-kniska-diamond'
      },
      {
        label: 'Mildred Crow Sargent',
        url: 'interviews/mildred-crow-sargent'
      },
      {
        label: 'Evelyn Davidson',
        url: 'interviews/evelyn-davidson'
      },
      {
        label: 'Dorice Dorine Hamilton',
        url: 'interviews/dorice-dorine-hamilton'
      },
      {
        label: 'The Carters',
        url: 'interviews/carters'
      },
      {
        label: 'Mazie Mullins',
        url: 'interviews/mazie-mullins'
      },
      {
        label: 'Idamae Mason',
        url: 'interviews/idamae-mason'
      },
      {
        label: 'The Powells',
        url: 'interviews/powells'
      },
      {
        label: 'The Mathauser Twins',
        url: 'interviews/mathauser-twins'
      },
      {
        label: 'Arkie Huffman',
        url: 'interviews/arkie-huffman'
      },
      {
        label: 'Shirley Clark',
        url: 'interviews/shirley-clark'
      },
      {
        label: 'Edith Lyons',
        url: 'interviews/edith-lyons'
      },
      {
        label: 'Frances Ellis',
        url: 'interviews/frances-ellis'
      },
      {
        label: 'Arlene Crary',
        url: 'interviews/arlene-crary'
      },
      {
        label: 'Catherine Gaultier',
        url: 'interviews/catherine-gaultier'
      },
      {
        label: 'Eileen Tench',
        url: 'interviews/eileen-tench'
      },
      {
        label: 'Mabel Myrick',
        url: 'interviews/mabel-myrick'
      },
      {
        label: 'Nell Young',
        url: 'interviews/nell-young'
      },
      {
        label: 'Winona Gillespie',
        url: 'interviews/winona-gillespie'
      },
      {
        label: 'Thelma Edgar',
        url: 'interviews/thelma-edgar'
      },
      {
        label: 'Marion Yagoda',
        url: 'interviews/marion-yagoda'
      },
      {
        label: 'Angeline Featherstone Fleming',
        url: 'interviews/angeline-featherstone-fleming'
      },
      {
        label: 'Eva Chenevert',
        url: 'interviews/eva-chenevert'
      }
    ];

    for (let interview of interviews) {
      client
        .url(`${testServerUrl}/${interview.url}`)
        .pause(1000);
      client.expect.element('body').to.be.present;
      client.assert.containsText('h1.title', interview.label);
      client.elements('css selector', '.field-name-field-transcript a', result => {
        result.value.map(node => {
          client.elementIdAttribute(node.ELEMENT, 'href', link => {
            request(link.value, (error, response) => {
              client.assert.equal(response.statusCode, 200, `Transcript ${link.value} available.`);
            });
          });
        });
      });
    }    
    client.end();
  },

  'Finished': function (client) {
    devServer.close();
  }

};
