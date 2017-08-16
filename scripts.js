var c = createjs,
   stage, preload, container, giftContainer, goTxt, w, h, deltaS, score = 0,
   curEvent = true,
   sResult, lgap = 40,
   fgap = 15,
   count = 0,
   game = 'paused',
   flyFlag = false,
   life = 4;
var sky, grnd, little, hill1, hill2, hill3, hill1a, hill2a, hill3a, fire, hurdles, sFlag, sHeart, gift, gift1, gift2, gift3, gift4, gift5, lifeTxt, ranGiftsArr = [];
var deltaSP = 300,
   sp = {5: 400, 10: 500, 15: 600, 20: 700, 25: 800, 30: 900, 40: 1000};

var assets = [
  {src: 'sky.png', id: 'sky'},
  {src: 'ground.png', id: 'grnd'},
  {src: 'charac.png', id: 'little'},
  {src: 'hills.png', id: 'hills'},
  {src: 'firengift.png', id: 'fireNgift'},
  {src: "button.png", id: 'btn'},
  {src: "buttonO.png", id: 'btnO'},
  {src: "flag.png", id: 'flag'},
  {src: "heart.png", id: 'heart'}
];

function init() {
   stage = new c.Stage('canvas');
   container = new c.Container();
   giftContainer = new c.Container();
   w = stage.canvas.width;
   h = stage.canvas.height;
   c.Touch.enable(stage);
   preload = new c.LoadQueue(false);
   preload.on('complete', launchGame);
   preload.loadManifest(assets, true, 'img/');
}//init

function launchGame() {
   var skyImg = new c.Shape();
   skyImg.graphics.beginBitmapFill(preload.getResult('sky')).drawRect(0, 0, w, h);

   goTxt = new c.Text('GO', '40px Arial', '#f8a727');
   var bounds = goTxt.getBounds();
   goTxt.x = 0; //(510 - bounds.width) / 2;
   goTxt.y = 680;

   c.Tween.get(goTxt, { loop: true }).to({ x: (510 - bounds.width) / 2, alpha: 1 }, 200).wait(2000).to({ x: bounds.width + 510, alpha: 0 }, 200);

   stage.addChild(skyImg, goTxt);

   c.Ticker.setFPS(29);
   c.Ticker.on('tick', handleTick);

   skyImg.on('click', function() {
      stage.removeChild(skyImg, goTxt);
      startGame();
   });
}//launchGame

function handleTick(e) {
   deltaS = e.delta / 1000;
   deltaSP = sp[score] ? sp[score] : deltaSP;

   if (!c.Ticker.paused) {
      if (game === 'started') {
         loopElements();
      }
      stage.update();
   }
}//handleTick

function startGame(e) {
   sky = new c.Shape();
   sky.graphics.beginBitmapFill(preload.getResult('sky')).drawRect(0, 0, w, h);

   var grndImg = preload.getResult('grnd');
   grnd = new c.Shape();
   grnd.graphics.beginBitmapFill(grndImg).drawRect(0, 0, w + grndImg.width, grndImg.height);
   grnd.tileW = grndImg.width;
   grnd.y = h - (grndImg.height + 100);

   //===== Character =====//
   var lttlSS = new c.SpriteSheet({
      framerate: 30,
      'images': [preload.getResult('little')],
      'frames': {
         "regX": 0,
         "height": 292,
         "count": 73,
         "regY": 0,
         "width": 165
      },
      'animations': {
         'run': [0, 25, 'run'],
         'up': [26, 31, 'jump', 2],
         'jump': [32, 53, 'down'],
         'down': [54, 63, 'run']
      }
   });

   little = new c.Sprite(lttlSS, 'run');
   little.y = 320;
   little.x = 50;

   //===== Backgrounds =====//
   var ssHills = new c.SpriteSheet({
      'images': [preload.getResult('hills')],
      'frames': {
         width: 700,
         height: 242,
         regX: 0,
         regY: 0
      }
   });
   //Clouds
   hill1 = new c.Sprite(ssHills);
   hill1.gotoAndStop(0);
   hill1a = new c.Sprite(ssHills);
   hill1a.gotoAndStop(0);
   hill1.scaleY = 1.5;
   hill1a.scaleY = 1.5;
   hill1.y = hill1a.y = 130;
   //CityScape
   hill2 = new c.Sprite(ssHills);
   hill2.gotoAndStop(2);
   hill2a = new c.Sprite(ssHills);
   hill2a.gotoAndStop(2);
   hill2.scaleY = 1.3;
   hill2a.scaleY = 1.3;
   hill2.y = hill2a.y = 280;
   //Landscape
   hill3 = new c.Sprite(ssHills);
   hill3.gotoAndStop(1);
   hill3a = new c.Sprite(ssHills);
   hill3a.gotoAndStop(1);
   hill3.scaleY = 1.3;
   hill3a.scaleY = 1.3;
   hill3.y = hill3a.y = 300;

   hill1.x = hill2.x = hill3.x = 0;
   hill1a.x = hill2a.x = hill3a.x = 700;

   //===== Fire =====//
   var ssFire = new c.SpriteSheet({
      'images': [preload.getResult('fireNgift')],
      'frames': {
         width: 50,
         height: 50,
         regX: 0,
         regY: 0
      },
      'animations': {
         'fire': [0, 4, 'fire']
      }
   });
   fire = new c.Sprite(ssFire, 'fire');
   fire.scaleX = 1.5;
   fire.scaleY = 1.5;
   fire.y = 540;
   fire.x = ranMath(400, w + 1000);

   //===== Hurdles =====//
   hurdles = new c.Sprite(ssFire);

   //===== Gifts =====//
   gift1 = new c.Sprite(ssFire);
   gift1.gotoAndStop(5);
   gift2 = new c.Sprite(ssFire);
   gift2.gotoAndStop(6);
   gift3 = new c.Sprite(ssFire);
   gift3.gotoAndStop(7);
   gift4 = new c.Sprite(ssFire);
   gift4.gotoAndStop(8);
   gift5 = new c.Sprite(ssFire);
   gift5.gotoAndStop(9);
   gift1.y = gift2.y = gift3.y = gift4.y = gift5.y = -60;

   //===== Score Board =====//
   sResult = new c.Text('Score: ' + score, '15px Arial', '#555');
   sResult.x = 30;
   sResult.y = 30;
   sResult.textBaseline = "alphabetic";

   //===== Flag =====//
   var ssFlag = new c.SpriteSheet({
      'images': [preload.getResult('flag')],
      'frames': {
         width: 100,
         height: 93,
         regX: 0,
         regY: 0
      },
      'animations': {
         'fly': [0, 5, 'fly']
      }
   });
   sFlag = new c.Sprite(ssFlag, 'fly');
   sFlag.x = 700;
   sFlag.y = 520;

   //===== Life N Heart =====//
   var ssHeart = new c.SpriteSheet({
      'images': [preload.getResult('heart')],
      'frames': {
         width: 100,
         height: 84,
         regX: 50,
         regY: 42
      }
   });

   life--;

   sHeart = new c.Sprite(ssHeart);
   sHeart.scaleX = 0.3;
   sHeart.scaleY = 0.3;
   sHeart.x = 461;
   sHeart.y = 22;
   sHeart.gotoAndStop(life - 1);
   sHeart.canHit = true;

   lifeTxt = new c.Text(life, '15px Arial', '#555');
   lifeTxt.x = 480;
   lifeTxt.y = 13;

   container.removeAllChildren();
   container.addChild(sky, hill1, hill1a, hill2, hill2a, hill3, hill3a, hurdles, sFlag, grnd, little, fire, sResult, sHeart, lifeTxt);
   stage.removeAllChildren();
   stage.addChild(container);
   game = 'started';

   c.Tween.get(sHeart).to({ scaleX: 0.5, scaleY: 0.5 }, 400).to({ scaleX: 0.3, scaleY: 0.3 }, 400);

   loopElements();
   crHurdles();

   stage.on('mousedown', startJump);
}//startGame

function startJump(e){e.remove(); curEvent = false; little.gotoAndPlay('jump');}

function updateScore(e) {
   if (e._target.count != 'counted') {
      e._target.count = 'counted';
      e._target.x = -150;
      score += 1;
      sResult.set({
         text: 'Score: ' + score
      });
      if (sp[score]) {
         flyFlag = true;
      }
   }
}//updateScore

function ranGift() {
   var ranGifts = ranMath(4, 1);
   giftContainer.removeAllChildren();
   var gifts = [gift1, gift2, gift3, gift4, gift5];
   for (var i = 0; i < ranGifts; i++) {
      gift = gifts.splice(ranMath(gifts.length, 0), 1)[0];
      gift.scaleX = 1.2;
      gift.scaleY = 1.2;
      gift.x = w + (i * 100);
      gift.y = little.y - ranMath(20, 5);
      ranGiftsArr.push(gift);
      gift.count = count;
      giftContainer.addChild(gift);
      count++;
   }
   stage.addChild(giftContainer);
}//ranGift

function loopElements(e) {
   c.Ticker.paused = false;
   if(curEvent === false && little.currentAnimation !== 'jump'){
     stage.on('mousedown', startJump);
     curEvent = true;
   }
   var littleX = little.x;
   var littleW = little.getBounds().width * little.scaleX;
   var fireW = fire.getBounds().width * fire.scaleX;
   var startHit = littleX + lgap - fireW + fgap;
   var endHit = littleX + littleW - lgap;

   if (game == 'started') {
      hill1.x = hill1.x - deltaS * (deltaSP - 250);
      hill1a.x = hill1a.x - deltaS * (deltaSP - 250);
      if (hill1.x <= -800) {hill1.x = hill1a.x + 700;}
      if (hill1a.x <= -800) {hill1a.x = hill1.x + 700;}

      hill2.x = hill2.x - deltaS * (deltaSP - 200);
      hill2a.x = hill2a.x - deltaS * (deltaSP - 200);
      if (hill2.x <= -800) {hill2.x = hill2a.x + 700;}
      if (hill2a.x <= -800) {hill2a.x = hill2.x + 700;}

      hill3.x = hill3.x - deltaS * (deltaSP - 150);
      hill3a.x = hill3a.x - deltaS * (deltaSP - 150);
      if (hill3.x <= -800) {hill3.x = hill3a.x + 700;}
      if (hill3a.x <= -800) {hill3a.x = hill3.x + 700;}

      fire.x = fire.x - deltaS * deltaSP;
      if (fire.x <= -60) {fire.x = ranMath(1000, w);}

      grnd.x = (grnd.x - deltaS * deltaSP) % grnd.tileW;

      hurdles.x = hurdles.x - deltaS * deltaSP;
      if (hurdles.x <= -600) {crHurdles();}

      if (sFlag.x < 700 && sFlag.x > -600) {sFlag.x = sFlag.x - deltaS * (deltaSP - 150);}

      if ((fire.x > startHit) && (fire.x < endHit) && (little.currentAnimation !== 'jump')) {
         game = 'paused';
         little.stop();
         c.Tween.get(little).to({ alpha: 0 }, 300).call(lifeCheck);
      }

      giftsIni(startHit, endHit);

      if (flyFlag) {sFlag.x = 690; flyFlag = false;}
   }//if (game == 'started')
}//loopElements

function lifeCheck() {
   c.Ticker.paused = true;
   if (life > 1 && sHeart.currentFrame == life - 1 && sHeart.canHit === true) {
      sHeart.canHit = false;
      stage.removeAllChildren();
      startGame();
   } else if (life == 1) {
      gameOver();
   }
}//lifeCheck

function crHurdles() {
   hurdles.gotoAndStop(ranMath(4, 10));
   hurdles.scaleX = 1.2;
   hurdles.scaleY = 1.2;
   hurdles.y = 550;
   hurdles.x = ranMath(1000, 800);
}//crHurdles

function giftsIni(startHit, endHit) {
   if (gift1.y == -60 && gift2.y == -60 && gift3.y == -60 && gift4.y == -60 && gift5.y == -60) {
      stage.removeChild(giftContainer);
      ranGiftsArr = [];
      ranGift();
   } else {
      var ranGiftsArrL = ranGiftsArr.length;
      for (var i = 0; i < ranGiftsArrL; i++) {
         if (ranGiftsArr[i].x <= -70 && ranGiftsArr[i].y > -60) {
            ranGiftsArr[i].x = -60;
            ranGiftsArr[i].y = -60;
         } else {
            if (ranGiftsArr[i].x > startHit && ranGiftsArr[i].x < endHit && little.currentAnimation === 'jump') { c.Tween.get(ranGiftsArr[i]).to({ y: -50 }, 300).call(updateScore); }
            ranGiftsArr[i].x = ranGiftsArr[i].x - deltaS * 200;
         }//if-else
      }//for loop
   }//if-else
}//giftsIni

function gameOver() {
   stage.off('mousedown');
   game = 'Over';
   c.Ticker.paused = true;

   var box = new c.Shape();
   box.graphics.beginFill('#000').drawRect(0, 0, 510, 800);
   box.x = 0;
   box.y = 0;

   var btnOcon = new c.Container();
   var btnO = new c.Bitmap(preload.getResult('btnO'));
   var txtO = new c.Text('OUT', 'bold 28px Arial', '#fff');
   var bounds = txtO.getBounds();
   txtO.x = (btnO.image.width - bounds.width) / 2;
   txtO.y = (btnO.image.height - bounds.height - 3) / 2;

   btnOcon.addChild(btnO, txtO);
   btnOcon.x = (510 - btnO.image.width) / 2;
   btnOcon.y = 0 - btnO.image.height;

   c.Tween.get(btnOcon).to({ y: 270 }, 500, c.Ease.bounceOut);

   var btnRcon = new c.Container();
   var btnR = new c.Bitmap(preload.getResult('btn'));
   var txtR = new c.Text('RETRY', '18px Arial', '#fff');
   bounds = txtR.getBounds();
   txtR.x = (btnR.image.width - bounds.width) / 2;
   txtR.y = (btnR.image.height - bounds.height - 3) / 2;

   btnRcon.addChild(btnR, txtR);
   btnRcon.x = 0 - btnR.image.width;
   btnRcon.y = 420;

   c.Tween.get(btnRcon).to({ x: 50 }, 500, c.Ease.bounceOut);

   var btnPcon = new c.Container();
   var btnP = new c.Bitmap(preload.getResult('btn'));
   btnP.regX = btnP.image.width;
   btnP.scaleX = -1;
   var txtP = new c.Text('POST SCORE', '18px Arial', '#fff');
   bounds = txtP.getBounds();
   txtP.x = (btnP.image.width - bounds.width) / 2;
   txtP.y = (btnP.image.height - bounds.height - 3) / 2;

   btnPcon.addChild(btnP, txtP);
   btnPcon.x = 510 + btnP.image.width;
   btnPcon.y = 420;

   c.Tween.get(btnPcon).to({ x: 460 - btnP.image.width }, 500, c.Ease.bounceOut);

   var result = new c.Text('Your Score is ' + score, '20px Arial', '#ffffff');
   bounds = result.getBounds();
   result.x = (510 - bounds.width) / 2;
   result.y = 360;

   btnRcon.on('click', restartGame);
   btnPcon.on('click', postScore);

   stage.removeAllChildren();
   container.removeAllChildren();
   container.addChild(box, btnOcon, btnRcon, btnPcon, result);
   stage.addChild(container);
   c.Ticker.paused = false;
}//gameOver

function postScore() {
   var sendData = {
      "d": {
         "e": "games",
         "s": score.toString(),
         "n": "new1"
      }
   };
   console.log(sendData);
   alert('Thanks for played, This is a demo, will not post any Score!')
   //window.location.replace('https://littleapp.in/pushData.html?d='+JSON.stringify(sendData));
}

function restartGame(){window.location.reload();}

function ranMath(mul, plus){return Math.floor(Math.random() * mul + plus);}
