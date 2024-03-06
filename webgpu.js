// 使用するライブラリのインポート
const { GPUCanvasContext } = require("@webgpu/gu");

// canvas要素を取得
const canvas = document.getElementById("canvas");

// GPUコンテキストを作成
const gpu = new GPUCanvasContext(canvas);

// 頂点データ
const vertices = [
  // 前面
  -1, -1, 1,   1, -1, 1,   1, 1, 1,  -1, 1, 1,
  // 背面
  -1, -1, -1,  -1, 1, -1,  1, 1, -1,  1, -1, -1,
  // 右面
  1, -1, 1,   1, -1, -1,  1, 1, -1,  1, 1, 1,
  // 左面
  -1, -1, 1,  -1, 1, 1,  -1, 1, -1,  -1, -1, -1,
  // 上面
  -1, 1, 1,   1, 1, 1,   1, 1, -1,  -1, 1, -1,
  // 下面
  -1, -1, -1,  1, -1, -1,  1, -1, 1,  -1, -1, 1,
];

// インデックスデータ
const indices = [
  0, 1, 2,  0, 2, 3,
  4, 5, 6,  4, 6, 7,
  8, 9, 10, 8, 10, 11,
  12, 13, 14, 12, 14, 15,
  16, 17, 18, 16, 18, 19,
  20, 21, 22, 20, 22, 23,
];

// 頂点バッファを作成
const vertexBuffer = gpu.createBuffer(vertices, GPUBufferUsage.VERTEX);

// インデックスバッファを作成
const indexBuffer = gpu.createBuffer(indices, GPUBufferUsage.INDEX);

// シェーダーコード
const shader = `
struct VertexInput {
  position : vec3<f32>;
};

struct VertexOutput {
  position : vec4<f32>;
};

@stage(vertex)
fn main(input : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.position = vec4<f32>(input.position, 1.0);
  return output;
}

@stage(fragment)
fn main() -> vec4<f32> {
  return vec4<f32>(1.0, 0.0, 0.0, 1.0);
}
`;

// シェーダーモジュールを作成
const shaderModule = gpu.createShaderModule(shader);

// パイプラインレイアウトを作成
const pipelineLayout = gpu.createPipelineLayout({
  vertex: {
    buffers: [
      {
        arrayStride: 12,
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x3",
          },
        ],
      },
    ],
  },
});

// パイプラインを作成
const pipeline = gpu.createPipeline({
  layout: pipelineLayout,
  shader
