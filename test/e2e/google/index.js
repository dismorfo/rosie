module.exports = {
  tags: ['google'],
  '@disabled': false,

  'Demo test Google 1' : function (client) {
    client
      .url('https://www.google.com/')
      .pause(1000);

    client.expect.element('body').to.be.present;

    client.end();
    
  },

  'Demo test Google 2': function (client) {
    client
      .url('https://www.google.com/')
      .waitForElementVisible('body')
      .assert.elementPresent('body')
      .assert.title("Google")
      .end();
    }
  
};
