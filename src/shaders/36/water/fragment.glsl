uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;
#include ../includes/pointLight.glsl;

void main()
{
    //  vec3 color = vec3(1.0);
    vec3 viewDirection = normalize(vPosition-cameraPosition) ;
    //light

    vec3 light = vec3(0.0);
    vec3 normal = normalize(vNormal);

        light+=pointLight(
        vec3(1.0),  //color
        10.8,               //intensity
        normal,             //normal
        vec3(0.0,0.25,0.0 ),//position
        viewDirection,      //direction
        30.0,               //specular power
        vPosition,          //position
        0.95                //decay
        );              


    //base color
    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    mixStrength = smoothstep(0.0,1.0,mixStrength);
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
    
    color*=light; 
    
    //final color
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
    #include <tonemapping_fragment>
}