// Generated by CoffeeScript 1.4.0
var FORESEE_BASE_URL, HomePage, HostPage, TestFrames, navigation, remote, should, webdriver;

should = require("should");

webdriver = require("selenium-webdriver");

remote = require("selenium-webdriver/remote");

FORESEE_BASE_URL = "http://localhost:3001/";

/**
 * Page Objects
 * ============
 * Adapted from Java version
 * @see https://code.google.com/p/selenium/wiki/PageObjects
 *
 * Please note that
 * 1. element existence is checked when objects are created automatically
 */
HomePage = function(driver) {
  driver.getCurrentUrl().then(function(location) {
    return location.should.equal(FORESEE_BASE_URL);
  });
  return {
    title: driver.getTitle(),
    roomName: driver.findElement(webdriver.By.css("input#id[type='text']")),
    createRoom: driver.findElement(webdriver.By.css("button#createRoom")),
    typeRoomName: function(name) {
      return this.roomName.sendKeys(name);
    },
    clickCreateRoom: function() {
      this.createRoom.click();
      return HostPage(driver);
    },
    clickCreateRoomExpectingNothingHappens: function() {
      this.createRoom.click();
      return HomePage(driver);
    }
  };
};

HostPage = function(driver) {
  return {
    url: driver.getCurrentUrl(),
    title: driver.getTitle(),
    link: driver.findElement(webdriver.By.id("link")),
    storyDesc: driver.findElement(webdriver.By.css("input#storyDesc[type='text']")),
    addStory: driver.findElement(webdriver.By.css("button#addStory")),
    storyPile: driver.findElement(webdriver.By.css("ul#story-pile")),
    qrCodeImg: driver.findElement(webdriver.By.css("div#qrcode>img")),
    qrCode: driver.findElement(webdriver.By.css("div#qrcode")),
    startNow: driver.findElement(webdriver.By.css("input#startNow[type='button']")),
    typeStoryDesc: function(desc) {
      return this.storyDesc.sendKeys(desc);
    },
    clickAddStory: function() {
      return this.addStory.click();
    },
    findStoryPileOne: function() {
      return driver.findElement(webdriver.By.css("ul#story-pile>li"));
    }
  };
};

TestFrames = function(driver) {
  var client1, executeInFrame, hostFrame, navigateToUrl;
  hostFrame = driver.findElement(webdriver.By.id("host"));
  client1 = driver.findElement(webdriver.By.id("client1"));
  executeInFrame = function(frame, callBack) {
    driver.switchTo().frame(frame);
    callBack();
    return driver.switchTo().defaultContent();
  };
  navigateToUrl = function(frameId, url) {
    return driver.executeScript("document.getElementById('" + frameId + "').src = '" + url + "'");
  };
  driver.executeScript("document.getElementById('host').src = '" + FORESEE_BASE_URL + "'");
  return {
    hostFrame: hostFrame,
    client1: client1,
    executeInHostFrame: function(callBack) {
      return executeInFrame(hostFrame, callBack);
    },
    executeInClientOneFrame: function(callBack) {
      return executeInFrame(client1, callBack);
    },
    setClientOneUrl: function(url) {
      return navigateToUrl("client1", url);
    }
  };
};

navigation = function(driver) {
  return {
    toHomePage: function() {
      driver.get(FORESEE_BASE_URL);
      return HomePage(driver);
    },
    toHostPage: function(roomName) {
      driver.get(FORESEE_BASE_URL + "host/RoomName");
      return HostPage(driver);
    },
    toTestFrame: function() {
      driver.get(FORESEE_BASE_URL + "test/frames.html");
      return TestFrames(driver);
    }
  };
};

describe("Host Website", function() {
  var driver, nav, server;
  server = null;
  driver = null;
  nav = null;
  before(function() {
    process.env.PORT = 3001;
    require("../../app");
    server = new remote.SeleniumServer({
      jar: "test/webtest/selenium-server-standalone-2.31.0.jar",
      port: 4444
    });
    server.start();
    driver = new webdriver.Builder().usingServer(server.address()).withCapabilities({
      'browserName': 'firefox'
    }).build();
    return nav = navigation(driver);
  });
  after(function(done) {
    return driver.quit().then(function() {
      return done();
    });
  });
  describe("Home Page", function() {
    it('should have correct title', function(done) {
      var homePage;
      homePage = nav.toHomePage();
      return homePage.title.then(function(title) {
        title.should.equal("Foresee");
        return done();
      });
    });
    it('should have room name and can create when click start now', function(done) {
      var homePage, hostPage;
      homePage = nav.toHomePage();
      homePage.typeRoomName("RoomName");
      hostPage = homePage.clickCreateRoom();
      hostPage.url.then(function(location) {
        return location.should.equal(FORESEE_BASE_URL + 'host/RoomName');
      });
      return hostPage.title.then(function(title) {
        title.should.equal("Host - RoomName");
        return done();
      });
    });
    return it('should stay at the same page if no room name is entered', function(done) {
      var homePage;
      homePage = nav.toHomePage();
      homePage.typeRoomName("");
      homePage = homePage.clickCreateRoomExpectingNothingHappens();
      return homePage.title.then(function(title) {
        title.should.equal("Foresee");
        return done();
      });
    });
  });
  describe("Host Page", function() {
    it('should have input text and button for add new story.', function(done) {
      var hostPage;
      hostPage = nav.toHostPage("RoomName");
      return hostPage.addStory.then(function(element) {
        return done();
      });
    });
    it('should show story pile', function(done) {
      var hostPage;
      hostPage = nav.toHostPage("RoomName");
      return hostPage.storyPile.then(function(element) {
        return done();
      });
    });
    it('should generate a visible link', function(done) {
      var hostPage;
      hostPage = nav.toHostPage("RoomName");
      return hostPage.link.getText().then(function(text) {
        text.should.equal("" + FORESEE_BASE_URL + "join/RoomName");
        return done();
      });
    });
    it("should show QRCode for current room.", function(done) {
      var hostPage, hostUrl, joinUrl, testRoomName;
      testRoomName = "RoomName";
      hostUrl = "" + FORESEE_BASE_URL + "host/" + testRoomName;
      joinUrl = "" + FORESEE_BASE_URL + "join/" + testRoomName;
      hostPage = nav.toHostPage("RoomName");
      return hostPage.qrCode.then(function(qrCode) {
        return qrCode.getAttribute('title').then(function(val) {
          val.should.eql(joinUrl);
          return done();
        });
      });
    });
    it("should show 'Start Now' button as disabled", function(done) {
      var hostPage, hostUrl, testRoomName;
      testRoomName = "RoomName";
      hostUrl = "" + FORESEE_BASE_URL + "host/" + testRoomName;
      hostPage = nav.toHostPage(testRoomName);
      return hostPage.startNow.getAttribute('disabled').then(function(value) {
        value.should.eql("true");
        return done();
      });
    });
    it('should show new story in story pile when added and startNow is enabled', function(done) {
      var anyStoryDesc, hostPage;
      anyStoryDesc = 'new story description';
      hostPage = nav.toHostPage("RoomName");
      hostPage.typeStoryDesc(anyStoryDesc);
      hostPage.clickAddStory();
      driver.sleep(2000);
      hostPage.findStoryPileOne().getText().then(function(text) {
        return text.should.equal(anyStoryDesc);
      });
      return hostPage.startNow.getAttribute('disabled').then(function(value) {
        should.not.exist(value);
        return done();
      });
    });

    //This test is currently not necessary - as we have no way to remove
    //any stories yet.
    return it("'Start Now' button should disable when no story");
  });
  return describe("Client", function() {
    return it('should be able to join a room and their vote is displayed on host screen', function(done) {
      var frame;
      frame = nav.toTestFrame();
      frame.executeInHostFrame(function() {
        var homePage, hostPage;
        homePage = HomePage(driver);
        homePage.typeRoomName("RoomName");
        return hostPage = homePage.clickCreateRoom();
      });
      frame.setClientOneUrl(("" + FORESEE_BASE_URL + "join/") + "RoomName");
      driver.sleep(1000);
      return frame.executeInClientOneFrame(function() {
        var select;
        driver.findElement(webdriver.By.id("name")).sendKeys("UserName1");
        driver.findElement(webdriver.By.id("add")).click();
        driver.sleep(1000);
        select = driver.findElement(webdriver.By.id("vote"));
        select.findElement(webdriver.By.css("option[value='5']")).click();
        driver.sleep(1000);
        driver.findElement(webdriver.By.id("voteButton")).click();
        return driver.findElements(webdriver.By.css(".card_holder>.card")).then(function(elements) {
          elements.length.should.eql(1);
          return elements[0].getText().then(function(text) {
            text.should.eql("5");
            return done();
          });
        });
      });
    });
  });
});
