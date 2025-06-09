export class CanvasLocal {
  //atributos
  protected graphics: CanvasRenderingContext2D;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;
  
  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.rWidth = 12;
    this.rHeight = 8;
    this.maxX = canvas.width - 1;
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX / 12;
    this.centerY = this.maxY / 8 * 7;
  }

  iX(x: number): number { return Math.round(this.centerX + x / this.pixelSize); }
  iY(y: number): number { return Math.round(this.centerY - y / this.pixelSize); }
  
  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }
  
  drawRmboide(x1: number, y1: number, x2: number, y2: number,
              x3: number, y3: number, x4: number, y4: number, color: string): void {
    this.graphics.fillStyle = color;
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.lineTo(x3, y3);
    this.graphics.lineTo(x4, y4);
    this.graphics.closePath();
    this.graphics.stroke();
    this.graphics.fill();
  }

  fx(x: number): number {
    return Math.sin(x * 2.5);
  }

  maxH(h: number[]): number {
    let max = h[0];
    for (let i = 1; i < h.length; i++) {
      if (max < h[i])
        max = h[i];
    }
    let res: number;
    let pot: number = 10;
    while (pot < max) {
      pot *= 10;
    }
    pot /= 10;
    res = Math.ceil(max / pot) * pot;
    return res;
  }
  
  barra(x: number, y: number, alt: number, color: string): void {
    // Configurar el color de relleno
    this.graphics.fillStyle = color;
    
    // Comenzar el trazado de la barra
    this.graphics.beginPath();
    this.graphics.moveTo(this.iX(x), this.iY(0));
    this.graphics.lineTo(this.iX(x - 0.5), this.iY(0.5));
    this.graphics.lineTo(this.iX(x - 0.5), this.iY(y + alt));
    this.graphics.lineTo(this.iX(x), this.iY(y + alt - 0.5));
    this.graphics.lineTo(this.iX(x + 0.5), this.iY(y + alt));
    this.graphics.lineTo(this.iX(x + 0.5), this.iY(0.5));
    this.graphics.lineTo(this.iX(x), this.iY(0));
    this.graphics.closePath();
    
    // Rellenar la barra con el color especificado
    this.graphics.fill();
    
    // Dibujar el borde de la barra
    this.graphics.strokeStyle = 'black';
    this.graphics.stroke();
    
    // Dibujar las líneas de sombra/proyección
    this.graphics.strokeStyle = 'gray';
    this.drawLine(this.iX(x - 0.5), this.iY(y + alt), this.iX(x - 0.5), this.iY(this.rHeight - 2));
    this.drawLine(this.iX(x), this.iY(y + alt - 0.5), this.iX(x), this.iY(this.rHeight - 2.5));
    this.drawLine(this.iX(x + 0.5), this.iY(y + alt), this.iX(x + 0.5), this.iY(this.rHeight - 2));
    this.drawLine(this.iX(x - 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 1.5));
    this.drawLine(this.iX(x + 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 1.5));
    this.drawLine(this.iX(x - 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 2.5));
    this.drawLine(this.iX(x + 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 2.5));
    this.graphics.strokeStyle = 'black';
  }

  paint(): void {
    let h: number[] = [30, 80, 50, 25, 85];
    let maxEsc: number;
    let colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    maxEsc = this.maxH(h);

    // Dibujar ejes
    this.graphics.strokeStyle = 'black';
    this.drawLine(this.iX(0), this.iY(0), this.iX(8), this.iY(0)); // Eje X
    this.drawLine(this.iX(0), this.iY(0), this.iX(0), this.iY(8));  // Eje Y
    
    // Dibujar las barras con colores
    let i = 0;
    for (let x = 0; x < 8; x += (8 / (h.length * 1))) {
      if (i < h.length) {
        this.barra(x, 0, h[i] * (this.rHeight - 2) / maxEsc, colors[i]);
        i++;
      }
    }
    
    // Dibujar los valores de las barras
    i = 0;
    this.graphics.font = '12px Arial';
    this.graphics.textAlign = 'center';
    for (let x = 0; x < 8; x += (8 / (h.length * 1))) {
      if (i < h.length) {
        this.graphics.fillStyle = 'black';
        this.graphics.fillText(h[i++] + "", this.iX(x), this.iY(-0.5));
      }
    }
  }
}