export class CanvasLocal {
    constructor(graphics, canvas) {
        this.validateInputs(graphics, canvas);
        
        this.graphics = graphics;
        this.canvas = canvas;

        // Configuración de dimensiones
        this.rWidth = 12;
        this.rHeight = 8;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;

        // Configuración de escala y centro
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 12;
        this.centerY = (this.maxY / 8) * 7;

        // Constantes de estilo
        this.SHADOW_COLOR = 'rgba(0, 100, 255, 0.2)';
        this.AXIS_COLOR = 'black';
        this.AXIS_WIDTH = 1.5;
        this.BAR_SHADOW = 'rgb(238, 255, 0)';
        this.BAR_LINE_WIDTH = 2.5;
        this.PROJECTION_COLOR = 'rgba(234, 0, 255, 0.97)';
        this.BASE_3D_COLOR = 'rgb(255, 0, 255)';
        this.VALUE_FONT = '35px Arial';
    }

    validateInputs(graphics, canvas) {
        if (!graphics || !canvas) {
            throw new Error('Graphics context and canvas are required');
        }
        if (canvas.width <= 0 || canvas.height <= 0) {
            throw new Error('Canvas dimensions must be positive');
        }
    }

    // Conversión de coordenadas
    iX(x) {
        return Math.round(this.centerX + x / this.pixelSize);
    }

    iY(y) {
        return Math.round(this.centerY - y / this.pixelSize);
    }

    // Métodos de dibujo básicos
    drawLine(x1, y1, x2, y2, color = this.AXIS_COLOR, width = this.AXIS_WIDTH) {
        this.graphics.beginPath();
        this.graphics.strokeStyle = color;
        this.graphics.lineWidth = width;
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.stroke();
    }

    drawText(text, x, y, font = this.VALUE_FONT, color = 'black', align = 'center') {
        this.graphics.font = font;
        this.graphics.textAlign = align;
        this.graphics.fillStyle = color;
        this.graphics.fillText(text, x, y);
    }

    // Métodos de sombra
    setShadow(color, blur = 10) {
        this.graphics.shadowColor = color;
        this.graphics.shadowBlur = blur;
        this.graphics.shadowOffsetX = 0;
        this.graphics.shadowOffsetY = 0;
    }

    clearShadow() {
        this.graphics.shadowColor = 'transparent';
        this.graphics.shadowBlur = 0;
    }

    // Métodos para dibujar elementos específicos
    drawBackground() {
        const gradient = this.graphics.createLinearGradient(0, 0, 0, this.maxY);
        gradient.addColorStop(0, '#f0f8ff');
        gradient.addColorStop(1, '#d0e8ff');
        this.graphics.fillStyle = gradient;
        this.graphics.fillRect(0, 0, this.maxX + 1, this.maxY + 1);
    }

    drawAxes() {
        this.setShadow(this.SHADOW_COLOR, 5);
        this.drawLine(this.iX(0), this.iY(0), this.iX(9), this.iY(0));
        this.drawLine(this.iX(0), this.iY(0), this.iX(0), this.iY(8));
        this.clearShadow();
    }

    drawBar(x, y, height, color) {
        const g = this.graphics;

        // Estilo con sombra
        this.setShadow(this.BAR_SHADOW, 15);
        g.fillStyle = color;
        g.strokeStyle = 'black';
        g.lineWidth = this.BAR_LINE_WIDTH;

        // Dibujo de barra con efecto 3D
        g.beginPath();
        g.moveTo(this.iX(x), this.iY(0));
        g.lineTo(this.iX(x - 0.5), this.iY(0.5));
        g.lineTo(this.iX(x - 0.5), this.iY(y + height));
        g.lineTo(this.iX(x), this.iY(y + height - 0.5));
        g.lineTo(this.iX(x + 0.5), this.iY(y + height));
        g.lineTo(this.iX(x + 0.5), this.iY(0.5));
        g.closePath();

        g.fill();
        g.stroke();
        this.clearShadow();

        // Línea vertical central
        this.drawLine(this.iX(x), this.iY(-0.001), this.iX(x), this.iY(y + height - 0.5));

        // Proyección vertical
        g.lineWidth = 1;
        g.strokeStyle = this.PROJECTION_COLOR;
        this.drawLine(this.iX(x - 0.5), this.iY(y + height), this.iX(x - 0.5), this.iY(this.rHeight - 2));
        this.drawLine(this.iX(x), this.iY(y + height - 0.5), this.iX(x), this.iY(this.rHeight - 2.5));
        this.drawLine(this.iX(x + 0.5), this.iY(y + height), this.iX(x + 0.5), this.iY(this.rHeight - 2));

        // Base inferior 3D
        g.strokeStyle = this.BASE_3D_COLOR;
        this.drawLine(this.iX(x - 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 1.5));
        this.drawLine(this.iX(x + 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 1.5));
        this.drawLine(this.iX(x - 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 2.5));
        this.drawLine(this.iX(x + 0.5), this.iY(this.rHeight - 2), this.iX(x), this.iY(this.rHeight - 2.5));
    }

    drawValueLabel(value, x) {
        this.setShadow('rgb(255, 255, 255)', 8);
        this.drawText(value.toString(), this.iX(x), this.iY(-0.8));
        this.clearShadow();
    }

    // Método principal para pintar el gráfico
    paint(data = [10, 55, 20, 25, 66], colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']) {
        if (!data.length || data.length !== colors.length) {
            throw new Error('Data and colors arrays must have the same length');
        }

        const maxVal = this.getMaxRounded(data);

        // Dibujar fondo
        this.drawBackground();

        // Dibujar ejes
        this.drawAxes();

        // Dibujar barras
        const spacing = 8.1 / data.length;
        let xPos = 1;

        for (let i = 0; i < data.length; i++, xPos += spacing) {
            const scaledHeight = data[i] * (this.rHeight - 2) / maxVal;
            this.drawBar(xPos, 0, scaledHeight, colors[i]);
            this.drawValueLabel(data[i], xPos);
        }
    }

    getMaxRounded(values) {
        const maxValue = Math.max(...values);
        return Math.ceil(maxValue / 10) * 10;
    }
}