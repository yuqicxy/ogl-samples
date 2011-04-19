#version 410 core

// Declare all the semantics
#define ATTR_POSITION	0
#define ATTR_COLOR		3
#define ATTR_TEXCOORD	4
#define FRAG_COLOR		0

uniform sampler2D Diffuse;

struct vertex
{
	vec2 Texcoord;
};

in vertex Vertex;

layout(location = FRAG_COLOR, index = 0) out vec4 Color;

void main()
{
	vec2 Level = textureQueryLod(Diffuse, Vertex.Texcoord);
	int LevelMin = int(ceil(Level.x));
	int LevelMax = int(floor(Level.x));
	vec2 SizeMin = textureSize(Diffuse, LevelMin) - 1;
	vec2 SizeMax = textureSize(Diffuse, LevelMax) - 1;	
	vec2 TexcoordMin = Vertex.Texcoord * SizeMin;
	vec2 TexcoordMax = Vertex.Texcoord * SizeMax;	
	ivec2 CoordMin = ivec2(Vertex.Texcoord * SizeMin);
	ivec2 CoordMax = ivec2(Vertex.Texcoord * SizeMax);
	
	vec4 TexelMin00 = texelFetch(Diffuse, CoordMin + ivec2(0, 0), LevelMin);
	vec4 TexelMin10 = texelFetch(Diffuse, CoordMin + ivec2(1, 0), LevelMin);
	vec4 TexelMin11 = texelFetch(Diffuse, CoordMin + ivec2(1, 1), LevelMin);
	vec4 TexelMin01 = texelFetch(Diffuse, CoordMin + ivec2(0, 1), LevelMin);
	
	vec4 TexelMax00 = texelFetch(Diffuse, CoordMax + ivec2(0, 0), LevelMax);
	vec4 TexelMax10 = texelFetch(Diffuse, CoordMax + ivec2(1, 0), LevelMax);
	vec4 TexelMax11 = texelFetch(Diffuse, CoordMax + ivec2(1, 1), LevelMax);
	vec4 TexelMax01 = texelFetch(Diffuse, CoordMax + ivec2(0, 1), LevelMax);
	
	vec4 TexelMin0 = mix(TexelMin00, TexelMin01, fract(TexcoordMin.y));
	vec4 TexelMin1 = mix(TexelMin10, TexelMin11, fract(TexcoordMin.y));
	vec4 TexelMin  = mix(TexelMin0, TexelMin1, fract(TexcoordMin.x));
	
	vec4 TexelMax0 = mix(TexelMax00, TexelMax01, fract(TexcoordMax.y));
	vec4 TexelMax1 = mix(TexelMax10, TexelMax11, fract(TexcoordMax.y));
	vec4 TexelMax  = mix(TexelMax0, TexelMax1, fract(TexcoordMax.x));

	Color = mix(TexelMax, TexelMin, fract(Level.x));
}
