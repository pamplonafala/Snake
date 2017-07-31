var levelStart = 1;

var prop = 4+levelStart;
var spd = levelStart;





var Timer = function(mult) {
    this.mult = mult;
    this.limit = 60;
    this.frame = 0;
    this.ticks = 0;
    this.stopped = false;
};
Timer.prototype.tick = function() {
    this.multiplier = this.mult;
    if (this.frame > this.limit/this.multiplier && !this.stopped) {
        this.frame = 0;
        this.ticks++;
        return true;
    } else {
        this.frame++;
        return false;
    }
};
Timer.prototype.stop = function() {
    this.stopped = true;
};
Timer.prototype.start = function() {
    this.stopped = false;
};
Timer.prototype.updateMult = function(mult) {
    this.mult = mult;
};
var T = new Timer(1);
var countdowntimer = new Timer(1);





var Snake = function(s, x, y, skin) {
    this.prop = prop;
    this.w = width/this.prop;
    this.h = height/this.prop;
    this.x = x === undefined? Math.floor(Math.random() * this.prop):x;
    this.y = y === undefined? Math.floor(Math.random() * this.prop):y;
    this.xPos = x || this.x;
    this.yPos = y || this.y;
    this.startSize = s;
    this.size = s-1; 
    this.freeze = 3;
    
    this.color = color(70, 170, 70);
    this.color2 = color(red(this.color) -30, green(this.color) - 30, blue(this.color) - 30);
    
    this.d = x === undefined && y === undefined? Math.floor(Math.random() * 4):0;
    switch(this.d) {
        case 0:
        this.direction = 'right';
        this.lastDirection = 'right';
        break;
        
        case 1:
        this.direction = 'down';
        this.lastDirection = 'down';
        break;
        
        case 2:
        this.direction = 'left';
        this.lastDirection = 'left';
        break;
        case 3:
        this.direction = 'up';
        this.lastDirection = 'up';
        break;
    }
    
    this.bodyX = [];
    this.bodyY = [];
    this.bodyD = [];
    for (var i = 0; i < this.size; i++) {
        this.bodyX.push(this.x);
        this.bodyY.push(this.y);
        this.bodyD.push(this.lastDirection);
    }
    
    this.skin = skin || function(){};
    this.invincible = false;
    this.tvalue = 0;
    this.fat = 20;
};
var snktimer = new Timer(spd);
Snake.prototype.relativeX = function(value) {
    return value*width/this.prop + width/this.prop/2;
};
Snake.prototype.relativeY = function(value) {
    return value*height/this.prop + height/this.prop/2;
};

Snake.prototype.isSafe = function() {
    var safe = true;
    for (var i = 0; i < this.size-1; i++) {
        if (this.x === this.bodyX[i] && this.y === this.bodyY[i]) {
            safe = false;
        }
    }
    if (!this.invincible) {
        return safe;
    } else {
        return true; 
    }
};
Snake.prototype.eat = function() {
    this.size++;
    this.bodyX.push(this.x);
    this.bodyY.push(this.y);
    this.bodyD.push(this.lastDirection);
};
Snake.prototype.move = function() {
    var rand = (Math.floor(Math.random() * (8 - 5)) + 5);
    this.tmoved = snktimer.ticks % rand === 0? false:true;
    if (this.isSafe() || snktimer.ticks <= 1) {
        this.lastDirection = this.direction;
        this.bodyX.push(this.x);
        this.bodyY.push(this.y);
        this.bodyD.push(this.lastDirection);
        this.bodyX.shift();
        this.bodyY.shift();
        this.bodyD.shift();
        switch (this.direction) {
            case 'left':
                if (this.x-1 >= 0) {
                    this.x--;
                } else {
                    this.x = this.prop-1;
                }
            break;
            
            case 'up':
                if (this.y-1 >= 0) {
                    this.y--;
                } else {
                    this.y = this.prop-1;
                }
            break;
            
            case 'right':
                if (this.x < this.prop-1) {
                    this.x++;
                } else {
                    this.x = 0;
                }
            break;
            
            case 'down':
                if (this.y < this.prop-1) {
                    this.y++;
                } else {
                    this.y = 0;
                }
            break;
        }
    } else {
        this.reset(true);
    }
};
Snake.prototype.moveTongue = function() {
    if (this.tmoved) {
        if (this.tvalue > -this.w/3*2) {
            this.tvalue-=this.w/20;
        }
    } else {
        if (this.tvalue < 0) {
            this.tvalue+=this.w/20;
        } else {
            this.tmoved = true;
        }
    }
};

Snake.prototype.body = function() {
    for (var i = 0; i < this.size; i++) {
        var x = this.relativeX(this.bodyX[i]), 
            y = this.relativeY(this.bodyY[i]);
        var a;
        switch (this.bodyD[i]) {
            case 'left':
                a = 180;
            break;
            
            case 'up':
                a = 270;
            break;
            
            case 'right':
                a = 0;
            break;
            
            case 'down':
                a = 90;
            break;
        }
        
        pushMatrix();
        translate(x, y);
        
        noStroke();
        fill(this.color);
        ellipse(0, 0, this.w/1.2, this.h/1.2);
        fill(this.color);
        ellipse(0, 0, this.w/1.4, this.h/1.4);
        fill(this.color2);
        ellipse(-this.w/30, 0, this.w/1.3, this.h/1.3);
        fill(this.color);
        ellipse(this.w/30, 0, this.w/1.4, this.h/1.3);
        
        rotate(a);
        /*if (this.bodyX[i-1] !== this.bodyX[i+1] && 
            this.bodyY[i-1] !== this.bodyY[i+1] && 
            i !== 0 && i !== this.size-1) {
            
            fill(this.color2);
            rect(this.w/10, -this.h/10, this.w/2, this.h/10, 100);
            rect(-this.w/10, this.h/10, this.w/10, this.h/2, 100);
            rect(this.w/10, this.h/5, this.w/10, this.h/4, 100);
            rect(this.w/5, this.h/10, this.w/4, this.h/10, 100);
        } else {
            fill(this.color2);
            rect(0, -this.h/10, this.w/1.25, this.h/10, 100);
            rect(0, this.h/10, this.w/1.25, this.h/10, 100);
        }*/
        this.skin();
        popMatrix();
    }
};
Snake.prototype.head = function() {
    var x = this.relativeX(this.x), 
        y = this.relativeY(this.y);
    var a;
    switch (this.lastDirection) {
        case 'left':
            a = 180;
        break;
        
        case 'up':
            a = 270;
        break;
        
        case 'right':
            a = 0;
        break;
        
        case 'down':
            a = 90;
        break;
    }

    pushMatrix();
    translate(x, y);
    
    fill(this.color);
    ellipse(0, 0, this.w, this.h);
    fill(this.color2);
    ellipse(-this.w/30, 0, this.w, this.h);
    fill(this.color);
    ellipse(this.w/30, 0, this.w, this.h);
    rotate(a);
    
    
    popMatrix();
};
Snake.prototype.face = function() {
    var x = this.relativeX(this.x), y = this.relativeY(this.y);
    switch (this.lastDirection) {
        case 'left':
            this.rotation = 180;
        break;
        
        case 'up':
            this.rotation = 270;
        break;
        
        case 'right':
            this.rotation = 0;
        break;
        
        case 'down':
            this.rotation = 90;
        break;
    }
    
    pushMatrix();
    translate(x, y);
    rotate(this.rotation);
    ellipse(this.w/5, this.h/5, this.w/5, this.h/5);
    ellipse(this.w/5, -this.h/5, this.w/5, this.h/5);
    popMatrix();

};
Snake.prototype.tongue = function() {
    var x = this.relativeX(this.x), y = this.relativeY(this.y);
    var a = 70;
    
    switch (this.lastDirection) {
        case 'left':
            this.rotation = 180;
        break;
        
        case 'up':
            this.rotation = 270;
        break;
        
        case 'right':
            this.rotation = 0;
        break;
        
        case 'down':
            this.rotation = 90;
        break;
    }
    
    pushMatrix();
    translate(x, y);
    rotate(this.rotation);
    rect(this.w/(this.fat)*(this.fat-1)/1.5+this.tvalue, 0, 
         this.w/(this.fat)*(this.fat-1)/3, this.h/10, 20);
    popMatrix();
    
    pushMatrix();
    translate(x, y);
    rotate(this.rotation);
    translate(this.w/(this.fat)*(this.fat-1)/4*3+this.tvalue, 0);
    rotate(a);
    rect(0, 0-this.h/3/2, this.w/10, this.h/3, 20);
    popMatrix();
    
    pushMatrix();
    translate(x, y);
    rotate(this.rotation);
    translate(this.w/(this.fat)*(this.fat-1)/4*3+this.tvalue, 0);
    rotate(-a);
    rect(0, 0+this.h/3/2, this.w/10, this.h/3, 20);
    popMatrix();
};
Snake.prototype.draw = function() {
    this.prop = prop;
    this.w = width/this.prop;
    this.h = height/this.prop;
    
    this.moveTongue(3);
    rectMode(CENTER);
    noStroke();
    
    fill(this.color);
    this.body();
    
    fill(255, 55, 55);
    this.tongue();
    
    fill(this.color);
    this.head();
    
    fill(0);
    this.face();
};

Snake.prototype.start = function() {
    if (countdowntimer.ticks > this.freeze) {
        if(snktimer.tick()){
            this.move();
        }
    }
};
Snake.prototype.reset = function(all) {
    if (all) {
        this.x = this.xPos+1;
        this.y = this.yPos;
        this.direction = 'right';
        this.lastDirection = 'right';
    }
    this.size = this.startSize-1;
    this.bodyX = [];
    this.bodyY = [];
    this.bodyD = [];
    for (var i = 0; i < this.size; i++) {
        this.bodyX[i] = -10;
        this.bodyY[i] = -10;
        this.bodyD[i] = this.lastDirection;
    }
};
var skinArrow = function() {
    fill(this.color2);
    rect(-this.w/10, 0, this.w/5, this.h/10);
    triangle(0, -this.h/7, 0, this.h/7, this.w/5, 0);
};
var skinFish = function() {
    ellipse(0, 0, this.w/1.1, this.h/1.1);
    var w = this.w/5;
    var h = this.h/5;
    var c1 = this.color;
    var c2 = this.color2;
    var flake = function(x, y) {
        pushMatrix();
        translate(x, y);
        fill(c2);
        ellipse(0, 0, w, h);
        fill(c1);
        ellipse(w/5, 0, w, h);
        popMatrix();
    };

    flake(-w*1.5, 0);
    
    flake(-w*1.4, -h/2);
    flake(-w*1.4, h/2);
    
    flake(-w, -h);
    flake(-w, 0);
    flake(-w, h);
    
    flake(-w/2, -h*1.5);
    flake(-w/2, h*1.5);
    flake(-w/2, -h/2);
    flake(-w/2, h/2);
    
    flake(0, -h);
    flake(0, 0);
    flake(0, h);

    flake(w/2, -h*1.5);
    flake(w/2, h*1.5);
    flake(w/2, -h/2);
    flake(w/2, h/2);
    
    flake(w, -h);
    flake(w, 0);
    flake(w, h);
    
    flake(w*1.4, -h/2);
    flake(w*1.4, h/2);
    
    //flake(w*1.5, 0);

};
var snk = new Snake(5, 0, 0, skinArrow);




var Apple = function() {
    this.prop = prop;
    this.x = Math.floor(Math.random() * this.prop);
    this.y = Math.floor(Math.random() * this.prop);
    this.size = 20;
};
Apple.prototype.nextApple = function() {
    this.xPos = Math.floor(Math.random() * this.prop);
    this.yPos = Math.floor(Math.random() * this.prop);
};
Apple.prototype.spawn = function() {
    if (snk.x === this.x && snk.y === this.y) {
        snk.eat();
        this.nextApple();
        for (var i = 0; i < snk.size; i++) {
            while (this.xPos === snk.bodyX[i] && this.yPos === snk.bodyY[i]) {
                this.nextApple();
            }
        }
        this.x = this.xPos;
        this.y = this.yPos;
    }
};
Apple.prototype.draw = function() {
    this.prop = prop;
    this.w = width/this.prop;
    this.h = height/this.prop;
    var eq = 1.65;
    noStroke();
    
    //shadow
    fill(185, 0, 0);
    ellipse(this.x*this.w   +this.w/eq*(eq-1), 
            this.y*this.h   +this.h/2, 
            this.w/1.8, 
            this.h/1.5);
            
    ellipse(this.x*this.w   +this.w/eq, 
            this.y*this.h   +this.h/2, 
            this.w/1.8, 
            this.h/1.5);
    
    //stalk
    pushMatrix();
    translate(this.x*this.w +this.w/1.9, this.y*this.h +this.h/6);
    rotate(-15);
    fill(80, 240, 40);
    rect(-this.w/50, -this.h/100, this.w/20, this.h/3);
    fill(40, 120, 20);
    rect(-this.w/50, 0, this.w/20, this.h/3);
    fill(80, 240, 40);
    rect(0, 0, this.w/20, this.h/3);
    popMatrix();
    
    //apple
    fill(250, 0, 0);
    ellipse(this.x*this.w   +this.w/eq*(eq-1)   +this.w/30, 
            this.y*this.h   +this.h/2, 
            this.w/2, 
            this.h/1.5);
    ellipse(this.x*this.w   +this.w/eq          +this.w/30, 
            this.y*this.h   +this.h/2, 
            this.w/2, 
            this.h/1.5);
    
    //leave
    pushMatrix();
    translate(this.x*this.w +this.w/2, this.y*this.h +this.h/6);
    rotate(-15);
    fill(40, 120, 20);
    ellipse(-this.w/11, -this.h/9, this.w/7, this.h/13);
    fill(80, 240, 40);
    ellipse(-this.w/15, -this.h/10.5, this.w/6, this.h/11);
    popMatrix();

    
    //light
    fill(250, 80, 80);
    ellipse(this.x*this.w   +this.w/eq, 
            this.y*this.h   +this.h/2, 
            this.w/2.2, 
            this.h/1.8);

    fill(250, 0, 0);
    ellipse(this.x*this.w   +this.w/eq   -this.w/15, 
            this.y*this.h   +this.h/2           +this.h/50, 
            this.w/2, 
            this.h/1.8);
            
};
var apple = new Apple();





var Level = function() {
    this.x = width/2;
    this.y = height-height/9;
    this.w = width/1.3;
    this.h = this.w/5;
};
Level.prototype.xp = function() {
    noStroke();
    this.limit = Math.ceil(prop*prop/3)-snk.startSize+1;
    this.value = snk.size+1 - snk.startSize;
    var c1 = color(44, 50, 51);
    var c2 = color(76, 81, 82);
    var c3 = color(119, 131, 133);
    
    fill(c1);
    var h = this.h;
    arc(this.x, this.y, this.w/0.9, this.h*5.5, -180, 0.5);
    rect(this.x, this.y + this.h/1.9, this.w/0.899, this.h);
    
    fill(c2);
    arc(this.x, this.y, this.w/0.95, this.h*5.3, -180, 0.5);
    
    fill(c1);
    arc(this.x, this.y, this.w, this.h*5, -180, 1);
    
    fill(c3);
    arc(this.x, this.y, this.w, this.h*5, -180, this.value*180/this.limit-180);
    
    fill(c2);
    arc(this.x, this.y, this.w/1.2, this.h*4.1, -180, 0.5);
    rect(this.x, this.y + this.h/2-0.5, this.w/0.95, this.h);

    fill(c1);
    rect(this.x, this.y, this.w/2.2, this.h*1.2, 20);
    
    fill(c3);
    rect(this.x, this.y, this.w/2.5+1, this.h, 20);
};
Level.prototype.draw = function() {
    this.xp();
    fill(0);
    textSize(height/prop);
    text(this.value + '/' + this.limit, this.x, this.y);
};
var level = new Level();





var countdown = function() {
    if (snk.freeze-countdowntimer.ticks >= 0) {
        var t = snk.freeze-countdowntimer.ticks;
        textAlign(CENTER, CENTER);
        textSize(height/2);
        
        fill(0);
        text(t, width/1.95, height/2);
        text(t, width/1.95, height/1.95);
        text(t, width/2, height/1.95);
        text(t, width/2.05, height/1.95);
        text(t, width/2.05, height/2);
        text(t, width/2.05, height/2.05);
        text(t, width/2, height/2.05);
        text(t, width/1.95, height/2.05);
        
        fill(150, 100, 150);
        text(t, width/2, height/2);
    } else {
        countdowntimer.stop();
    }
};
var levelUp = function() {
    prop++;
    spd++;
    snk.reset();
    snktimer.updateMult(spd);
};
var startOnLevel = function(level) {
    for (var i = 0; i < level; i++) {
        levelUp();
    }
};

keyPressed = function() {
    switch (keyCode) {
        case 37:
            if (snk.lastDirection !== 'right') {
                snk.direction = 'left';
            }
        break;
        case 38:
            if (snk.lastDirection !== 'down') {
                snk.direction = 'up';
            }
        break;
        case 39:
            if (snk.lastDirection !== 'left') {
                snk.direction = 'right';
            }
        break;
        case 40:
            if (snk.lastDirection !== 'up') {
                snk.direction = 'down';
            }
        break;
        case 32:
            snk.eat();
        break;
    }
};
draw = function() {
    background(240, 220, 180);
    T.tick();
    countdowntimer.tick();
    
    level.draw();
    
    snk.draw();
    snk.start();
    
    apple.draw();
    apple.spawn();
    
    countdown();
    
    if (level.value >= level.limit) {
        levelUp();
    }
};

