uniform vec3 uColor;
uniform vec3 uAmbientLightColor;
uniform float uAmbientLightIntensity;
uniform vec3 uDirectionalLightColor;
uniform float uDirectionalLightIntensity;
uniform vec3 uDirectionalLightPosition;
uniform float uDirectionalLightSpecularPower;
uniform vec3 uPointLightColor;
uniform float uPointLightIntensity;
uniform vec3 uPointLightPosition;
uniform float uPointLightSpecularPower;
uniform float uPointLightDecay;

varying vec3 vNormal;
varying vec3 vPosition;

#include ../includes/ambientLight.glsl;
#include ../includes/directionalLight.glsl;
#include ../includes/pointLight.glsl;

void main()
{
    vec3 viewDirection = normalize(vPosition-cameraPosition) ;
    vec3 color = uColor;

    //light

    vec3 light = vec3(0.0);
    vec3 normal = normalize(vNormal);

    light+=ambientLight(uAmbientLightColor,uAmbientLightIntensity);
    
    light+=directionalLight(
        uDirectionalLightColor,
        uDirectionalLightIntensity,
        normal,
        uDirectionalLightPosition,
        viewDirection,
        uDirectionalLightSpecularPower);

    light+=pointLight(
        uPointLightColor,
        uPointLightIntensity,
        normal,
        uPointLightPosition,
        viewDirection,
        uPointLightSpecularPower,
        vPosition,
        uPointLightDecay);

    light+=pointLight(
        vec3(0.0,0.9,0.5),  //color
        0.8,                //intensity
        normal,             //normal
        vec3(2.5,1.5,1.0),  //position
        viewDirection,      //direction
        30.0,               //specular power
        vPosition,          //view position
        0.1);               //decay 

    color*=light;

    // Final color
    gl_FragColor = vec4(color, 1.0);  
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}