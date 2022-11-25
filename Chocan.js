class Circulo
{
    /**
     * 
     * @param {Number} r 
     * @param {Number} d 
     * @param {Number} ang 
     * @param {Number} posX 
     * @param {Number} posY 
     * @param {Number} moving 
     * @param {Number} speed 
     * @param {string} color
     */
    constructor(r, d, ang, posX, posY, moving, speed, color)
    {
        this.r          = r;
        this.d          = d;
        this.ang        = ang;
        this.posX       = posX;
        this.posY       = posY;
        this.moving     = moving;
        this.speed      = speed;
        this.color      = color;
    }

    /**
     * Mueve el círculo en la dirección actual
     */
    move()
    {
        this.posX += this.speed * Math.cos(this.ang); 
        this.posY += this.speed * Math.sin(this.ang); 
    }

    /**
     * Dibuja el circulo
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx)
    {
        circulo(this.posX, this.posY, this.r, 0, 2*Math.PI, ctx, this.color, true);
    }
    
    /**
     * Calcula la distancia entre los centros de los circulos
     * @param       {Circulo} other 
     * @returns     {Number}
     */
    distance(other)
    {
        return (Math.sqrt(Math.pow(other.posX - this.posX, 2) + Math.pow(other.posY - this.posY, 2)));
    }

    /**
     * Chequea si dos circulos chocan
     * @param       {Circulo} other 
     * @returns     {Boolean}
     */
    isCrash(other)
    {
        if (this == other)
            return false;
        if (this.distance(other) <= this.r + other.r)
            return true;
        return false;
    }

    turnOther(other)
    {
        if (this.isCrash(other))
        {
            this.ang = this.ang + Math.PI/2;
        }
    }

    /**
     * Chequea que el circulo no choque con el borde
     * @param   {HTMLCanvasElement} canvas 
     * @returns {boolean}
     */
    borderCrash(canvas)
    {
        if (this.posX - this.r < 0 || this.posY - this.r < 0 || this.posX + this.r > canvas.width || this.posY + this.r > canvas.height)
            return true;
        return false;
    }
    
    /**
     * Gira si toca la pared
     * @param   {HTMLCanvasElement} canvas  
     * @return  {boolean}
     */
    turnWall(canvas)
    {
        if (this.borderCrash(canvas))
        {
            this.ang = this.ang + Math.PI/2;
            return true;
        }
        return false;
    }
}

/**
 * @type {HTMLCanvasElement}
 */
var canvas  = document.getElementById('chocorio');
/**
 * @type {CanvasRenderingContext2D}
 */
var ctx     = canvas.getContext('2d');

/**
 * Dibuja un circulo con los datos dados
 * @param {int}                         x
 * @param {int}                         y
 * @param {int}                         r
 * @param {float}                       i 
 * @param {float}                       f
 * @param {CanvasRenderingContext2D}    ctx
 * @param {string}                      color
 * @param {boolean}                     fill
 */
function circulo(x, y, r, i, f, ctx, color, fill)
{
    var grad            = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'white');
    ctx.beginPath();
    ctx.strokeStyle     = color;
    ctx.fillStyle       = grad;
    ctx.lineWidth       = 0;
    ctx.arc(x, y, r, i, f);
    ctx.stroke();
    if (fill)
        ctx.fill();
    ctx.closePath();
}

/**
 * Bucle principal
 * @param {Circulo[]}                   circulos 
 * @param {CanvasRenderingContext2D}    ctx 
 */
function loop(circulos, ctx)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < circulos.length; i++)
    {
        circulos[i].draw(ctx);
        circulos[i].move();
        circulos[i].turnWall(canvas)
        for (var j = 0; j < circulos.length; j++)
        {
            circulos[i].turnOther(circulos[j]);
        }
    }
}

function main()
{
    var circulos = [];

    circulos.push(new Circulo(100, 0, Math.PI/4, 200, 200, 1, 1, 'red'));
    circulos.push(new Circulo(100, 0, Math.PI/2, 800, 200, 1, 2, 'blue'));
    circulos.push(new Circulo(50, 0, -Math.PI/8, 400, 100, 1, .1, 'green'));

    setInterval(loop, 1, circulos, ctx)
}

main();