#version 330 core
out vec4 FragColor;
in vec2 uv;
uniform float time;

const float screenWidth=800;
const float PI =3.14157;
float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = screenWidth/freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}
//	Classic Perlin 3D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
float cnoise2(vec3 p,int n){
  float k=0;
  for(int i=1;i<=n;i++){
    k+=cnoise(p*i)/i;
  }
  return k;
}
vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
				   dot(p,vec2(279.5,183.3)), 
				   dot(p,vec2(419.2,371.9)) );
	return fract(sin(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v ){
    vec2 p = floor(x);
    vec2 f = fract(x);
		
	float k = 1.0+63.0*pow(1.0-v,4.0);
	
	float va = 0.0;
	float wt = 0.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = vec2( float(i),float(j) );
		vec3 o = hash3( p + g )*vec3(u,u,1.0);
		vec2 r = g - f + o.xy;
		float d = dot(r,r);
		float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
		va += o.z*ww;
		wt += ww;
    }
	
    return va/wt;
}
vec3 rotateY(vec3 v, float theta) {
    float rad = radians(theta);
    float c = cos(rad);
    float s = sin(rad);
    
    mat3 m = mat3(
        vec3(c,  0.0, -s),
        vec3(0.0, 1.0,  0.0),
        vec3(s,  0.0,  c)  
    );
    
    return m * v;
}
float stars(vec2 uv, float density) {
    vec2 cell = floor(uv * density);
    vec2 local = fract(uv * density);
    vec2 starPos = vec2(rand(cell), rand(cell + 7.3));
    float d = length(local - starPos);
    return smoothstep(0.05, 0.0, d) * rand(cell + 13.1);
}
vec3 clacLandTerrain(float elevation,vec3 pos){
  if(elevation<0.2){
    //beach
    return vec3(207, 240, 168)/255;
  }else if(elevation<0.9){
    //greens
    return vec3(50, 230, 98)/255*(0.8+cnoise2(pos*15,3)*0.2);
  }else{
    return vec3(247, 252, 255)/255;
  }
}
vec3 transform2dTo3d(vec2 p,float r){
return vec3(p,sqrt(r*r-p.x*p.x-p.y*p.y));
}
vec3 calculatePlanet(vec2 clip,float planetScreenSpace,vec3 lightDir){
  vec3 pos=transform2dTo3d(clip,planetScreenSpace);
  pos=rotateY(pos,time);
  vec3 normal=normalize(pos);
  if(length(clip)>planetScreenSpace){
    
    vec3 o=vec3(2, 5, 28)/255;
    float s=stars(clip,100);
    float stellarCloud=pNoise(clip*600,6);
    o+=s*stellarCloud*6.4;//stellar stars
    o+=stellarCloud*0.2;//stellar cloud light
    o+=stars(clip,30)*0.5;//non cloud star
    // o+=smoothstep(1,0,(length(clip)-planetScreenSpace)*10);  //halo around planet
    
    return o;
  }
  float light=min(1,0.2+dot(normal,lightDir));

  vec3 outCol;//base color blue
  float elevation=cnoise2(pos*5,7);
  bool isLand=elevation>0.1;
  if(isLand){
    outCol=clacLandTerrain(elevation,pos);
  }else{
    //iswater
    // light=dot(normal,lightDir)>0.98?0.5+dot(normal,lightDir):light;

    float waterNoise=cnoise2(pos*5,8);
    outCol=vec3(58, 170, 240)/255*(0.9+0.1*waterNoise);
    light+=max(1,dot(normal,lightDir))*0.05;

  }

  return  vec3(outCol)*light;

}

void main()
{
  
  vec2 clip = (gl_FragCoord.xy / vec2(800)) * 2.0 - 1.0;
  float r=length(clip);
  float planetScreenSpace=0.5;
  vec3 lightDir=normalize(vec3(1,-1,1));
  vec4 planetTex =vec4(calculatePlanet(clip,planetScreenSpace,lightDir),1);

  //atmostsphere

  float atmostSphereThickness=0.1;
  float atmostsphereRadius=planetScreenSpace+atmostSphereThickness;
  vec3 atmPos=transform2dTo3d(clip,atmostsphereRadius);
  vec3 atmNormal=normalize(atmPos);
  float k=max(0,1-smoothstep(0,atmostSphereThickness,abs(r - planetScreenSpace)))*0.4;
  float shadow=min(1,0.2+dot(atmNormal,lightDir));//shadow on atmostsphere
  vec3 atmostsphereTex=vec3(k,k,k);
  atmostsphereTex*=vec3(0, 213, 255)/255;//hue for atmostsphere

//cloud
  vec3 cloudPos=transform2dTo3d(clip,planetScreenSpace+atmostSphereThickness*0.5);

  float cloudVar=cnoise2(cloudPos*10+time*vec3(0.042,0.63,0.348)/5,8);
  vec4 cloudTex=vec4(vec3(float(cloudVar>0.2)),0.2);



  FragColor=planetTex+(vec4(atmostsphereTex,1)+cloudTex*0.8)*shadow;

}
