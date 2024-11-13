const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported in this browser.");
}

let vertices = [
    -0.5, 0.0,
    0.0, 0.0
];

let lineWidth = document.getElementById("lineWidth").value;
document.getElementById("lineWidth").addEventListener("input", (event) => {
    lineWidth = event.target.value;
    drawLine();
});

function generateSegment() {
    const lastX = vertices[vertices.length - 2];
    const lastY = vertices[vertices.length - 1];
    const newX = lastX + (Math.random() * 0.4 - 0.2);
    const newY = lastY + (Math.random() * 0.4 - 0.2);
    vertices.push(newX, newY);
    drawLine();
}

function clearCanvas() {
    vertices = [-0.5, 0.0, 0.0, 0.0];
    drawLine();
}

function initBuffer() {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    return buffer;
}

function drawLine() {
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShaderSource = `
        attribute vec2 coordinates;
        void main(void) {
            gl_Position = vec4(coordinates, 0.0, 1.0);
            gl_PointSize = 10.0;
        }`;
    const fragmentShaderSource = `
        precision mediump float;
        void main(void) {
            gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
        }`;

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vertexShaderSource);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fragmentShaderSource);
    gl.compileShader(fragShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const buffer = initBuffer();

    const coord = gl.getAttribLocation(shaderProgram, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    gl.lineWidth(lineWidth);
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
    const y = ((canvas.height - (event.clientY - rect.top)) / canvas.height) * 2 - 1;
    vertices.push(x, y);
    drawLine();
});

drawLine();
