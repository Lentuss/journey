uniform float uTime;
uniform vec3 uColor;
uniform float uStripesPower;

varying vec3 vPosition;
varying vec3 vNormal;

void main(){
    //normal
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing){
        normal*=-1.0;
    }

    //stripes
   float stripes = mod(vPosition.y*uStripesPower - uTime*0.1, 1.0);
   stripes=pow(stripes,3.0);

   //fresnel

   vec3 viewDirection = normalize(vPosition - cameraPosition);
   float fresnel =1.0+ dot(viewDirection, normal);
   fresnel = pow(fresnel, 2.0);

   //falloff

    float falloff = smoothstep(0.8,0.0, fresnel);

   //hologram

    float holographic = fresnel*stripes; 
    holographic += fresnel;
    holographic*=falloff;

    //final color
    gl_FragColor = vec4(uColor,holographic);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}