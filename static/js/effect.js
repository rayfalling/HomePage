if (document.getElementById("container")) {
    function Particle(x, y, radius) {
        this.init(x, y, radius);
    }

    Particle.prototype = {
        init: function (x, y, radius) {
            this.alive = true;
            this.radius = radius || 10;
            this.wander = 0.15;
            this.theta = random(TWO_PI);
            this.drag = 0.92;
            this.color = '#ffeb3b';

            this.x = x || 0.0;
            this.y = y || 0.0;
            this.vx = 0.0;
            this.vy = 0.0;
        },
        move: function () {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.drag;
            this.vy *= this.drag;
            this.theta += random(-0.5, 0.5) * this.wander;
            this.vx += sin(this.theta) * 0.1;
            this.vy += cos(this.theta) * 0.1;
            this.radius *= 0.96;
            this.alive = this.radius > 0.5;
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, TWO_PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    };
    const MAX_PARTICLES = 100;
    const MAX_PARTICLES_TOTAL = 600;
    //圆点颜色库
    const COLOURS = ["#5ee4ff", "#f44033", "#ffeb3b", "#F38630", "#FA6900", "#f403e8", "#F9D423", "#EEC632"];
    const particles = [];
    const pool = [];
    const click_particle = Sketch.create({
        container: document.getElementById('container')
    });
    click_particle.spawn = function (x, y) {
        if (particles.length >= MAX_PARTICLES_TOTAL)
            pool.push(particles.shift());
        let particle = pool.length ? pool.pop() : new Particle();
        particle.init(x, y, random(5, 30));//圆点大小范围
        particle.wander = random(0.5, 5.0);
        particle.color = random(COLOURS);
        particle.drag = random(0.93, 0.99);
        let theta = random(TWO_PI);
        let force = random(1, 20);
        particle.vx = sin(theta) * force;
        particle.vy = cos(theta) * force;
        particles.push(particle);
    };
    click_particle.update = function () {
        let i, particle;
        for (i = particles.length - 1; i >= 0; i--) {
            particle = particles[i];
            if (particle.alive)
                particle.move();
            else
                pool.push(particles.splice(i, 1)[0]);
        }
    };
    click_particle.draw = function () {
        click_particle.globalCompositeOperation = 'lighter';
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw(click_particle);
        }
    };
    document.addEventListener("mousedown", function (e) {
        let max, j;
        //排除一些元素
        "TEXTAREA" !== e.target.nodeName && "INPUT" !== e.target.nodeName && "A" !== e.target.nodeName && "I" !== e.target.nodeName && "IMG" !== e.target.nodeName
        && function () {
            for (max = random(MAX_PARTICLES / 2, MAX_PARTICLES), j = 0; j < max; j++)
                click_particle.spawn(e.clientX, e.clientY);
        }();
    });
}